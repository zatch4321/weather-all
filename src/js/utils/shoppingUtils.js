export function getShoppingLinks(weatherType, temperature) {
    const categories = getClothingCategories(weatherType, temperature);
    return categories.map(category => ({
        category: category.name,
        items: getItemLinks(category.keywords)
    }));
}

function getClothingCategories(weatherType, temperature) {
    const categories = [];
    
    if (temperature < 15) {
        categories.push({
            name: 'Winter Wear',
            keywords: ['winter jacket', 'sweater', 'thermal wear']
        });
    } else if (temperature < 25) {
        categories.push({
            name: 'Light Layers',
            keywords: ['light jacket', 'full sleeve t-shirt', 'hoodie']
        });
    } else {
        categories.push({
            name: 'Summer Wear',
            keywords: ['cotton t-shirt', 'breathable shirt', 'summer clothing']
        });
    }

    if (weatherType === 'Rain') {
        categories.push({
            name: 'Rain Protection',
            keywords: ['raincoat', 'umbrella', 'waterproof jacket']
        });
    }

    return categories;
}

function getItemLinks(keywords) {
    const encodedKeywords = encodeURIComponent(keywords.join(' '));
    return [
        {
            name: 'Amazon India',
            url: `https://www.amazon.in/s?k=${encodedKeywords}`
        },
        {
            name: 'Flipkart',
            url: `https://www.flipkart.com/search?q=${encodedKeywords}`
        },
        {
            name: 'Myntra',
            url: `https://www.myntra.com/${encodedKeywords.replace(/ /g, '-')}`
        },
        {
            name: 'AJIO',
            url: `https://www.ajio.com/search/?text=${encodedKeywords}`
        }
    ];
}