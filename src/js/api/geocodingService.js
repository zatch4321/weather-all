import { makeApiRequest } from '../utils/apiUtils.js';
import { config } from '../config.js';

export async function getCoordinates(city) {
    try {
        if (!city || typeof city !== 'string') {
            throw new Error('Invalid city name provided');
        }

        const lowercaseCity = city.toLowerCase().trim();
        
        // Check predefined locations first
        if (config.LOCATION_MAPPING[lowercaseCity]) {
            return config.LOCATION_MAPPING[lowercaseCity];
        }

        const data = await makeApiRequest(config.GEO_URL, {
            name: city,
            count: 1,
            language: 'en'
        });

        if (!data?.results?.[0]) {
            throw new Error('City not found. Please check the spelling and try again.');
        }

        const location = data.results[0];
        
        // Validate coordinates
        if (typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
            throw new Error('Invalid coordinates received from geocoding service');
        }

        return {
            lat: location.latitude,
            lon: location.longitude,
            name: location.name || city,
            country: location.country || 'Unknown',
            state: location.admin1 || ''
        };
    } catch (error) {
        console.error('Geocoding Error:', error);
        throw new Error(error.message || 'Unable to find location. Please try again.');
    }
}