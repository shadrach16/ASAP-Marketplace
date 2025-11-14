import React, { useState, useEffect } from 'react';
import adminService from '../../../services/adminService';

// Simple card component for displaying stats
const StatCard = ({ title, value, icon, colorClass = 'text-primary' }) => (
    <div className="bg-white p-5 shadow rounded-lg border border-border flex items-center space-x-4">
        {icon && <div className={`text-3xl ${colorClass}`}>{icon}</div>}
        <div>
            <p className="text-sm font-medium text-text-secondary truncate">{title}</p>
            <p className="mt-1 text-3xl font-semibold text-text-primary">{value ?? '...'}</p>
        </div>
    </div>
);


const AnalyticsDashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true); setError(null);
            try {
                const data = await adminService.getAnalytics();
                setAnalytics(data);
            } catch (err) {
                setError(err.message || 'Failed to load analytics data.');
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return <p className="text-center text-text-secondary py-4">Loading analytics...</p>;
    if (error) return <p className="text-center text-red-600 py-4">{error}</p>;
    if (!analytics) return <p className="text-center text-text-secondary py-4">No analytics data available.</p>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Users" value={analytics.users?.total} icon="👥" colorClass="text-blue-500" />
            <StatCard title="Total Pros" value={analytics.users?.pros} icon="👷" colorClass="text-green-500" />
            <StatCard title="Total Clients" value={analytics.users?.clients} icon="🏢" colorClass="text-indigo-500" />
            <StatCard title="Completed Bookings" value={analytics.bookings?.completed} icon="✅" colorClass="text-teal-500" />

            <StatCard title="Open Jobs" value={analytics.jobs?.open} icon="📄" colorClass="text-purple-500" />
            <StatCard title="Open Disputes" value={analytics.disputes?.open} icon="⚠️" colorClass="text-yellow-500" />
            {/* Revenue requires careful formatting */}
            <StatCard
                title="Total Revenue (Est.)"
                value={`$${parseFloat(analytics.revenue?.total || 0).toLocaleString()}`}
                icon="💲"
                colorClass="text-primary-dark"
            />
             {/* Add more cards as needed */}
             <StatCard title="Resolved Disputes" value={analytics.disputes?.resolved} icon="🤝" colorClass="text-gray-500" />
        </div>
    );
};

export default AnalyticsDashboard;