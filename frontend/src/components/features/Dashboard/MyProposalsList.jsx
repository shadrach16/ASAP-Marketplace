// src/components/features/Dashboard/MyProposalsList.js (Redesigned)

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, FileText, DollarSign, Clock, User } from 'lucide-react';
import proposalService from '../../../services/proposalService'; //
import { formatDistanceToNow } from 'date-fns';
import Button from '../../common/Button';

// Define the tabs based on the statuses your service can filter by
const tabs = [
  { name: 'Submitted', status: 'submitted' },
  { name: 'Accepted', status: 'accepted' },
];

/**
 * Renders a single, more detailed proposal card.
 */
const ProposalCard = ({ proposal }) => {
  const job = proposal.job; // Job is populated from the controller
  const client = job?.client; // Client is now populated on the job
  const status = proposal.status || 'submitted';

  return (
    <div className="bg-white p-4 border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <Link to={`/jobs/${job?._id}`} className="block">
        <p className="text-sm font-semibold text-primary hover:underline truncate mb-2">
          {job?.title || 'Job Title Not Found'}
        </p>
        {client?.name && (
          <div className="flex items-center text-xs text-text-secondary mb-3">
            <User size={12} className="mr-1.5" />
            Client: {client.name}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-secondary">
          <span className="flex items-center font-medium text-text-primary">
            <DollarSign size={12} className="mr-1" />
            Your Bid: ${proposal.bidAmount.toFixed(2)}
          </span>
          <span className="flex items-center">
            <Clock size={12} className="mr-1" />
            {formatDistanceToNow(new Date(proposal.createdAt), { addSuffix: true })}
          </span>
        </div>
      </Link>
      {/* Show an action button for accepted proposals */}
      {status === 'accepted' && job?.booking && (
        <div className="mt-3 pt-3 border-t border-border-light">
          <Link   to={`/workspace/${job.booking}`} >
          <Button 
            as={Link} 
            variant="primary" 
            size="sm"
          >
            View Workspace
          </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

/**
 * A stateful component that displays a list of the pro's proposals,
 * now with tabs for "Submitted" and "Accepted".
 */
const MyProposalsList = () => {
  const [proposals, setProposals] = useState([]);
  const [counts, setCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTab, setCurrentTab] = useState('submitted');

  useEffect(() => {
    const fetchProposals = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch proposals based on the currently active tab
        const data = await proposalService.getMyProposals(currentTab); //
        setProposals(data.proposals || []);
        setCounts(data.counts || []);
      } catch (err) {
        console.error("Failed to fetch proposals:", err);
        setError(err.message || 'Failed to load proposals.');
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [currentTab]); // Re-fetch when the tab changes

  return (
    <div className="bg-white border border-border rounded-lg shadow-sm">
      <div className="p-4 border-b border-border-light flex justify-between items-center">
        <h2 className="text-xl font-semibold text-text-primary">
          My Proposals
        </h2>
        {/* This link can go to a future "All Proposals" page */}
        {/* <Link to="/pro/proposals" className="text-sm text-primary hover:underline">
          View all
        </Link> */}
      </div>

      {/* --- New Tabs --- */}
      <div className="px-4 border-b border-border-light">
        <nav className="-mb-px flex space-x-6">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setCurrentTab(tab.status)}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                currentTab === tab.status
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
      {/* --- End Tabs --- */}

      <div className="p-4">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <p className="text-red-600 text-center py-10 text-sm">
            Error: {error}
          </p>
        ) : proposals.length === 0 ? (
          <p className="text-text-secondary text-center py-10">
            You have no {currentTab} proposals.
          </p>
        ) : (
          <div className="space-y-3">
            {proposals.map((prop) => (
              <ProposalCard key={prop._id} proposal={prop} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProposalsList;