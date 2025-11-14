import api from './api';


/**
 * Fetches the profile data for the currently logged-in user.
 * Includes notification preferences.
 * @returns {Promise<object>} User profile data.
 */
const getMyProfile = async () => {
    try {
        // Assuming /users/me returns the profile with preferences
        const response = await api.get('/users/me');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};



/**
 * Updates the notification preferences for the logged-in user.
 * @param {object} preferences - Object with keys like 'newMessage', 'proposalReceived', etc.,
 * and values like { email: boolean, inApp: boolean }.
 * @returns {Promise<object>} - The updated preferences map.
 */
const updateMyNotificationPreferences = async (preferences) => {
    try {
        const response = await api.put('/users/me/preferences', preferences);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};


/**
 * Fetches notifications for the logged-in user.
 * @param {number} page - Page number for pagination.
 * @param {number} limit - Items per page.
 * @returns {Promise<object>} - { count, totalItems, totalPages, currentPage, unreadCount, data: [...] }
 */
const getMyNotifications = async (page = 1, limit = 15) => {
    try {
        const response = await api.get('/users/me/notifications', { params: { page, limit } });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Marks a specific notification as read.
 * @param {string} notificationId - The ID of the notification.
 * @returns {Promise<object>} - The updated notification object.
 */
const markNotificationRead = async (notificationId) => {
     try {
        const response = await api.put(`/users/me/notifications/${notificationId}/read`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Marks all unread notifications as read.
 * @returns {Promise<object>} - Confirmation message.
 */
const markAllNotificationsRead = async () => {
     try {
        const response = await api.put('/users/me/notifications/read-all');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};


/**
 * Updates the profile data for the currently logged-in user.
 * @param {object} profileData - Data to update (e.g., { name, email, title?, bio?, skills?: string[] })
 * @returns {Promise<object>} Updated user profile data (likely includes populated skills).
 */
const updateMyProfile = async (profileData) => {
    try {
        // Corresponds to PUT /api/users/me endpoint
        const response = await api.put('/users/me', profileData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};


const userService = {
    getMyProfile,
    updateMyNotificationPreferences,
    getMyNotifications,       // <-- Add
    markNotificationRead,     // <-- Add
    markAllNotificationsRead, // <-- Add
    updateMyProfile, // <-- Add
};

export default userService;