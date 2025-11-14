import React, { useState } from 'react';
import Button from '../../common/Button';
import subscriptionService from '../../../services/subscriptionService';

// Define plans (match keys/prices with backend/Stripe)
const subscriptionPlans = [
    { key: 'pro_monthly', name: 'Pro Monthly', price: 29, interval: 'month', features: ['Feature A', 'Feature B', '100 Credits/mo'] },
    { key: 'pro_yearly', name: 'Pro Yearly', price: 290, interval: 'year', features: ['Feature A', 'Feature B', '1200 Credits/yr', 'Save 17%'] },
];

const SubscriptionPlanCard = ({ plan, onSubscribe, loadingPlanKey }) => {
    const isLoading = loadingPlanKey === plan.key;
    return (
        <div className="bg-white p-6 rounded-lg shadow border border-border flex flex-col">
            <h3 className="text-lg font-semibold text-text-primary mb-1">{plan.name}</h3>
            <p className="text-2xl font-bold text-primary mb-3">
                ${plan.price}<span className="text-sm font-normal text-text-secondary">/{plan.interval}</span>
            </p>
            <ul className="space-y-2 text-sm text-text-secondary mb-6 flex-grow">
                {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                       <span className="text-green-500 mr-2">✓</span> {feature}
                    </li>
                ))}
            </ul>
            <Button
                fullWidth
                variant="primary"
                onClick={() => onSubscribe(plan.key)}
                disabled={isLoading}
            >
                {isLoading ? 'Processing...' : 'Choose Plan'}
            </Button>
        </div>
    );
};


const SubscriptionForm = () => {
    const [loadingPlanKey, setLoadingPlanKey] = useState(null);
    const [error, setError] = useState(null);

    const handleSubscribeClick = async (planKey) => {
        setLoadingPlanKey(planKey);
        setError(null);
        try {
            await subscriptionService.createSubscriptionCheckoutSession(planKey);
            // Redirect happens via service
        } catch (err) {
            setError(err.message || 'Failed to start subscription. Please try again.');
            setLoadingPlanKey(null); // Stop loading on error
        }
        // No setLoadingPlanKey(null) on success due to redirect
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-text-primary text-center mb-4">Choose Your Plan</h2>
            <p className="text-text-secondary text-center mb-8">Upgrade to Pro to unlock premium features and boost your success.</p>

            {error && <p className="text-red-600 mb-4 p-3 bg-red-50 border border-red-200 rounded text-center">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {subscriptionPlans.map((plan) => (
                    <SubscriptionPlanCard
                        key={plan.key}
                        plan={plan}
                        onSubscribe={handleSubscribeClick}
                        loadingPlanKey={loadingPlanKey}
                    />
                ))}
            </div>
        </div>
    );
};

export default SubscriptionForm;