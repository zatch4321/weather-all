const API_KEY = "cb18fb31c93b21dd3bce12467170e51c";
const AQI_API_URL = "https://api.openweathermap.org/data/2.5/air_pollution?";

export async function fetchAirQualityData(lat, lon) {
    const response = await fetch(`${AQI_API_URL}lat=${lat}&lon=${lon}&appid=${API_KEY}`);
    if (!response.ok) {
        throw new Error("Unable to fetch air quality data.");
    }
    return await response.json();
}

export function getAQIDescription(aqi) {
    const descriptions = {
        1: { level: "Good", description: "Air quality is satisfactory, and air pollution poses little or no risk." },
        2: { level: "Fair", description: "Air quality is acceptable. However, there may be a risk for some people." },
        3: { level: "Moderate", description: "Members of sensitive groups may experience health effects." },
        4: { level: "Poor", description: "Everyone may begin to experience health effects." },
        5: { level: "Very Poor", description: "Health warnings of emergency conditions. Everyone is more likely to be affected." }
    };
    return descriptions[aqi] || { level: "Unknown", description: "No air quality data available." };
}