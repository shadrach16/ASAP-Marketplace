import api from './api';

/**
 * Fetches all active categories.
 * @returns {Promise<Array>} - Array of category objects [{ _id, name, ... }].
 */
const getActiveCategories = async () => {
    try {
        const response = await api.get('/categories');
        return response.data; // Expects an array of categories
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        throw error.response?.data || error;
    }
};

const categoryService = {
    getActiveCategories,
    // Add admin CRUD functions later if needed
};

export default categoryService;