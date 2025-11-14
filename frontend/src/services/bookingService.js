import api from './api';


const acceptProposal = async (proposalId) => {
  try {
    const response = await api.post('/bookings/accept', { proposalId });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Fetches details for a specific booking, including milestones, files, etc.
 * @param {string} bookingId - The ID of the booking.
 * @returns {Promise<object>} - The detailed booking object.
 */
const getBookingById = async (bookingId) => {
    try {
      // Corrected route
      const response = await api.get(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
};

const requestChangeOrder = async (bookingId, changeData) => {
    try {
        const response = await api.post(`/bookings/${bookingId}/change-order`, changeData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

const respondToChangeOrder = async (bookingId, orderId, responseData) => {
    try {
        const response = await api.put(`/bookings/${bookingId}/change-order/${orderId}`, responseData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Fetches all change orders associated with a booking.
 * @param {string} bookingId
 * @returns {Promise<Array>} - Array of change order objects.
 */
const getChangeOrdersForBooking = async (bookingId) => {
     try {
        // Corrected route
        const response = await api.get(`/bookings/${bookingId}/change-order`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Logs a time entry for a booking.
 * @param {string} bookingId
 * @param {object} timeData - { hours, date, description? }
 * @returns {Promise<object>} - The created time entry object.
 */
const logTimeEntry = async (bookingId, timeData) => {
    try {
        const response = await api.post(`/bookings/${bookingId}/time`, timeData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Fetches time log entries for a booking.
 * @param {string} bookingId
 * @returns {Promise<object>} - Object containing { totalHours, entries: [...] }.
 */
const getTimeEntries = async (bookingId) => {
    try {
        const response = await api.get(`/bookings/${bookingId}/time`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

const getMyBookings = async (status) => {
    try {
        // This endpoint needs to be created
        const response = await api.get('/bookings/my-bookings', { params: { status } });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Fetches all custom invoices associated with a booking.
 * @param {string} bookingId
 * @returns {Promise<Array>} - Array of invoice objects.
 */
const getInvoicesForBooking = async (bookingId) => {
    try {
        // This route will be created in bookingRoutes.js
        const response = await api.get(`/bookings/${bookingId}/invoices`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};


const bookingService = {
  acceptProposal,
  getBookingById,
  requestChangeOrder,
  respondToChangeOrder,
  getChangeOrdersForBooking,
  logTimeEntry,     // <-- Add
  getTimeEntries,   // <-- Add
  getMyBookings,   // <-- Add
  getInvoicesForBooking
};

export default bookingService;