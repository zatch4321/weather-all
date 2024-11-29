export function isDaytime(timestamp, sunrise, sunset) {
    const currentTime = new Date(timestamp);
    const sunriseTime = new Date(sunrise * 1000);
    const sunsetTime = new Date(sunset * 1000);
    
    return currentTime >= sunriseTime && currentTime < sunsetTime;
}

export function formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}