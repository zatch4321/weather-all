import { config } from '../config.js';

let cityCache = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function searchCities(query, limit = 5) {
    if (!query || query.length < 2) return [];

    const cacheKey = query.toLowerCase();
    const cachedResult = cityCache.get(cacheKey);
    
    if (cachedResult && (Date.now() - cachedResult.timestamp < CACHE_DURATION)) {
        return cachedResult.data;
    }

    // Check for Indian states first
    const stateMatches = Object.entries(config.LOCATION_MAPPING)
        .filter(([key]) => key.includes(query.toLowerCase()))
        .map(([key, value]) => ({
            name: value.name,
            state: value.state,
            country: value.country,
            latitude: value.lat,
            longitude: value.lon,
            displayName: `${value.name}, ${value.state}, ${value.country}`
        }));

    try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=${limit}&language=en`);
        if (!response.ok) throw new Error('City search failed');
        
        const data = await response.json();
        const cities = data.results?.map(city => ({
            name: city.name,
            state: city.admin1,
            country: city.country,
            latitude: city.latitude,
            longitude: city.longitude,
            displayName: `${city.name}${city.admin1 ? `, ${city.admin1}` : ''}, ${city.country}`
        })) || [];

        // Combine and prioritize Indian locations
        const indianCities = cities.filter(city => city.country === 'India' || city.country === 'IN');
        const otherCities = cities.filter(city => city.country !== 'India' && city.country !== 'IN');
        const combinedResults = [...stateMatches, ...indianCities, ...otherCities].slice(0, limit);

        cityCache.set(cacheKey, {
            timestamp: Date.now(),
            data: combinedResults
        });

        return combinedResults;
    } catch (error) {
        console.error('City search error:', error);
        return stateMatches;
    }
}