import api from './api'; // Import the configured Axios instance

/**
 * Creates a new job posting.
 * Requires user to be authenticated (token is added automatically by api instance).
 * @param {object} jobData - { title, description, budget, currency?, skills: string[], category: string, location? }
 * @returns {Promise<object>} - The created job object (likely populated).
 */
const postJob = async (jobData) => {
  try {
    // Corresponds to POST /api/jobs
    const response = await api.post('/jobs', jobData);
    return response.data;
  } catch (error) {
    console.error("Post job error:", error.response?.data || error.message);
    // Re-throw the error object which might contain status and message from backend
    throw error.response?.data || new Error(error.message || 'Failed to post job.');
  }
};

/**
 * Fetches available (open) jobs with optional filtering and pagination.
 * Requires user to be authenticated (Pro).
 * @param {object} params - Query parameters (e.g., { page: 1, limit: 10, skills: 'id1,id2', category: 'id', location: 'Remote' })
 * @returns {Promise<object>} - API response: { results, totalPages, currentPage, totalItems, data: [jobs...] }
 */
const getJobs = async (params = {}) => {
  try {
    // Corresponds to GET /api/jobs
    const response = await api.get('/jobs', { params });
    // Expects { results, totalPages, currentPage, totalItems, data } from backend
    return response.data;
  } catch (error) {
    console.error("Get jobs error:", error.response?.data || error.message);
    throw error.response?.data || new Error(error.message || 'Failed to fetch jobs.');
  }
};

/**
 * Fetches details for a specific job by its ID.
 * Requires user to be authenticated.
 * @param {string} jobId - The ID of the job.
 * @returns {Promise<object>} - The job object (populated with client, category, skills).
 */
const getJobById = async (jobId) => {
    // Basic validation on the ID format
    if (!jobId || typeof jobId !== 'string') {
        return Promise.reject(new Error('Invalid Job ID provided.'));
    }
    try {
      // Corresponds to GET /api/jobs/:jobId
      const response = await api.get(`/jobs/${jobId}`);
      // Expects the populated job object from the backend
      return response.data;
    } catch (error) {
      console.error(`Get job by ID (${jobId}) error:`, error.response?.data || error.message);
      throw error.response?.data || new Error(error.message || 'Failed to fetch job details.');
    }
  };

const getMyJobs = async (status) => {
  try {
    // This endpoint doesn't exist yet, we'll create it.
    const response = await api.get('/jobs/my-jobs', { params: { status } });
    return response.data; 
  } catch (error) {
    console.error(`Get my jobs (${status}) error:`, error.response?.data || error.message);
    throw error.response?.data || new Error(error.message || 'Failed to fetch jobs.');
  }
};


/**
 * Updates an existing job posting.
 * Requires user to be authenticated and the owner of the job.
 * @param {string} jobId - The ID of the job to update.
 * @param {FormData} jobData - The job data (must be FormData if attachments are included).
 * @returns {Promise<object>} - The updated job object.
 */
const updateJob = async (jobId, jobData) => {
  try {
    // Corresponds to PUT /api/jobs/:jobId
    const response = await api.put(`/jobs/${jobId}`, jobData);
    return response.data;
  } catch (error) {
    console.error("Update job error:", error.response?.data || error.message);
    throw error.response?.data || new Error(error.message || 'Failed to update job.');
  }
};


/**
 * Deletes a job posting.
 * Requires user to be authenticated and the owner of the job.
 * @param {string} jobId - The ID of the job to delete.
 * @returns {Promise<object>} - Success message object.
 */
const deleteJob = async (jobId) => {
  try {
    // Corresponds to DELETE /api/jobs/:jobId
    const response = await api.delete(`/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    console.error("Delete job error:", error.response?.data || error.message);
    throw error.response?.data || new Error(error.message || 'Failed to delete job.');
  }
};


// Consolidate exported functions
const jobService = {
  postJob,
  getJobs,
  getJobById,
  getMyJobs,
  updateJob,
  deleteJob
};

export default jobService;