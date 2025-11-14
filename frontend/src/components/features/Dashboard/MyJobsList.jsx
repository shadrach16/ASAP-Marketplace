// src/components/features/Dashboard/MyJobsList.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Briefcase, Users, Clock, ArrowRight, Package, CheckCircle2, AlertCircle } from 'lucide-react';
import jobService from '../../../services/jobService';

const tabs = [
  { name: 'Active', status: 'in_progress', icon: AlertCircle, color: 'text-blue-600' },
  { name: 'Open', status: 'open', icon: Package, color: 'text-purple-600' },
  { name: 'Completed', status: 'completed', icon: CheckCircle2, color: 'text-green-600' },
];

const StatusBadge = ({ status }) => {
  const styles = {
    in_progress: 'bg-blue-50 text-blue-700 border-blue-200',
    open: 'bg-purple-50 text-purple-700 border-purple-200',
    completed: 'bg-green-50 text-green-700 border-green-200'
  };

  const labels = {
    in_progress: 'In Progress',
    open: 'Open',
    completed: 'Completed'
  };

  return (
    <span className={`inline-flex justify-center items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

/**
 * Renders a single row in the "My Jobs" list.
 * @param {object} props
 * @param {object} props.job - The job object, populated with category and proposalCount.
 */
const JobRow = ({ job }) => (
  <div className="group bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-5 transition-all duration-200 hover:shadow-md hover:border-gray-300">
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between  gap-3 mb-3">
          <Link
            to={`/jobs/${job._id}`}
            className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2  truncate group-hover:underline"
          >
            {job.title}
          </Link>
          <StatusBadge status={job.status} />
        </div>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md">
            <Briefcase size={14} className="text-gray-500" />
            {job.category?.name || 'N/A'}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} className="text-gray-500" />
            {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          {job.status === 'open' && (
            <span className="flex items-center gap-1.5 bg-purple-50 px-2.5 py-1 rounded-md text-purple-700 font-medium">
              <Users size={14} />
              {job.proposalCount || 0} Proposals
            </span>
          )}
        </div>
      </div>
      
      <div className="flex-shrink-0">
        {job.status === 'in_progress' && job.booking ? (
          <Link to={`/workspace/${job.booking}`}>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow group/btn">
              View Workspace
              <ArrowRight size={16} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </Link>
        ) : (
          <Link to={`/jobs/${job._id}`}>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg border border-gray-300 transition-all duration-200 hover:border-gray-400 hover:shadow-sm">
              View Details
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </Link>
        )}
      </div>
    </div>
  </div>
);

/**
 * A stateful component that displays a tabbed list of the client's jobs.
 */
const MyJobsList = () => {
  const [currentTab, setCurrentTab] = useState('in_progress');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch jobs when the selected tab changes
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setJobs([]);
      try {
        // Fetches jobs based on status: 'in_progress', 'open', 'completed'
        const data = await jobService.getMyJobs(currentTab);
        setJobs(data.jobs || []);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
        // You can add a toast error message here if you like
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [currentTab]); // Re-run effect when currentTab changes

  const currentTabInfo = tabs.find(tab => tab.status === currentTab);

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl   overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Jobs</h2>
            <p className="text-sm text-gray-600 mt-1">Manage and track your job postings</p>
          </div>
          {!loading && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
              <span className="text-sm font-medium text-gray-700">{jobs.length}</span>
              <span className="text-sm text-gray-500">{jobs.length === 1 ? 'Job' : 'Jobs'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <nav className="flex gap-1">
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
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
            <p className="text-sm text-gray-600">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              {currentTabInfo && <currentTabInfo.icon size={32} className="text-gray-400" />}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No {currentTab.replace('_', ' ')} jobs</h3>
            <p className="text-sm text-gray-600 text-center max-w-md">
              {currentTab === 'open' && "Start by posting a new job to find talented freelancers."}
              {currentTab === 'in_progress' && "Jobs you're actively working on will appear here."}
              {currentTab === 'completed' && "Your completed jobs will be shown here for reference."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <JobRow key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJobsList;