export function validateCityName(city) {
    if (!city || typeof city !== 'string') {
        throw new Error("Please enter a valid city name.");
    }
    
    // Remove special characters and extra spaces
    const sanitizedCity = city.trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, ' ');
    
    if (sanitizedCity.length < 2) {
        throw new Error("City name must be at least 2 characters long.");
    }
    
    return sanitizedCity;
}