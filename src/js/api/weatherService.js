import { makeApiRequest } from '../utils/apiUtils.js';
import { config } from '../config.js';
import { getCoordinates } from './geocodingService.js';

export async function getWeatherData(location) {
    try {
        let coordinates;
        if (typeof location === 'string') {
            coordinates = await getCoordinates(location);
        } else if (location && typeof location === 'object' && 'lat' in location && 'lon' in location) {
            coordinates = location;
        } else {
            throw new Error('Invalid location format');
        }

        if (!coordinates || typeof coordinates.lat !== 'number' || typeof coordinates.lon !== 'number') {
            throw new Error('Invalid coordinates received');
        }
        
        const weatherData = await makeApiRequest(`${config.OPEN_METEO_URL}/forecast`, {
            latitude: coordinates.lat,
            longitude: coordinates.lon,
            current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,is_day',
            hourly: 'temperature_2m,relative_humidity_2m,wind_speed_10m,is_day',
            timezone: 'auto'
        });

        if (!weatherData?.current || !weatherData?.hourly) {
            throw new Error('Invalid weather data received');
        }

        const current = weatherData.current;
        const hourly = weatherData.hourly;
        const currentTemp = current.temperature_2m;
        const currentTempF = (currentTemp * 9/5) + 32;

        const locationName = coordinates.name || `Location (${coordinates.lat.toFixed(4)}°, ${coordinates.lon.toFixed(4)}°)`;
        const locationCountry = coordinates.country ? `, ${coordinates.country}` : '';

        return {
            current: {
                temp: currentTemp,
                temp_f: currentTempF,
                humidity: current.relative_humidity_2m,
                wind_speed: current.wind_speed_10m,
                weather: getWeatherType(current.weather_code, current.is_day),
                is_day: current.is_day,
                dt: new Date(current.time).getTime()
            },
            hourly: hourly.time.map((time, index) => ({
                time: new Date(time).getHours() + ':00',
                temp: hourly.temperature_2m[index],
                temp_f: (hourly.temperature_2m[index] * 9/5) + 32,
                humidity: hourly.relative_humidity_2m[index],
                wind_speed: hourly.wind_speed_10m[index],
                is_day: hourly.is_day[index]
            })).slice(0, 24),
            coord: {
                lat: coordinates.lat,
                lon: coordinates.lon
            },
            name: locationName,
            country: locationCountry
        };
    } catch (error) {
        console.error('Weather API Error:', error);
        throw new Error(error.message || 'Unable to fetch weather data. Please try again.');
    }
}

function getWeatherType(code, isDay) {
    const weatherCodes = {
        0: { 
            main: isDay ? 'Clear' : 'Clear-night',
            description: isDay ? 'Clear sky' : 'Clear night sky',
            icon: isDay ? 'clear' : 'clear-night'
        },
        1: { 
            main: isDay ? 'Clear' : 'Clear-night',
            description: isDay ? 'Mainly clear' : 'Mainly clear night',
            icon: isDay ? 'clear' : 'clear-night'
        },
        2: { 
            main: 'Clouds',
            description: 'Partly cloudy',
            icon: 'clouds'
        },
        3: { 
            main: 'Clouds',
            description: 'Overcast',
            icon: 'clouds'
        },
        45: { main: 'Mist', description: 'Foggy', icon: 'mist' },
        48: { main: 'Mist', description: 'Depositing rime fog', icon: 'mist' },
        51: { main: 'Drizzle', description: 'Light drizzle', icon: 'drizzle' },
        53: { main: 'Drizzle', description: 'Moderate drizzle', icon: 'drizzle' },
        55: { main: 'Drizzle', description: 'Dense drizzle', icon: 'drizzle' },
        61: { main: 'Rain', description: 'Slight rain', icon: 'rain' },
        63: { main: 'Rain', description: 'Moderate rain', icon: 'rain' },
        65: { main: 'Rain', description: 'Heavy rain', icon: 'rain' },
        71: { main: 'Snow', description: 'Slight snow fall', icon: 'snow' },
        73: { main: 'Snow', description: 'Moderate snow fall', icon: 'snow' },
        75: { main: 'Snow', description: 'Heavy snow fall', icon: 'snow' },
        77: { main: 'Snow', description: 'Snow grains', icon: 'snow' },
        85: { main: 'Snow', description: 'Slight snow showers', icon: 'snow' },
        86: { main: 'Snow', description: 'Heavy snow showers', icon: 'snow' },
        95: { main: 'Thunderstorm', description: 'Thunderstorm', icon: 'thunderstorm' },
        96: { main: 'Thunderstorm', description: 'Thunderstorm with slight hail', icon: 'thunderstorm' },
        99: { main: 'Thunderstorm', description: 'Thunderstorm with heavy hail', icon: 'thunderstorm' }
    };
    
    return weatherCodes[code] || { 
        main: isDay ? 'Clear' : 'Clear-night',
        description: 'Unknown',
        icon: isDay ? 'clear' : 'clear-night'
    };
}