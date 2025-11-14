import api from './api';

/**
 * Fetches skills, optionally filtering by search term.
 * @param {string} searchTerm - Optional search string.
 * @returns {Promise<Array>} - Array of skill objects [{ _id, name, ... }].
 */
const searchSkills = async (searchTerm = '') => {
    try {
        const params = {};
        if (searchTerm) {
            params.search = searchTerm;
        }
        const response = await api.get('/skills', { params });
        return response.data; // Expects an array of skills
    } catch (error) {
        console.error("Failed to fetch skills:", error);
        throw error.response?.data || error;
    }
};

const skillService = {
    searchSkills,
    // Add admin CRUD functions later if needed
};

export default skillService;