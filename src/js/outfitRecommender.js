export function getOutfitRecommendation(weatherCondition, temperature, humidity, isDay) {
    let outfitRecommendation = "Recommended outfit:\n";
    
    // Base layer recommendations
    if (temperature < 0) {
        outfitRecommendation += "• Thermal underwear/base layer\n";
        outfitRecommendation += "• Wool socks\n";
    } else if (temperature < 10) {
        outfitRecommendation += "• Long sleeve thermal top\n";
        outfitRecommendation += "• Warm socks\n";
    }

    // Mid layer recommendations
    if (temperature < 15) {
        outfitRecommendation += "• Warm sweater or fleece\n";
    } else if (temperature < 20) {
        outfitRecommendation += "• Light sweater or long sleeve shirt\n";
    }

    // Outer layer recommendations
    switch (weatherCondition) {
        case "Clear":
            if (!isDay) {
                outfitRecommendation += "• Extra warm layer for night temperatures\n";
            }
            if (temperature >= 25) {
                outfitRecommendation += "• Light, breathable clothing\n";
                outfitRecommendation += "• Sun protection (hat, sunglasses)\n";
            } else if (temperature >= 15) {
                outfitRecommendation += "• Light jacket or cardigan\n";
            } else {
                outfitRecommendation += "• Warm winter coat\n";
                outfitRecommendation += "• Gloves and beanie\n";
            }
            break;

        case "Rain":
        case "Drizzle":
            outfitRecommendation += "• Waterproof jacket\n";
            outfitRecommendation += "• Water-resistant boots\n";
            outfitRecommendation += "• Umbrella\n";
            break;

        case "Snow":
            outfitRecommendation += "• Heavy winter coat\n";
            outfitRecommendation += "• Waterproof snow boots\n";
            outfitRecommendation += "• Insulated gloves\n";
            outfitRecommendation += "• Warm hat and scarf\n";
            break;

        // ... other weather conditions
    }

    // Humidity-based recommendations
    if (humidity >= 80) {
        outfitRecommendation += "\nHigh humidity tips:\n";
        outfitRecommendation += "• Choose moisture-wicking fabrics\n";
        outfitRecommendation += "• Avoid cotton clothing\n";
    } else if (humidity >= 60) {
        outfitRecommendation += "\nModerate humidity tip:\n";
        outfitRecommendation += "• Wear breathable fabrics\n";
    }

    return outfitRecommendation;
}