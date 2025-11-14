// src/components/features/Dashboard/StatsCards.js

import React from 'react';
import { DollarSign, Briefcase, CheckCircle, Star } from 'lucide-react';

/**
 * A single card for displaying a key statistic.
 * @param {object} props
 * @param {string} props.title - The title of the stat (e.g., "Total Spent").
 * @param {string | number} props.value - The value of the stat (e.g., "$1,200").
 * @param {React.ReactNode} props.icon - The icon component to display.
 * @param {string} props.bgColor - The background color class for the icon.
 */
const StatCard = ({ title, value, icon, bgColor }) => (
  <div className="bg-white p-5 border border-border rounded-lg shadow-sm flex items-start">
    <div
      className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${bgColor}`}
    >
      {icon}
    </div>
    <div className="ml-4">
      <p className="text-sm font-medium text-text-secondary uppercase">
        {title}
      </p>
      <p className="text-2xl font-bold text-text-primary">{value}</p>
    </div>
  </div>
);

/**
 * A container for displaying a row of StatCards based on client analytics.
 * @param {object} props
 * @param {object} props.stats - The analytics object from the API.
 * @param {number} props.stats.totalSpend
 * @param {number} props.stats.activeJobs
 * @param {number} props.stats.completedJobs
 * @param {number} props.stats.avgRating
 */
const StatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      <StatCard
        title="Total Spent"
        value={`$${stats.totalSpend.toFixed(2)}`}
        icon={<DollarSign className="w-6 h-6 text-green-700" />}
        bgColor="bg-green-100"
      />
      <StatCard
        title="Active Jobs"
        value={stats.activeJobs}
        icon={<Briefcase className="w-6 h-6 text-blue-700" />}
        bgColor="bg-blue-100"
      />
      <StatCard
        title="Jobs Completed"
        value={stats.completedJobs}
        icon={<CheckCircle className="w-6 h-6 text-primary" />}
        bgColor="bg-primary-light bg-opacity-30"
      />
      <StatCard
        title="Avg. Rating"
        value={stats.avgRating != null ? stats.avgRating.toFixed(1) : 'N/A'}
        icon={<Star className="w-6 h-6 text-yellow-600" />}
        bgColor="bg-yellow-100"
      />
    </div>
  );
};

export default StatsCards;