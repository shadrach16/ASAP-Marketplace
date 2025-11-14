// src/components/features/Dashboard/DashboardHeader.js (UPDATED)

import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../common/Button';
import { Plus, Search } from 'lucide-react';

/**
 * Renders the main header for the dashboard.
 * @param {object} props
 * @param {string} props.userName - The name of the logged-in user.
 * @param {string} [props.primaryActionText="Post a New Job"] - Text for the primary button.
 * @param {string} [props.primaryActionLink="/post-job"] - Link for the primary button.
 */
const DashboardHeader = ({
  userName,
  primaryActionText = 'Post a New Job',
  primaryActionLink = '/client/jobs/new',
}) => {
  const isFindingWork = primaryActionLink === '/jobs/search';

  return (
    <div className="mt-4">
      <div className="container mx-auto py-5 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Welcome back, {userName}!
          </h1>
          <p className="text-md text-text-secondary mt-1">
            Here's what's happening on ASAP today.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
           <Link         to={primaryActionLink} >
          <Button
            variant="primary"
            className="flex items-center"
          >
            {isFindingWork ? (
              <Search size={18} className="mr-2" />
            ) : (
              <Plus size={18} className="mr-2" />
            )}
            {primaryActionText}
          </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;