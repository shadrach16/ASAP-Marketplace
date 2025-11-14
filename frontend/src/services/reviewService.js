import api from './api';

const submitReview = async (reviewData) => {
  try {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const getReviewsForPro = async (proId) => {
  try {
    const response = await api.get(`/reviews/pro/${proId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// --- New Testimonial Functions ---

/**
 * Sends a request to the client to provide a testimonial.
 * @param {string} bookingId - The ID of the completed booking.
 * @returns {Promise<object>} - API confirmation message.
 */
const requestTestimonial = async (bookingId) => {
    try {
        const response = await api.post('/reviews/testimonials/request', { bookingId });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Fetches testimonial details using a unique token (for submission page).
 * @param {string} token - The unique request token.
 * @returns {Promise<object>} - Object containing proName, clientName etc.
 */
const getTestimonialByToken = async (token) => {
    try {
        const response = await api.get(`/reviews/testimonials/token/${token}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Submits the client's testimonial comment.
 * @param {string} token - The unique request token.
 * @param {string} comment - The testimonial text.
 * @returns {Promise<object>} - API confirmation message.
 */
const submitTestimonial = async (token, comment) => {
     try {
        const response = await api.post(`/reviews/testimonials/submit/${token}`, { comment });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Fetches published testimonials for a specific pro.
 * @param {string} proId - The ID of the pro user.
 * @returns {Promise<Array>} - Array of testimonial objects.
 */
const getProTestimonials = async (proId) => {
     try {
        const response = await api.get(`/reviews/testimonials/pro/${proId}`);
        return response.data; // Expects an array
    } catch (error) {
        throw error.response?.data || error;
    }
};


const reviewService = {
  submitReview,
  getReviewsForPro,
  requestTestimonial,     // <-- Add new
  getTestimonialByToken,  // <-- Add new
  submitTestimonial,      // <-- Add new
  getProTestimonials,     // <-- Add new
};

export default reviewService;