export function formatTemperature(temp, includeUnit = true) {
    const celsius = Math.round(temp * 10) / 10;
    const fahrenheit = Math.round((celsius * 9/5 + 32) * 10) / 10;
    
    if (includeUnit) {
        return `${celsius}°C (${fahrenheit}°F)`;
    }
    return { celsius, fahrenheit };
}

export function calculateWindChill(temp, windSpeed) {
    if (temp <= 10 && windSpeed > 4.8) {
        const windChill = 13.12 + 0.6215 * temp - 11.37 * Math.pow(windSpeed, 0.16) + 0.3965 * temp * Math.pow(windSpeed, 0.16);
        return Math.round(windChill * 10) / 10;
    }
    return temp;
}