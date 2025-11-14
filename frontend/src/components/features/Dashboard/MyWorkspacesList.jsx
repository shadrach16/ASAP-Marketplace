// src/components/features/Dashboard/MyWorkspacesList.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, ChevronRight, Calendar,AlertCircle,CheckCircle2 } from 'lucide-react';
import Button from '../../common/Button';
import bookingService from '../../../services/bookingService';
 



const tabs = [
  { name: 'Active', status: 'active', icon: AlertCircle, color: 'text-blue-600' },
  { name: 'Completed', status: 'completed', icon: CheckCircle2, color: 'text-green-600' },
];


/**
 * Renders a single workspace card with modern styling
 */
const WorkspaceCard = ({ booking }) => {
  const formattedDate = new Date(booking.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="group bg-white border border-gray-200 hover:border-gray-300 rounded-lg transition-all duration-200 hover:shadow-sm">
      <Link
        to={`/workspace/${booking._id}`}
        className="block p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Project Title */}
            <h3 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
              {booking.job?.title || 'Project Workspace'}
            </h3>
            
            {/* Client Info */}
            <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
              <span className="font-medium">{booking.client?.name || 'Client Name'}</span>
            </div>

            {/* Date */}
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <Calendar size={14} />
              <span>Started {formattedDate}</span>
            </div>
          </div>

          {/* Arrow Icon */}
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-gray-100 flex items-center justify-center transition-colors">
              <ChevronRight size={18} className="text-gray-600" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

/**
 * Empty state component
 */
const EmptyState = ({ status }) => (
  <div className="text-center py-16 px-4">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg
        className="w-8 h-8 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      No {status} workspaces
    </h3>
    <p className="text-sm text-gray-500 max-w-sm mx-auto">
      {status === 'active' 
        ? "You don't have any active projects at the moment."
        : "You haven't completed any projects yet."}
    </p>
  </div>
);

/**
 * Main component displaying tabbed workspace list
 */
const MyWorkspacesList = () => {
  const [currentTab, setCurrentTab] = useState('active');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      setLoading(true);
      setBookings([]);
      try {
        const data = await bookingService.getMyBookings(currentTab);
        setBookings(data.bookings || []);
      } catch (err) {
        console.error("Failed to fetch workspaces:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, [currentTab]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">My Workspaces</h2>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex px-6" aria-label="Tabs">

          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.name}
                onClick={() => setCurrentTab(tab.status)}
                className={`relative flex items-center gap-2 px-4 py-3.5 font-medium text-sm transition-all duration-200 ${
                  currentTab === tab.status
                    ? 'text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon size={18} className={currentTab === tab.status ? tab.color : 'text-gray-400'} />
                {tab.name}
                {currentTab === tab.status && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
                )}
              </button>
            );
          })}


        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : bookings.length === 0 ? (
          <EmptyState status={currentTab} />
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => (
              <WorkspaceCard key={booking._id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyWorkspacesList;