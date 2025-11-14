import React, { useState, useEffect } from 'react';
import proService from '../../../services/proService';
import { Link } from 'react-router-dom';
import Button from '../../common/Button';
// Placeholder icons
const EarningsIcon = () => <span>💲</span>;
const ProposalIcon = () => <span>📄</span>;
const BookingIcon = () => <span>💼</span>;
const RateIcon = () => <span>📈</span>;

// Chart.js imports (assuming setup is done)
// import { Line } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


// Simple Stat Card (similar to Admin one)
const StatCard = ({ title, value, icon, info = null }) => (
    <div className="bg-white p-5 shadow rounded-lg border border-border flex items-start space-x-4">
        {icon && <div className="text-2xl text-primary mt-1">{icon}</div>}
        <div>
            <p className="text-sm font-medium text-text-secondary truncate">{title}</p>
            <p className="mt-1 text-3xl font-semibold text-text-primary">{value ?? '...'}</p>
             {info && <p className="text-xs text-text-light mt-1">{info}</p>}
        </div>
    </div>
);


const ProAnalyticsDashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true); setError(null);
            try {
                const data = await proService.getProAnalytics();
                setAnalytics(data);
            } catch (err) {
                 if (err.status === 403) { // Handle subscription required error
                     setError("Upgrade to Pro to access analytics.");
                 } else {
                     setError(err.message || 'Failed to load analytics data.');
                 }
                setAnalytics(null); // Clear data on error
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    // Placeholder chart data and options
    // const earningsChartData = { labels: ['Jan', 'Feb', 'Mar'], datasets: [{ label: 'Earnings', data: [500, 1200, 800], borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.1)', fill: true }]};
    // const chartOptions = { responsive: true, plugins: { legend: { display: false }, title: { display: true, text: 'Earnings Over Time (Placeholder)' }}};

    if (loading) return <p className="text-center text-text-secondary py-6">Loading analytics...</p>;

    // Special handling for subscription error
    if (error && error.includes("Upgrade to Pro")) {
        return (
             <div className="text-center py-10 px-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                 <h2 className="text-xl font-semibold text-yellow-800 mb-3">🔒 Access Denied</h2>
                 <p className="text-yellow-700 mb-6">{error}</p>
                 <Link to="/settings/subscriptions">
                    <Button variant="primary">Upgrade Your Plan</Button>
                 </Link>
             </div>
        );
    }

    if (error) return <p className="text-center text-red-600 py-6">{error}</p>;
    if (!analytics) return <p className="text-center text-text-secondary py-6">Analytics data is not available.</p>;

    return (
        <div className="space-y-6">
            {/* Key Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <StatCard
                    title="Lifetime Earnings"
                    value={`$${parseFloat(analytics.lifetimeEarnings?.amount || 0).toLocaleString()}`}
                    icon={<EarningsIcon />}
                    info={`Currency: ${analytics.lifetimeEarnings?.currency || 'N/A'}`}
                />
                 <StatCard
                    title="Proposal Success Rate"
                    value={`${analytics.proposals?.successRate || 0}%`}
                    icon={<RateIcon />}
                    info={`${analytics.proposals?.totalAccepted || 0} accepted / ${analytics.proposals?.totalSubmitted || 0} submitted`}
                 />
                 <StatCard
                    title="Active Bookings"
                    value={analytics.bookings?.active ?? 0}
                    icon={<BookingIcon />}
                 />
                 <StatCard
                    title="Completed Bookings"
                    value={analytics.bookings?.completed ?? 0}
                    icon="✅"
                 />
            </div>

             {/* Chart Placeholder */}
             <div className="bg-white p-6 shadow rounded-lg border border-border">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Earnings Over Time</h3>
                  <div className="h-64 flex items-center justify-center text-text-light">
                      {/* <Line options={chartOptions} data={earningsChartData} /> */}
                      Chart placeholder - Requires backend time-series data and chart library setup.
                 </div>
             </div>

             {/* Add more sections/charts as needed */}

        </div>
    );
};

export default ProAnalyticsDashboard;