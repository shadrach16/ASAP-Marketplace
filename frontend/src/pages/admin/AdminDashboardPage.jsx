import React from 'react';
import AnalyticsDashboard from '../../components/features/Admin/AnalyticsDashboard'; // Import Analytics

const AdminDashboardPage = () => {
    return (
        <div>
            <h1 className="text-2xl font-semibold text-text-primary mb-6">Admin Dashboard</h1>

            {/* Integrate Analytics Component */}
            <AnalyticsDashboard />

            {/* Add quick links or summaries */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {/* Example Stats Card */}
                 <div className="bg-white p-4 shadow rounded-lg border border-border">
                     <h3 className="text-lg font-semibold text-text-primary">Pending Disputes</h3>
                     <p className="text-3xl font-bold text-yellow-600 mt-2">5</p> {/* Replace with dynamic data */}
                 </div>
                 <div className="bg-white p-4 shadow rounded-lg border border-border">
                     <h3 className="text-lg font-semibold text-text-primary">New Users (24h)</h3>
                     <p className="text-3xl font-bold text-primary mt-2">12</p> {/* Replace with dynamic data */}
                 </div>
                 {/* Add more cards */}
            </div>
        </div>
    );
};

export default AdminDashboardPage;