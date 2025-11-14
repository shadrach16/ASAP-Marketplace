import React, { useState, useEffect } from 'react';
import proService from '../../../services/proService';
import { Link } from 'react-router-dom';
import Button from '../../common/Button';

// --- Chart.js Imports and Registration ---
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler, // Import Filler for area charts
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler // Register Filler
);
// --- End Chart.js Setup ---

// Icon Placeholders (Replace with actual icons)
const EarningsIcon = () => <span>💲</span>;
const RateIcon = () => <span>📈</span>;
const BookingIcon = () => <span>💼</span>;

// Simple Stat Card Component
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

// Main Dashboard Component
const ProAnalyticsDashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await proService.getProAnalytics();
                setAnalytics(data);
            } catch (err) {
                 // Handle specific 403 Forbidden error for subscription
                 if (err.status === 403 || err?.message?.includes('subscription required')) {
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
    }, []); // Empty dependency array means fetch once on mount

    // --- Prepare Chart Data (Memoize if needed) ---
    const earningsChartData = {
        // Use optional chaining and default empty array
        labels: analytics?.earningsOverTime?.map(item => item.period) || [],
        datasets: [
            {
                label: 'Monthly Earnings (USD)',
                data: analytics?.earningsOverTime?.map(item => item.earnings) || [],
                borderColor: '#10B981', // primary color
                backgroundColor: 'rgba(16, 185, 129, 0.1)', // Lighter primary with opacity
                tension: 0.2, // Smoother curve
                fill: true,
                pointBackgroundColor: '#10B981',
                pointBorderColor: '#fff',
                pointHoverRadius: 6, // Larger hover point
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#059669', // primary-dark
            },
        ],
    };

    // --- Chart Options (Memoize if needed) ---
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false, // Allows chart to fill container height
        plugins: {
            legend: {
                display: false, // Hide legend for single dataset
            },
            title: {
                display: true,
                text: 'Earnings Over Last 6 Months',
                color: '#374151', // text-gray-700
                font: { size: 16, weight: '600', family: 'Inter, sans-serif' }, // Match font
                padding: { bottom: 16 }
            },
            tooltip: {
                backgroundColor: 'rgba(31, 41, 55, 0.8)', // gray-800 with opacity
                titleColor: '#F9FAFB', // gray-50
                bodyColor: '#F9FAFB',
                titleFont: { size: 14, family: 'Inter, sans-serif' },
                bodyFont: { size: 12, family: 'Inter, sans-serif' },
                padding: 10,
                cornerRadius: 4,
                displayColors: false, // Hide color box in tooltip
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) { label += ': '; }
                        if (context.parsed.y !== null) {
                            // Use Intl for robust currency formatting
                            label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                     // Format Y-axis ticks as currency
                     callback: function(value) {
                          if (value >= 1000) return '$' + (value / 1000) + 'k'; // Format large numbers
                          return '$' + value;
                     },
                     color: '#6B7280', // text-gray-500
                     font: { family: 'Inter, sans-serif' }
                },
                 grid: {
                    color: '#E5E7EB', // border-gray-200
                    drawBorder: false, // Hide Y-axis line
                 }
            },
            x: {
                 ticks: {
                    color: '#6B7280', // text-gray-500
                    font: { family: 'Inter, sans-serif' }
                 },
                 grid: {
                    display: false, // Hide vertical grid lines
                 },
                 border: {
                     display: false // Hide X-axis line
                 }
            }
        },
        interaction: {
            intersect: false, // Show tooltip when hovering near points
            mode: 'index',
        },
    };

    // --- Render Logic ---
    if (loading) {
        return <p className="text-center text-text-secondary py-6 animate-pulse">Loading analytics...</p>;
    }

    // Specific UI for subscription error
    if (error && error.includes("Upgrade to Pro")) {
        return (
             <div className="text-center py-10 px-6 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg shadow-sm">
                 <h2 className="text-xl font-semibold text-yellow-800 mb-3">🔒 Premium Feature</h2>
                 <p className="text-yellow-700 mb-6">{error}</p>
                 <Link to="/settings/subscriptions">
                    <Button variant="primary" className="bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-400 text-white">Upgrade Your Plan</Button>
                 </Link>
             </div>
        );
    }

    if (error) {
        return <p className="text-center text-red-600 py-6">{error}</p>;
    }
    if (!analytics) {
        return <p className="text-center text-text-secondary py-6">Analytics data is not available.</p>;
    }

    // Main dashboard render
    return (
        <div className="space-y-6">
            {/* Key Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <StatCard
                    title="Lifetime Earnings"
                    value={`$${parseFloat(analytics.lifetimeEarnings?.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    icon={<EarningsIcon />}
                    info={`Currency: ${analytics.lifetimeEarnings?.currency || 'USD'}`}
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
                    icon="✅" // Checkmark icon
                 />
            </div>

             {/* Earnings Chart */}
             <div className="bg-white p-4 md:p-6 shadow rounded-lg border border-border">
                  {/* Container with defined aspect ratio or height */}
                  <div className="h-80 md:h-96 relative">
                     {/* Check if there's data to display */}
                     {analytics.earningsOverTime && analytics.earningsOverTime.length > 0 ? (
                         <Line options={chartOptions} data={earningsChartData} />
                     ) : (
                         <div className="flex items-center justify-center h-full text-text-light text-sm">No earnings data available for the selected period.</div>
                     )}
                 </div>
             </div>

             {/* Add placeholders or implementations for other charts */}
             {/* Example: Proposal Stats Chart */}
             {/* <div className="bg-white p-6 shadow rounded-lg border border-border">
                 <h3 className="text-lg font-semibold text-text-primary mb-4">Proposal Performance</h3>
                 <div className="h-64 flex items-center justify-center text-text-light">
                      Placeholder for Doughnut/Bar chart comparing submitted vs accepted
                 </div>
             </div> */}

        </div>
    );
};

export default ProAnalyticsDashboard;