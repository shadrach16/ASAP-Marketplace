// src/services/analyticsService.js (NEW FILE)

import api from './api';

/**
 * Fetches dashboard analytics for the logged-in client.
 * @returns {Promise<object>} - { totalSpend, activeJobs, completedJobs, avgRating }
 */
const getClientAnalytics = async () => {
    try {
        // This endpoint doesn't exist yet, we'll create it.
        const response = await api.get('/analytics/client');
        return response.data;
    } catch (error) {
        console.error("Get client analytics error:", error.response?.data || error.message);
        throw error.response?.data || new Error(error.message || 'Failed to fetch analytics.');
    }
};

const analyticsService = {
    getClientAnalytics,
};

export default analyticsService;