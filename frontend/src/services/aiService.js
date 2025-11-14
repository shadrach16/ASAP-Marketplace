import api from './api';

const generateJobDescription = async (prompt) => {
  try {
    const response = await api.post('/ai/generate-job', { prompt });
    return response.data.description;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Requests an AI price suggestion based on job details.
 * @param {object} jobData - { title, description, skills }
 * @returns {Promise<object>} - { minPrice, maxPrice, reasoning }
 */
const suggestJobPrice = async (jobData) => {
    try {
        const response = await api.post('/ai/suggest-price', jobData);
        return response.data; // Expects { minPrice, maxPrice, reasoning }
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Fetches AI-suggested pro matches for a specific job.
 * @param {string} jobId - The ID of the job.
 * @returns {Promise<Array>} - Array of simplified pro user objects.
 */
const getJobMatches = async (jobId) => {
    try {
        const response = await api.get(`/ai/jobs/${jobId}/matches`);
        return response.data; // Expects array of pro objects
    } catch (error) {
        throw error.response?.data || error;
    }
};

const generateServiceDetails = async (prompt) => {
  try {
    // Assumes backend route POST /api/ai/generate-service exists
    const response = await api.post('/ai/generate-service', { prompt });
    return response.data; // Expects { title, description }
  } catch (error) {
    console.error("AI service generation error:", error.response?.data || error.message);
    throw error.response?.data || new Error(error.message || 'Failed to generate service details.');
  }
};

const aiService = {
  generateJobDescription,
  suggestJobPrice,  // <-- Add
  getJobMatches,    // <-- Add
  generateServiceDetails,    // <-- Add
};

export default aiService;