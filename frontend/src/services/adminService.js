import api from './api';

const getUsers = async (params = {}) => {
    try {
        const response = await api.get('/admin/users', { params });
        return response.data; // Expects { count, totalPages, currentPage, data }
    } catch (error) {
        throw error.response?.data || error;
    }
};

const getUserById = async (userId) => {
    try {
        const response = await api.get(`/admin/users/${userId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Simple ban - adjust if using status field instead of delete
const banUser = async (userId) => {
    try {
        const response = await api.put(`/admin/users/${userId}/ban`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

const getDisputes = async (params = {}) => {
     try {
        const response = await api.get('/admin/disputes', { params });
        return response.data; // Expects { count, totalPages, currentPage, data }
    } catch (error) {
        throw error.response?.data || error;
    }
};

const getDisputeById = async (disputeId) => {
     try {
        const response = await api.get(`/admin/disputes/${disputeId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};


const resolveDispute = async (disputeId, resolutionData) => {
     try {
        const response = await api.put(`/admin/disputes/${disputeId}/resolve`, resolutionData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// --- Add Analytics function (for Task 7.3) ---
const getAnalytics = async () => {
    try {
        const response = await api.get('/admin/analytics');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}


/**
 * Overrides the compliance status for a specific user.
 * @param {string} userId - The ID of the user whose status to override.
 * @param {object} data - { newStatus: ('approved'|'rejected'|'pending'|'expired'), reason: string }
 * @returns {Promise<object>} - The updated compliance object.
 */
const overrideComplianceStatus = async (userId, data) => {
    try {
        const response = await api.post(`/admin/compliance/users/${userId}/override`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Gets compliance requests with documents expiring within the specified number of days.
 * @param {number} days - Number of days to look ahead (default 30).
 * @returns {Promise<Array>} - Array of compliance request objects with user info.
 */
const getExpiringCompliance = async (days = 30) => {
     try {
        const response = await api.get('/admin/compliance/expiring', { params: { days } });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};


const adminService = {
    getUsers,
    getUserById,
    banUser,
    getDisputes,
    getDisputeById,
    resolveDispute,
    getAnalytics,
    overrideComplianceStatus, // <-- Add
    getExpiringCompliance,    // <-- Add
};

export default adminService;