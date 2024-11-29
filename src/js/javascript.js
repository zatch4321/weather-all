$(document).ready(function () {
    const apiKey = "cb18fb31c93b21dd3bce12467170e51c";
    const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";

    const searchBox = $(".search input");
    const searchButton = $(".search button");
    const weatherIcon = $(".weather-icon");

    // Weather condition-to-icon mapping
    const weatherIcons = {
        Clear: "images/clear.png",
        Clouds: "images/clouds.png",
        Rain: "images/rain.png",
        Drizzle: "images/drizzle.png",
        Snow: "images/snow.png",
        Mist: "images/mist.png",
        Thunderstorm: "images/thunderstorm.png",
        Haze: "images/haze.png",
        Fog: "images/fog.png",
        Smoke: "images/smoke.png",
        Dust: "images/dust.png",
        Sand: "images/sand.png",
    };

    // Generate outfit recommendation based on weather
    function getOutfitRecommendation(weatherCondition, temperature, humidity) {
        let outfitRecommendation = "Recommended outfit: ";

        switch (weatherCondition) {
            case "Clear":
                if (temperature >= 30) {
                    outfitRecommendation += "Light clothing like T-shirts, shorts, and sunglasses.";
                } else if (temperature >= 20) {
                    outfitRecommendation += "Short sleeves or light dresses.";
                } else if (temperature >= 10) {
                    outfitRecommendation += "Light jackets or sweaters.";
                } else {
                    outfitRecommendation += "Warm coats and layers.";
                }
                break;

            case "Clouds":
                outfitRecommendation += "Layered clothing, light jackets, and comfortable pants.";
                break;

            case "Rain":
            case "Drizzle":
                outfitRecommendation += "Waterproof jacket, rain boots, and an umbrella.";
                break;

            case "Snow":
                outfitRecommendation += "Heavy coats, thermal layers, gloves, and insulated boots.";
                break;

            case "Mist":
            case "Fog":
                outfitRecommendation += "Warm and visible clothing, as visibility might be low.";
                break;

            case "Thunderstorm":
                outfitRecommendation += "Stay indoors if possible. Wear waterproof gear if outside.";
                break;

            case "Haze":
            case "Smoke":
            case "Dust":
            case "Sand":
                outfitRecommendation += "Protective gear like masks and sunglasses. Wear breathable fabrics.";
                break;

            default:
                outfitRecommendation += "Comfortable clothing suitable for the current conditions.";
        }

        // Add humidity-based advice
        if (humidity >= 70) {
            outfitRecommendation += " High humidity: Opt for breathable fabrics.";
        } else if (humidity >= 50) {
            outfitRecommendation += " Moderate humidity: Choose moisture-wicking materials.";
        }

        return outfitRecommendation;
    }

    // Fetch and display weather data
    async function checkWeather(city) {
        try {
            const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
            if (!response.ok) {
                throw new Error("City not found.");
            }

            const data = await response.json();
            $(".city").text(data.name);
            $(".temp").text(Math.round(data.main.temp) + "°C");
            $(".humidity").text(data.main.humidity + "%");
            $(".wind").text(data.wind.speed + " km/h");

            const weatherType = data.weather[0].main;
            const outfit = getOutfitRecommendation(weatherType, data.main.temp, data.main.humidity);

            // Update the weather icon dynamically
            weatherIcon.attr("src", weatherIcons[weatherType] || "images/default.png");

            $(".outfit-recommendation").text(outfit);
            $(".weather").fadeIn();
            $(".error").fadeOut();
        } catch (error) {
            $(".error").fadeIn().text(error.message);
            $(".weather").fadeOut();
        }
    }

    // Search button click event
    searchButton.click(function () {
        const city = searchBox.val().trim();
        if (city) {
            $(".error").fadeOut(); // Hide error if any
            $(".weather").fadeOut(); // Hide previous data
            $(".outfit-recommendation").text("Fetching weather details..."); // Loader message
            checkWeather(city);
        } else {
            alert("Please enter a city name.");
        }
    });
});
