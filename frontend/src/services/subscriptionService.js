import api from './api';
import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PK = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

/**
 * Creates a Stripe Checkout session for a specific plan and redirects.
 * @param {string} planKey - Your internal key for the plan (e.g., 'pro_monthly').
 */
const createSubscriptionCheckoutSession = async (planKey) => {
    try {
        const response = await api.post('/subscriptions/checkout-session', { planKey });
        const sessionId = response.data.sessionId;
        const stripe = await loadStripe(STRIPE_PK);
        if (!stripe) throw new Error("Stripe.js failed to load.");

        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
            console.error("Stripe redirect error:", error);
            throw new Error(error.message || "Failed to redirect to checkout.");
        }
        // Redirect happens here, so no return needed unless error
    } catch (error) {
        console.error("Create Checkout Error:", error);
        throw error.response?.data || error;
    }
};

/**
 * Creates a Stripe Customer Portal session and redirects.
 */
const createCustomerPortalSession = async () => {
    try {
        const response = await api.post('/subscriptions/customer-portal');
        const portalUrl = response.data.url;
        if (portalUrl) {
            window.location.href = portalUrl; // Redirect to Stripe Portal
        } else {
             throw new Error("Could not retrieve customer portal URL.");
        }
    } catch (error) {
        console.error("Create Portal Error:", error);
        throw error.response?.data || error;
    }
};

/**
 * Fetches the current user's active subscription details from backend.
 * Requires backend endpoint GET /api/subscriptions/me
 * @returns {Promise<object|null>} - The subscription object or null if none found/error.
 */
const getMySubscription = async () => {
    try {
        // ASSUMPTION: Backend route GET /api/subscriptions/me exists
        const response = await api.get('/subscriptions/me');
        return response.data; // Expects subscription object or potentially null/empty if inactive
    } catch (error) {
         if (error.response?.status === 404) {
             return null; // Handle case where user has no subscription record
         }
        console.error("Get Subscription Error:", error);
        throw error.response?.data || error; // Re-throw other errors
    }
};


const subscriptionService = {
    createSubscriptionCheckoutSession,
    createCustomerPortalSession,
    getMySubscription, // <-- Add function to get status
};

export default subscriptionService;