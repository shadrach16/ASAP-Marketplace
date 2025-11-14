import React, { useState, useEffect } from 'react';
import SubscriptionForm from '../../components/features/Payments/SubscriptionForm';
import ManageSubscription from '../../components/features/Payments/ManageSubscription';
import subscriptionService from '../../services/subscriptionService';
import { useAuth } from '../../hooks/useAuth'; // To check user role if needed

const SubscriptionSettingsPage = () => {
    const { user } = useAuth(); // Needed to know if user exists
    const [subscription, setSubscription] = useState(undefined); // undefined = loading, null = none, object = active/inactive
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get success/cancel status from URL query params
    const queryParams = new URLSearchParams(window.location.search);
    const purchaseSuccess = queryParams.get('success') === 'true';
    const purchaseCanceled = queryParams.get('canceled') === 'true';

    useEffect(() => {
        const fetchSubscription = async () => {
            if (!user) { // Don't fetch if user isn't loaded yet
                setLoading(false); return;
            }
            setLoading(true); setError(null);
            try {
                const subData = await subscriptionService.getMySubscription();
                setSubscription(subData); // Will be null if no subscription found
            } catch (err) {
                setError(err.message || 'Failed to load subscription status.');
                setSubscription(null); // Treat error as no subscription
            } finally {
                setLoading(false);
            }
        };
        fetchSubscription();
    }, [user]); // Refetch if user object changes (e.g., after login)

    const renderContent = () => {
        if (loading || subscription === undefined) {
            return <p className="text-center text-text-secondary py-10">Loading subscription status...</p>;
        }
        if (error) {
            return <p className="text-center text-red-600 py-10">{error}</p>;
        }
        // Check for active statuses specifically if needed
        const isActiveSub = subscription && ['active', 'trialing'].includes(subscription.status);

        if (isActiveSub || subscription) { // Show manage if any subscription record exists (even inactive)
            return <ManageSubscription subscription={subscription} />;
        } else {
            return <SubscriptionForm />;
        }
    };


    return (
        // Assumes  is applied in App.jsx
        <div className="max-w-4xl mx-auto   px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-text-primary mb-8">Subscription</h1>

            {/* Display success/cancel messages */}
            {purchaseSuccess && !loading && (
                 <p className="text-green-600 mb-6 p-3 bg-green-50 border border-green-200 rounded text-center">
                    Subscription successful! Your plan should be active now.
                 </p>
            )}
             {purchaseCanceled && !loading && (
                 <p className="text-yellow-600 mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded text-center">
                    Subscription process canceled.
                 </p>
            )}

            {renderContent()}
        </div>
    );
};

export default SubscriptionSettingsPage;