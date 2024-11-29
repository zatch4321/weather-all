import { getWeatherData } from './api/weatherService.js';
import { getAirQuality } from './api/airQualityService.js';
import { getOutfitRecommendation } from './outfitRecommender.js';
import { weatherIcons } from './weatherIcons.js';
import { createTemperatureChart } from './utils/chartUtils.js';
import { getAQIDescription } from './utils/airQualityUtils.js';
import { formatTemperature } from './utils/temperatureUtils.js';
import { getCurrentPosition } from './utils/geolocationUtils.js';
import { searchCities } from './utils/cityAutocomplete.js';
import { VoiceInput } from './utils/voiceInput.js';
import { getWeatherDescription } from './utils/weatherDescription.js';

document.addEventListener('DOMContentLoaded', () => {
    const searchBox = document.querySelector(".search input");
    const locationBtn = document.querySelector(".location-btn");
    const micBtn = document.querySelector(".mic-btn");
    const weatherIconElement = document.querySelector(".weather-icon");
    const weatherDiv = document.querySelector(".weather");
    const errorDiv = document.querySelector(".error");
    const suggestionsList = document.querySelector(".suggestions-list");

    let selectedCity = null;
    let isUpdating = false;

    async function updateWeatherUI(location) {
        if (isUpdating) return;
        
        try {
            isUpdating = true;
            if (errorDiv) errorDiv.style.display = "none";
            if (weatherDiv) weatherDiv.style.display = "none";
            
            const outfitRecommendation = document.querySelector(".outfit-recommendation");
            if (outfitRecommendation) {
                outfitRecommendation.textContent = "Fetching weather details...";
            }

            const weatherData = await getWeatherData(location);
            const airQualityData = await getAirQuality(weatherData.coord.lat, weatherData.coord.lon);

            const cityElement = document.querySelector(".city");
            const tempElement = document.querySelector(".temp");
            const humidityElement = document.querySelector(".humidity");
            const windElement = document.querySelector(".wind");
            const weatherDescElement = document.querySelector(".weather-description");

            if (cityElement) cityElement.textContent = `${weatherData.name}${weatherData.country}`;
            if (tempElement) tempElement.textContent = formatTemperature(weatherData.current.temp);
            if (humidityElement) humidityElement.textContent = `${weatherData.current.humidity}%`;
            if (windElement) windElement.textContent = `${Math.round(weatherData.current.wind_speed)} km/h`;

            const weatherType = weatherData.current.weather;
            if (weatherIconElement) {
                const iconClass = weatherIcons[weatherType.icon];
                weatherIconElement.className = `weather-icon ${iconClass}`;
            }

            if (weatherDescElement) {
                const weatherDesc = getWeatherDescription(weatherType.main, weatherData.current.temp);
                weatherDescElement.textContent = weatherDesc;
            }

            const aqiInfo = getAQIDescription(airQualityData.raw_aqi);
            const airQualityElement = document.querySelector(".air-quality");
            const aqiLevelElement = document.querySelector(".aqi-level");
            const aqiDescElement = document.querySelector(".aqi-description");

            if (airQualityElement) airQualityElement.style.display = "block";
            if (aqiLevelElement) {
                aqiLevelElement.textContent = `${aqiInfo.level} (${airQualityData.raw_aqi})`;
                aqiLevelElement.style.color = aqiInfo.color;
            }
            if (aqiDescElement) aqiDescElement.textContent = aqiInfo.description;
            if (airQualityElement) airQualityElement.style.backgroundColor = `${aqiInfo.color}22`;

            if (outfitRecommendation) {
                const outfit = getOutfitRecommendation(
                    weatherType.main,
                    weatherData.current.temp,
                    weatherData.current.humidity,
                    weatherData.current.is_day
                );
                outfitRecommendation.innerHTML = outfit.replace(/\n/g, '<br>');
            }

            const chartCanvas = document.getElementById('tempChart');
            if (chartCanvas) {
                createTemperatureChart(weatherData.hourly, 'tempChart');
            }

            if (weatherDiv) weatherDiv.style.display = "block";
        } catch (error) {
            console.error('Weather update error:', error);
            if (errorDiv) {
                errorDiv.style.display = "block";
                const errorMessage = errorDiv.querySelector("p");
                if (errorMessage) {
                    errorMessage.textContent = error.message;
                }
            }
            if (weatherDiv) weatherDiv.style.display = "none";
        } finally {
            isUpdating = false;
        }
    }

    async function handleSearch() {
        const query = searchBox.value.trim();
        if (!query) return;

        suggestionsList.style.display = 'none';
        
        if (selectedCity) {
            await updateWeatherUI({ lat: selectedCity.latitude, lon: selectedCity.longitude });
        } else {
            await updateWeatherUI(query);
        }
        
        selectedCity = null;
    }

    const voiceInput = new VoiceInput(searchBox, handleSearch);

    locationBtn.addEventListener("click", async () => {
        try {
            const position = await getCurrentPosition();
            await updateWeatherUI(position);
        } catch (error) {
            if (errorDiv) {
                errorDiv.style.display = "block";
                const errorMessage = errorDiv.querySelector("p");
                if (errorMessage) {
                    errorMessage.textContent = error.message;
                }
            }
        }
    });

    micBtn.addEventListener("click", () => {
        voiceInput.toggleListening();
    });

    let debounceTimeout;
    searchBox.addEventListener("input", async (e) => {
        clearTimeout(debounceTimeout);
        suggestionsList.innerHTML = '';
        selectedCity = null;

        const query = e.target.value.trim();
        if (query.length < 2) {
            suggestionsList.style.display = 'none';
            return;
        }

        debounceTimeout = setTimeout(async () => {
            const cities = await searchCities(query);
            suggestionsList.innerHTML = '';
            
            if (cities.length > 0) {
                cities.forEach(city => {
                    const li = document.createElement('li');
                    li.textContent = city.displayName;
                    li.addEventListener('click', () => {
                        searchBox.value = city.displayName;
                        selectedCity = city;
                        suggestionsList.style.display = 'none';
                        handleSearch();
                    });
                    suggestionsList.appendChild(li);
                });
                suggestionsList.style.display = 'block';
            } else {
                suggestionsList.style.display = 'none';
            }
        }, 300);
    });

    searchBox.addEventListener("keypress", e => {
        if (e.key === "Enter") handleSearch();
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            suggestionsList.style.display = 'none';
        }
    });
});