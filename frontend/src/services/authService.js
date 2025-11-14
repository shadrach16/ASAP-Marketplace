import api from './api';

const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const login = async (userData) => {
  try {
    const response = await api.post('/auth/login', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Sends a password reset request email.
 * @param {string} email - The user's email address.
 */
const forgotPassword = async (email) => {
  try {
    // Note: The response is intentionally generic to prevent email enumeration.
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Resets the password using the token from the email link.
 * @param {string} token - The password reset token from the URL.
 * @param {string} password - The new password.
 * @param {string} confirmPassword - Confirmation of the new password.
 */
const resetPassword = async (token, password, confirmPassword) => {
  try {
    const response = await api.put(`/auth/reset-password/${token}`, { 
      newPassword: password, // Use newPassword to match controller logic
      confirmPassword 
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};


/**
 * Updates the user's profile
 * @param {object} profileData - { name, email }
 * @returns {Promise<object>} - The updated user object
 */
const updateProfile = async (profileData) => {
  try {
    // The 'protect' middleware will use the token from api.defaults
    const response = await api.put('/users/me', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const authService = {
  register,
  login,
  updateProfile,
  forgotPassword, // <-- ADDED
  resetPassword,  // <-- ADDED
};

export default authService;