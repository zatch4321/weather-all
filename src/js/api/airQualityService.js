import { makeApiRequest } from '../utils/apiUtils.js';
import { config } from '../config.js';

export async function getAirQuality(lat, lon) {
    try {
        const data = await makeApiRequest(`${config.WEATHER_BASE_URL}/air_pollution`, {
            lat: lat,
            lon: lon,
            appid: config.API_KEY
        });

        if (!data || !data.list || !data.list[0]) {
            throw new Error('Invalid air quality data received');
        }

        const airQualityData = data.list[0];
        const components = airQualityData.components;
        const aqi = calculateAQIFromComponents(components);

        return {
            aqi: airQualityData.main.aqi,
            components: components,
            raw_aqi: aqi,
            timestamp: airQualityData.dt * 1000
        };
    } catch (error) {
        console.error('Air Quality API Error:', error);
        // Return a default value instead of throwing to prevent UI disruption
        return {
            aqi: 1,
            components: {},
            raw_aqi: 50,
            timestamp: Date.now()
        };
    }
}

function calculateAQIFromComponents(components) {
    // Calculate AQI based on PM2.5 concentration (US EPA standard)
    const pm25 = components.pm2_5;
    
    if (!pm25 || pm25 < 0) return 50; // Default to moderate if no data
    
    if (pm25 <= 12.0) return Math.round((50 - 0) * (pm25 - 0) / (12.0 - 0) + 0);
    if (pm25 <= 35.4) return Math.round((100 - 51) * (pm25 - 12.1) / (35.4 - 12.1) + 51);
    if (pm25 <= 55.4) return Math.round((150 - 101) * (pm25 - 35.5) / (55.4 - 35.5) + 101);
    if (pm25 <= 150.4) return Math.round((200 - 151) * (pm25 - 55.5) / (150.4 - 55.5) + 151);
    if (pm25 <= 250.4) return Math.round((300 - 201) * (pm25 - 150.5) / (250.4 - 150.5) + 201);
    if (pm25 <= 350.4) return Math.round((400 - 301) * (pm25 - 250.5) / (350.4 - 250.5) + 301);
    return Math.round((500 - 401) * (pm25 - 350.5) / (500.4 - 350.5) + 401);
}