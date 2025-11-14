import React, { useState } from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import Button from '../../../components/common/Button';
import paymentService from '../../../services/paymentService';
import { useAuth } from '../../../hooks/useAuth'; // To display current balance

// Define packages (match keys with backend CREDIT_PACKAGES)
const creditPackages = [
    { key: '10_credits', amount: 10, price: 10.00, popular: false },
    { key: '25_credits', amount: 25, price: 22.50, popular: true }, // Example discount
    { key: '50_credits', amount: 50, price: 40.00, popular: false }, // Example discount
];

const BuyCreditsPage = () => {
    const { user } = useAuth(); // Get user to show current credits
    const [loadingPackage, setLoadingPackage] = useState(null); // Track which button is loading
    const [error, setError] = useState(null);

    // Get success/cancel status from URL query params (set by Stripe redirect)
    const queryParams = new URLSearchParams(window.location.search);
    const purchaseSuccess = queryParams.get('success') === 'true';
    const purchaseCanceled = queryParams.get('canceled') === 'true';

    const handleBuyClick = async (packageKey) => {
        setLoadingPackage(packageKey);
        setError(null);
        try {
            await paymentService.buyCredits(packageKey);
            // Redirect happens via paymentService, page will reload on return
        } catch (err) {
            setError(err.message || 'Failed to initiate purchase. Please try again.');
            setLoadingPackage(null);
        }
        // No setLoadingPackage(null) on success because of redirect
    };

    return (
        <MainLayout>
             <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-text-primary mb-2">Buy Credits</h1>
                <p className="text-text-secondary mb-6">Your current balance: <span className="font-semibold text-primary">{user?.credits ?? 0}</span> credits. Purchase more credits to apply for jobs.</p>

                {error && <p className="text-red-600 mb-4 p-3 bg-red-50 border border-red-200 rounded">{error}</p>}
                {purchaseSuccess && <p className="text-green-600 mb-4 p-3 bg-green-50 border border-green-200 rounded">Purchase successful! Your credits should be updated shortly.</p>}
                {purchaseCanceled && <p className="text-yellow-600 mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">Purchase canceled.</p>}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {creditPackages.map((pkg) => (
                        <div key={pkg.key} className={`bg-white p-6 rounded-lg shadow border ${pkg.popular ? 'border-primary ring-2 ring-primary-light' : 'border-border'}`}>
                            {pkg.popular && <span className="inline-block bg-primary text-white text-xs font-semibold px-2 py-0.5 rounded-full mb-2">Most Popular</span>}
                            <h2 className="text-xl font-semibold text-text-primary mb-1">{pkg.amount} Credits</h2>
                            <p className="text-2xl font-bold text-primary mb-4">${pkg.price.toFixed(2)}</p>
                            {/* Add details like price per credit if desired */}
                            <Button
                                fullWidth
                                variant={pkg.popular ? 'primary' : 'secondary'}
                                onClick={() => handleBuyClick(pkg.key)}
                                disabled={loadingPackage === pkg.key}
                            >
                                {loadingPackage === pkg.key ? 'Processing...' : 'Buy Now'}
                            </Button>
                        </div>
                    ))}
                </div>
                 <p className="text-xs text-text-light mt-6 text-center">Secure payments powered by Stripe. Credits are non-refundable.</p>
             </div>
        </MainLayout>
    );
};

export default BuyCreditsPage;