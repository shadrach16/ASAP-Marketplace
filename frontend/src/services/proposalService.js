import api from './api';

/**
 * Submits a proposal for a job.
 * @param {object} proposalData - { jobId, bidAmount, coverLetter, estimatedDuration?, currency? }
 * @returns {Promise<object>} - The created proposal object.
 */
const submitProposal = async (proposalData) => {
  try {
    const response = await api.post('/proposals', proposalData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Fetches all proposals for a specific job.
 * @param {string} jobId - The ID of the job.
 * @returns {Promise<Array>} - An array of proposal objects.
 */
const getProposalsForJob = async (jobId) => {
  try {
    const response = await api.get(`/proposals/job/${jobId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};


const getMyProposals = async (status) => {
    try {
        // This endpoint needs to be created
        const response = await api.get('/proposals/my-proposals', { params: { status } });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

const proposalService = {
  getMyProposals,
  submitProposal,
  getProposalsForJob,
};

export default proposalService;