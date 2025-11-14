// src/components/features/Dashboard/ProStatsCards.js (NEW FILE)

import React from 'react';
import { DollarSign, Percent, Briefcase, FileText } from 'lucide-react';

/**
 * A single card for displaying a key statistic.
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
 * A container for displaying a row of StatCards based on pro analytics.
 * @param {object} props
 * @param {object} props.stats - The analytics object from getProAnalytics.
 */
const ProStatsCards = ({ stats }) => {
  const { lifetimeEarnings, proposals, bookings } = stats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      <StatCard
        title="Lifetime Earnings"
        value={`$${lifetimeEarnings.amount}`}
        icon={<DollarSign className="w-6 h-6 text-green-700" />}
        bgColor="bg-green-100"
      />
      <StatCard
        title="Active Projects"
        value={bookings.active}
        icon={<Briefcase className="w-6 h-6 text-blue-700" />}
        bgColor="bg-blue-100"
      />
      <StatCard
        title="Proposal Success"
        value={`${proposals.successRate}%`}
        icon={<Percent className="w-6 h-6 text-primary" />}
        bgColor="bg-primary-light bg-opacity-30"
      />
      <StatCard
        title="Pending Proposals"
        value={proposals.totalSubmitted - proposals.totalAccepted}
        icon={<FileText className="w-6 h-6 text-yellow-600" />}
        bgColor="bg-yellow-100"
      />
    </div>
  );
};

export default ProStatsCards;