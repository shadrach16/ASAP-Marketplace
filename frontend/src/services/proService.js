import api from './api';


/**
 * Fetches the public profile data for a pro.
 * @param {string} proId - The ID of the pro user.
 * @returns {Promise<object>} - The public profile data.
 */
const getPublicProfile = async (proId) => {
    try {
        const response = await api.get(`/users/${proId}/public`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Adds a new item to the logged-in pro's portfolio.
 * @param {FormData} formData - Must include 'title', 'portfolioImage', optional 'description', 'projectUrl'.
 * @returns {Promise<object>} - The newly created portfolio item object.
 */
const addPortfolioItem = async (formData) => {
    try {
        const response = await api.post('/users/me/portfolio', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Updates an existing portfolio item.
 * @param {string} itemId - The ID of the item to update.
 * @param {FormData} formData - May include 'title', 'description', 'projectUrl', optional 'portfolioImage'.
 * @returns {Promise<object>} - The updated portfolio item object.
 */
const updatePortfolioItem = async (itemId, formData) => {
     try {
        const response = await api.put(`/users/me/portfolio/${itemId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Deletes a portfolio item.
 * @param {string} itemId - The ID of the item to delete.
 * @returns {Promise<object>} - Confirmation message.
 */
const deletePortfolioItem = async (itemId) => {
     try {
        const response = await api.delete(`/users/me/portfolio/${itemId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
// --- New Service Functions ---

/**
 * Creates a new service offering for the logged-in pro.
 * @param {FormData} formData - Includes service details and optional 'serviceImage'.
 * @returns {Promise<object>} - The created service object.
 */
const createService = async (formData) => {
    try {
        const response = await api.post('/pro/services', formData, {
             headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error) {
         throw error.response?.data || error;
    }
};

/**
 * Fetches all services belonging to the logged-in pro.
 * @returns {Promise<Array>} - Array of service objects.
 */
const getMyServices = async () => {
     try {
        const response = await api.get('/pro/me/services');
        return response.data;
    } catch (error) {
         throw error.response?.data || error;
    }
};

/**
 * Fetches active services for a specific pro (public).
 * @param {string} proId - The ID of the pro.
 * @returns {Promise<Array>} - Array of active service objects.
 */
const getProServices = async (proId) => {
     try {
        const response = await api.get(`/pro/${proId}/services`);
        return response.data;
    } catch (error) {
         throw error.response?.data || error;
    }
};


/**
 * Updates an existing service offering.
 * @param {string} serviceId - The ID of the service to update.
 * @param {FormData} formData - Includes updated details and optional 'serviceImage'.
 * @returns {Promise<object>} - The updated service object.
 */
const updateService = async (serviceId, formData) => {
    try {
        const response = await api.put(`/pro/services/${serviceId}`, formData, {
             headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error) {
         throw error.response?.data || error;
    }
};

/**
 * Deletes a service offering.
 * @param {string} serviceId - The ID of the service to delete.
 * @returns {Promise<object>} - Confirmation message.
 */
const deleteService = async (serviceId) => {
    try {
        const response = await api.delete(`/pro/services/${serviceId}`);
        return response.data;
    } catch (error) {
         throw error.response?.data || error;
    }
};


/**
 * Fetches analytics data for the logged-in pro.
 * Requires active subscription.
 * @returns {Promise<object>} - Analytics data object.
 */
const getProAnalytics = async () => {
    try {
        const response = await api.get('/pro/me/analytics');
        return response.data;
    } catch (error) {
         // Handle 403 Forbidden specifically if needed (e.g., prompt upgrade)
         if (error.response?.status === 403) {
             console.warn("Access to analytics denied:", error.response.data.message);
         }
        throw error.response?.data || error;
    }
};

const findServices = async (params = {}) => {
    try {
        const response = await api.get('/pro/services/search', { params });
        return response.data;
    } catch (error) {
         throw error.response?.data || error;
    }
};


/**
 * Fetches details for a single service by its ID.
 * @param {string} serviceId - The ID of the service.
 * @returns {Promise<object>} - The service object (populated with pro, category).
 */
const getServiceById = async (serviceId) => {
    try {
      // This route will be created in proRoutes.js
      const response = await api.get(`/pro/service/${serviceId}`); 
      return response.data;
    } catch (error) {
         throw error.response?.data || error;
    }
};
// --- END OF ADDITION ---


const proService = {
    getPublicProfile,
    addPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem,
    createService,
    getMyServices,
    getProServices,
    updateService,
    deleteService,
    getProAnalytics,  
    findServices,  
    getServiceById
};

export default proService;