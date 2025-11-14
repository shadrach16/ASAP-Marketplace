import api from './api';

/**
 * Uploads a file to the specified booking workspace.
 * @param {string} bookingId - The ID of the booking.
 * @param {FormData} formData - Must contain 'workspaceFile' (File object).
 * @returns {Promise<object>} - The metadata of the uploaded file.
 */
const uploadWorkspaceFile = async (bookingId, formData) => {
  try {
    // Corresponds to POST /api/bookings/:bookingId/files
    const response = await api.post(`/bookings/${bookingId}/files`, formData, {
      headers: {
        // Axios usually sets this correctly for FormData, but explicit is fine
        'Content-Type': 'multipart/form-data',
      },
    });
    // The backend returns the metadata of the newly uploaded file
    return response.data;
  } catch (error) {
    // Log the error for debugging and re-throw for handling in the component
    console.error("Upload workspace file error:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// Add other workspace-specific functions here later if needed.
// For example, fetching specific workspace data not included in the main booking details,
// or actions specific to the workspace context.

const workspaceService = {
  uploadWorkspaceFile,
};

export default workspaceService;