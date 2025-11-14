import api from './api';

/**
 * Submits a new dispute for a booking.
 * @param {object} disputeData - { bookingId, reason, desiredOutcome? }
 * @returns {Promise<object>} - The API response containing the created dispute.
 */
const submitDispute = async (disputeData) => {
  try {
    const response = await api.post('/disputes', disputeData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const disputeService = {
  submitDispute,
};

export default disputeService;