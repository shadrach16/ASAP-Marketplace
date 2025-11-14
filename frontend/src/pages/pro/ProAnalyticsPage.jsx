import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import ProAnalyticsDashboard from '../../components/features/Analytics/ProAnalyticsDashboard';
import { Helmet } from 'react-helmet-async';

const ProAnalyticsPage = () => {
    return (
        <MainLayout>
             <Helmet>
                <title>My Analytics | ASAP Marketplace</title>
                <meta name="description" content="View your earnings, proposal success rate, and other key metrics on ASAP Marketplace." />
             </Helmet>
             <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                 <h1 className="text-3xl font-bold text-text-primary mb-6">My Analytics</h1>
                 <ProAnalyticsDashboard />
            </div>
        </MainLayout>
    );
};

export default ProAnalyticsPage;