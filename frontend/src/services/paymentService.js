import api from './api';
import { loadStripe } from '@stripe/stripe-js';

/**
 * Releases funds for a specific milestone.
 * @param {string} milestoneId - The ID of the milestone to release.
 * @returns {Promise<object>} - API response confirming release.
 */
const releaseMilestone = async (milestoneId) => {
  try {
    const response = await api.post(`/payments/milestones/${milestoneId}/release`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Creates a new custom invoice.
 * @param {object} invoiceData - { bookingId, items, dueDate, currency?, notes? }
 * @returns {Promise<object>} - The created invoice object.
 */
const createInvoice = async (invoiceData) => {
    try {
        // Corrected route based on backend setup
        const response = await api.post('/payments/invoices', invoiceData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Initiates the payment process for a custom invoice.
 * @param {string} invoiceId - The ID of the invoice to pay.
 * @returns {Promise<object>} - { invoiceId, clientSecret, totalAmount, currency }
 */
const initiateInvoicePayment = async (invoiceId) => {
    try {
         // Corrected route based on backend setup
        const response = await api.post(`/payments/invoices/${invoiceId}/pay`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};





/**
 * Fetches the financial transaction history for the logged-in user.
 * @param {number} page - Page number for pagination.
 * @param {number} limit - Items per page.
 * @returns {Promise<object>} - { count, totalItems, totalPages, currentPage, data: [...] }
 */
const getFinancialHistory = async (page = 1, limit = 20) => {
    try {
        const response = await api.get('/payments/financials/history', { params: { page, limit } });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Fetches available tax documents for the logged-in user (primarily Pros).
 * @returns {Promise<Array>} - Array of tax document objects from Stripe.
 */
const getTaxDocuments = async () => {
     try {
        const response = await api.get('/payments/financials/tax-docs');
        return response.data; // Expects array from backend
    } catch (error) {
        throw error.response?.data || error;
    }
};


// buyCredits uses the /payments route, so it logically belongs here
const buyCredits = async (packageKey) => {
    try {
        const response = await api.post('/payments/buy-credits', { packageKey });
        const sessionId = response.data.sessionId;
        const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
        if (!stripe) throw new Error("Stripe.js failed to load.");
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
            console.error("Stripe redirect error:", error);
            throw new Error(error.message || "Failed to redirect to checkout.");
        }
    } catch (error) {
        console.error("Buy Credits Error:", error);
        throw error.response?.data || error;
    }
};

/**
 * Creates or retrieves a PaymentIntent for funding a specific milestone.
 * @param {string} milestoneId - The ID of the milestone to fund.
 * @returns {Promise<object>} - { clientSecret, milestoneId, amount, currency }
 */
const createMilestonePaymentIntent = async (milestoneId) => {
    try {
        // Assumes backend route POST /api/payments/milestones/:id/create-intent exists
        const response = await api.post(`/payments/milestones/${milestoneId}/create-intent`);
        return response.data; // Expects { clientSecret, milestoneId, amount, currency }
    } catch (error) {
        throw error.response?.data || error;
    }
};


const paymentService = {
  releaseMilestone,
  createInvoice,
  initiateInvoicePayment,
  getFinancialHistory,
  getTaxDocuments,
  buyCredits,
  createMilestonePaymentIntent, // <-- Add
};

export default paymentService;