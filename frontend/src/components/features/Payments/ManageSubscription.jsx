import React, { useState } from 'react';
import Button from '../../common/Button';
import subscriptionService from '../../../services/subscriptionService';

const ManageSubscription = ({ subscription }) => {
    const [loadingPortal, setLoadingPortal] = useState(false);
    const [error, setError] = useState(null);

    const handleManageClick = async () => {
        setLoadingPortal(true);
        setError(null);
        try {
            await subscriptionService.createCustomerPortalSession();
            // Redirect happens via service
        } catch (err) {
            setError(err.message || 'Could not access billing portal. Please try again.');
            setLoadingPortal(false); // Stop loading on error
        }
        // No setLoadingPortal(false) on success due to redirect
    };

    const formatDate = (date) => date ? new Date(date).toLocaleDateString() : 'N/A';
    const planName = subscription.planId?.replace('_', ' ')?.toUpperCase() || 'N/A'; // Basic formatting

    return (
        <div className="bg-white p-6 shadow rounded-lg border border-border">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Your Subscription</h2>

            {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

            <div className="space-y-2 text-sm mb-6">
                <div className="flex justify-between">
                    <span className="text-text-secondary">Plan:</span>
                    <span className="font-medium text-text-primary">{planName}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-text-secondary">Status:</span>
                    <span className={`font-medium capitalize ${
                         ['active', 'trialing'].includes(subscription.status) ? 'text-green-600' :
                         ['past_due', 'unpaid', 'incomplete'].includes(subscription.status) ? 'text-red-600' :
                         'text-yellow-600' // canceled, incomplete_expired
                    }`}>{subscription.status?.replace('_', ' ')}</span>
                </div>
                 {['active', 'trialing', 'past_due'].includes(subscription.status) && !subscription.cancelAtPeriodEnd && (
                     <div className="flex justify-between">
                        <span className="text-text-secondary">Renews/Ends On:</span>
                        <span className="font-medium text-text-primary">{formatDate(subscription.currentPeriodEnd)}</span>
                    </div>
                 )}
                 {subscription.cancelAtPeriodEnd && (
                      <div className="flex justify-between text-yellow-700">
                        <span >Cancels On:</span>
                        <span className="font-medium">{formatDate(subscription.currentPeriodEnd)}</span>
                    </div>
                 )}
                 {subscription.trialEnd && new Date(subscription.trialEnd) > new Date() && (
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Trial Ends:</span>
                        <span className="font-medium text-text-primary">{formatDate(subscription.trialEnd)}</span>
                    </div>
                 )}
            </div>

            <Button
                fullWidth
                variant="primary"
                onClick={handleManageClick}
                disabled={loadingPortal}
            >
                {loadingPortal ? 'Redirecting...' : 'Manage Billing & Subscription'}
            </Button>
             <p className="text-xs text-text-light mt-2 text-center">You'll be redirected to Stripe to manage your plan.</p>
        </div>
    );
};

export default ManageSubscription;