import api from './api';

/**
 * Submits the user's compliance documents (file + type)
 * @param {FormData} formData - Must contain 'document' (File) and 'documentType' (String)
 * @returns {Promise<object>} - The API response
 */
const submitCompliance = async (formData) => {
  try {
    const response = await api.post('/compliance/submit', formData, {
      headers: {
        // Axios sets this automatically for FormData, but good to be explicit
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const complianceService = {
  submitCompliance,
};

export default complianceService;