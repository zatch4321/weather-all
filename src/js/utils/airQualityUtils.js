export function getAQIDescription(aqi) {
    if (aqi <= 50) return {
        level: "Good",
        description: "Air quality is satisfactory, and air pollution poses little or no risk.",
        color: "#00C853"
    };
    if (aqi <= 100) return {
        level: "Moderate",
        description: "Air quality is acceptable. However, there may be a risk for some people.",
        color: "#FFD600"
    };
    if (aqi <= 150) return {
        level: "Unhealthy for Sensitive Groups",
        description: "Members of sensitive groups may experience health effects.",
        color: "#FF9100"
    };
    if (aqi <= 200) return {
        level: "Unhealthy",
        description: "Everyone may begin to experience health effects.",
        color: "#FF3D00"
    };
    if (aqi <= 300) return {
        level: "Very Unhealthy",
        description: "Health alert: everyone may experience more serious health effects.",
        color: "#D50000"
    };
    
    return {
        level: "Hazardous",
        description: "Health warnings of emergency conditions. Everyone is more likely to be affected.",
        color: "#7B1FA2"
    };
}