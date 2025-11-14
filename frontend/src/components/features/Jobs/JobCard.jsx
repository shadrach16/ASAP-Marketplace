// src/components/features/Jobs/JobCard.js (Cleaned Up)

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  MessageSquare, 
  Briefcase,
  Shield,
  Heart
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useSavedJobs } from '../../../hooks/useSavedJobs'; // <-- This now comes from Context
import Button from '../../common/Button';

// (Helper functions remain the same...)
const formatTimeAgo = (dateString) => {
  if (!dateString) return 'Recently';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Recently';
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    return 'Recently';
  }
};
const formatCurrency = (amount, currency = 'USD') => {
  if (amount == null || isNaN(amount)) return 'Budget not specified';
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch (error) {
    return `$${amount.toFixed(0)} ${currency}`;
  }
};
const getProposalBadgeStyle = (count) => {
  if (count === 0) return { bg: 'bg-green-50', text: 'text-green-700', label: 'Be the first!' };
  if (count < 5) return { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Low competition' };
  if (count < 10) return { bg: 'bg-yellow-50', text: 'text-yellow-700', label: 'Moderate' };
  return { bg: 'bg-orange-50', text: 'text-orange-700', label: 'High competition' };
};
// --- End Helper Functions ---


const JobCard = ({ job, className = '', isFirst = false }) => {
  // --- THIS NOW WORKS ---
  // This hook gets its state from the single provider
  const { isJobSaved, toggleSaveJob } = useSavedJobs();
  const isSaved = isJobSaved(job._id);

  if (!job) return null;

  const {
    _id,
    title = 'Untitled Job',
    description = '',
    budget,
    currency = 'USD',
    location = 'Remote',
    createdAt,
    proposalCount = 0,
    skills = [],
    client,
    category
  } = job;

  // Use the 'skills.name' array directly from the updated controller
  const skillNames = Array.isArray(job.skills) ? job.skills.map(s => s.name || s).filter(Boolean) : [];

  const proposalBadge = getProposalBadgeStyle(proposalCount);
  const truncatedDescription = description.length > 200 
    ? `${description.substring(0, 200)}...` 
    : description;

  const handleSaveClick = (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    toggleSaveJob(job); 
  };

  return (
    <article 
      // --- UPDATED STYLING ---
      className={`group p-6 transition-colors duration-200 bg-white border border-gray-200 mb-3 rounded-lg "
      } ${className}  hover:bg-gray-100`}
      role="article"
      aria-labelledby={`job-title-${_id}`}
    >
       <Link 
            to={`/jobs/${_id}`}
            id={`job-title-${_id}`}>
      <div className="mb-3  ">
        <div className="flex items-start justify-between gap-4 mb-2 ">
          <Link 
            to={`/jobs/${_id}`}
            id={`job-title-${_id}`}
            className="text-lg font-semibold text-gray-900 hover:text-primary 
                     transition-colors duration-150 group-hover:underline decoration-2 
                     decoration-primary/30 underline-offset-2 flex-1"
          >
            {title}
          </Link>
          
          {/* --- SAVE JOB BUTTON (FIXED) --- */}
          <Button
            variant="ghost" // Use 'ghost' for a borderless button
            size="icon"
            onClick={handleSaveClick}
            aria-label={isSaved ? 'Remove from saved jobs' : 'Save job'}
            className="rounded-full text-primary hover:bg-primary-light hover:bg-opacity-20"
          >
            <Heart 
              size={18} 
              className={`transition-all ${isSaved ? 'fill-primary text-primary' : 'fill-none text-text-secondary group-hover:text-primary'}`} 
            />
          </Button>
        </div>

        {/* Category */}
        {category?.name && (
          <div className="flex items-center text-xs text-text-light mb-2">
            <Briefcase size={12} className="mr-1.5" />
            <span>{category.name}</span>
          </div>
        )}
      </div>

       {/* Metadata Bar */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-4 text-sm">
        <div className="flex items-center text-gray-700 font-medium">
          <DollarSign size={16} className="mr-1 text-green-600" />
          <span>{formatCurrency(budget, currency)}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <MapPin size={14} className="mr-1.5 text-gray-400" />
          <span>{location}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Clock size={14} className="mr-1.5 text-gray-400" />
          <span>Posted {formatTimeAgo(createdAt)}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 leading-relaxed mb-4 line-clamp-3">
        {truncatedDescription || 'No description provided.'}
      </p>

      {/* Skills Section (Fixed styling) */}
      {skillNames.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {skillNames.slice(0, 6).map((skillName, index) => (
              <span
                key={`${_id}-skill-${index}`}
                className="inline-flex items-center px-3 py-1 bg-blue-50 
                         text-text-secondary text-xs font-medium 
                         rounded-full cursor-default"
              >
                {skillName}
              </span>
            ))}
            {skillNames.length > 6 && (
              <span className="inline-flex items-center px-3 py-1 text-gray-500 
                             text-xs font-medium">
                +{skillNames.length - 6} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Footer Section */}
      <div className="flex items-center justify-between gap-4 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          {client?.name && (
            <div className="flex items-center">
              <Shield size={14} className="mr-1.5 text-gray-400" />
              <span className="font-medium">{client.name}</span>
            </div>
          )}
        </div>
        <div 
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${proposalBadge.bg} 
                     transition-all duration-200`}
          title={`${proposalCount} proposal${proposalCount !== 1 ? 's' : ''} submitted`}
        >
          <MessageSquare size={14} className={proposalBadge.text} />
          <span className={`text-sm font-semibold ${proposalBadge.text}`}>
            {proposalCount}
          </span>
          <span className={`text-xs ${proposalBadge.text} hidden sm:inline`}>
            {proposalBadge.label}
          </span>
        </div>
      </div>
      </Link>
    </article>
  );
};

// --- (Skeleton, List, and Empty components remain identical) ---
JobCard.Skeleton = () => (
  <div className="p-6 animate-pulse" role="status" aria-label="Loading job">
    <div className="mb-3">
      <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-24"></div>
    </div>
    <div className="flex flex-wrap gap-x-5 gap-y-2 mb-4">
      <div className="h-4 bg-gray-200 rounded w-24"></div>
      <div className="h-4 bg-gray-200 rounded w-28"></div>
      <div className="h-4 bg-gray-200 rounded w-32"></div>
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>
    <div className="flex flex-wrap gap-2 mb-4">
      <div className="h-7 bg-gray-200 rounded-full w-20"></div>
      <div className="h-7 bg-gray-200 rounded-full w-24"></div>
      <div className="h-7 bg-gray-200 rounded-full w-20"></div>
      <div className="h-7 bg-gray-200 rounded-full w-28"></div>
    </div>
    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
      <div className="h-4 bg-gray-200 rounded w-32"></div>
      <div className="h-8 bg-gray-200 rounded-lg w-28"></div>
    </div>
  </div>
);
JobCard.List = ({ children, className = '' }) => (
  <div className={` rounded-lg  
                  divide-y divide-gray-100 overflow-hidden ${className}`}>
    {children}
  </div>
);
JobCard.Empty = ({ message = 'No jobs available', description }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
    <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      {message}
    </h3>
    {description && (
      <p className="text-sm text-gray-600 max-w-md mx-auto">
        {description}
      </p>
    )}
  </div>
);

export default JobCard;