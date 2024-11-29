import { makeApiRequest } from '../utils/apiUtils.js';
import { config } from '../config.js';
import dayjs from 'dayjs';

export async function getForecastData(lat, lon) {
    try {
        const data = await makeApiRequest(`${config.WEATHER_BASE_URL}/forecast`, {
            lat,
            lon,
            units: config.DEFAULT_UNITS,
            appid: config.API_KEY
        });

        return data.list.slice(0, 8).map(item => ({
            time: dayjs(item.dt * 1000).format('HH:00'),
            temp: Math.round(item.main.temp * 10) / 10,
            feels_like: Math.round(item.main.feels_like * 10) / 10,
            weather: item.weather[0]
        }));
    } catch (error) {
        console.error('Forecast API Error:', error);
        throw new Error("Unable to fetch forecast data. Please try again later.");
    }
}