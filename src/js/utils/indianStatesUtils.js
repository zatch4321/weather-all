export function getIndianStates() {
    return Object.entries(config.LOCATION_MAPPING).map(([key, value]) => ({
        id: key,
        name: value.state || value.name,
        capital: value.name,
        coordinates: {
            lat: value.lat,
            lon: value.lon
        }
    }));
}

export function isIndianState(query) {
    return query.toLowerCase() in config.LOCATION_MAPPING;
}

export function getStateInfo(stateName) {
    const state = config.LOCATION_MAPPING[stateName.toLowerCase()];
    if (!state) return null;
    
    return {
        name: state.state || state.name,
        capital: state.name,
        coordinates: {
            lat: state.lat,
            lon: state.lon
        },
        country: state.country
    };
}