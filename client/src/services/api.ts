import axios from 'axios';

// Get base URL from environment variables, fallback is empty for local proxy
const baseURL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Helper to ensure we always get an array of products
export const validateProductsResponse = (data: any): any[] => {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.products)) return data.products;
    return [];
};

// Helper to ensure we always get an array of categories
export const validateCategoriesResponse = (data: any): any[] => {
    if (Array.isArray(data)) return data;
    return [];
};

export default api;
