export async function makeApiRequest(url, params) {
    try {
        if (!url) {
            throw new Error('API URL is required');
        }

        const queryString = new URLSearchParams(params).toString();
        const fullUrl = `${url}?${queryString}`;
        
        const response = await fetch(fullUrl);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Resource not found. Please check your input and try again.');
            }
            if (response.status === 401) {
                throw new Error('Authentication failed. Please try again later.');
            }
            if (response.status === 429) {
                throw new Error('Too many requests. Please try again in a few minutes.');
            }
            throw new Error(`Server error (${response.status}). Please try again later.`);
        }
        
        const data = await response.json();
        
        if (!data) {
            throw new Error('No data received from the server');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Network error. Please check your connection and try again.');
        }
        throw error;
    }
}