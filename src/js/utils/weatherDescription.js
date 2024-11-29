export function getWeatherDescription(weatherType, temperature) {
    let description = '';
    
    // Temperature description
    if (temperature <= 0) {
        description = 'Freezing cold';
    } else if (temperature < 10) {
        description = 'Very cold';
    } else if (temperature < 20) {
        description = 'Cool';
    } else if (temperature < 30) {
        description = 'Warm';
    } else {
        description = 'Hot';
    }

    // Weather condition description
    switch (weatherType) {
        case 'Clear':
            description += ' and sunny with clear skies';
            break;
        case 'Clouds':
            description += ' with cloudy skies';
            break;
        case 'Rain':
            description += ' with rainfall';
            break;
        case 'Snow':
            description += ' with snowfall';
            break;
        case 'Thunderstorm':
            description += ' with thunderstorms';
            break;
        default:
            description += ' weather';
    }

    return description;
}