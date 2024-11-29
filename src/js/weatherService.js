import axios from 'axios';

const API_KEY = "cb18fb31c93b21dd3bce12467170e51c";
const GEO_API_URL = "https://api.openweathermap.org/geo/1.0/direct";
const WEATHER_API_URL = "https://api.openweathermap.org/data/3.0/onecall";

export async function fetchWeatherData(city) {
    try {
        // First, get coordinates for the city
        const geoResponse = await axios.get(`${GEO_API_URL}?q=${city}&limit=1&appid=${API_KEY}`);
        
        if (!geoResponse.data || geoResponse.data.length === 0) {
            throw new Error("City not found. Please check the spelling and try again.");
        }

        const { lat, lon, name, country } = geoResponse.data[0];

        // Then, get detailed weather data using OneCall API
        const weatherResponse = await axios.get(`${WEATHER_API_URL}?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=metric&appid=${API_KEY}`);

        const currentWeather = weatherResponse.data.current;
        
        // Enhanced temperature calculation considering feels_like temperature
        const actualTemp = currentWeather.temp;
        const feelsLikeTemp = currentWeather.feels_like;
        const windChill = currentWeather.wind_speed > 4.8 ? calculateWindChill(actualTemp, currentWeather.wind_speed) : actualTemp;
        
        return {
            name: city === 'kashmir' ? 'Kashmir (Srinagar)' : name,
            country,
            coord: { lat, lon },
            main: {
                temp: actualTemp,
                feels_like: feelsLikeTemp,
                effective_temp: windChill,
                humidity: currentWeather.humidity
            },
            wind: {
                speed: currentWeather.wind_speed,
                deg: currentWeather.wind_deg
            },
            weather: [{
                main: currentWeather.weather[0].main,
                description: currentWeather.weather[0].description
            }]
        };
    } catch (error) {
        if (error.response && error.response.status === 404) {
            throw new Error("City not found. Please check the spelling and try again.");
        } else if (error.response && error.response.status === 401) {
            throw new Error("Weather service authentication failed. Please try again later.");
        } else {
            throw new Error("Unable to fetch weather data. Please try again later.");
        }
    }
}

function calculateWindChill(temp, windSpeed) {
    // Wind chill formula (for temperatures at or below 10°C and wind speeds above 4.8 km/h)
    if (temp <= 10 && windSpeed > 4.8) {
        const windChill = 13.12 + 0.6215 * temp - 11.37 * Math.pow(windSpeed, 0.16) + 0.3965 * temp * Math.pow(windSpeed, 0.16);
        return Math.round(windChill * 10) / 10;
    }
    return temp;
}