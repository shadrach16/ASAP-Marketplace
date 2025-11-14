// src/pages/jobs/SavedJobsPage.jsx

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Bookmark, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

// Assuming your components are accessible via relative paths
import { useSavedJobs } from '../../../hooks/useSavedJobs';
import JobCard from '../../../components/features/Jobs/JobCard'; 
import Button from '../../../components/common/Button'; 

/**
 * Page to display all jobs the user has saved.
 */
const SavedJobsPage = () => {
    // Retrieve saved jobs array and count from the hook
    const { getSavedJobsArray, savedJobCount } = useSavedJobs();
    const savedJobs = getSavedJobsArray(); // Jobs are returned as an array, newest first

    const hasSavedJobs = savedJobs.length > 0;

    return (
        <>
            <Helmet>
                <title>{`Saved Jobs (${savedJobCount}) | Asap`}</title>
            </Helmet>

     


            <div className="container mx-auto px-4 py-8 max-w-7xl">
                
                <header className="mb-8 border-b pb-4 flex flex-col sm:flex-row sm:items-center justify-between">
                    <h1 className="text-3xl font-bold text-text-primary flex items-center mb-2 sm:mb-0">
                        <Bookmark className="w-7 h-7 mr-3 text-primary" />
                        Your Saved Creations
                    </h1>
                    {hasSavedJobs && (
                        <p className="text-lg font-medium text-text-secondary">
                            {savedJobCount} {savedJobCount === 1 ? 'Project' : 'Projects'} Saved
                        </p>
                    )}
                </header>

                <main className="space-y-6">
                    {!hasSavedJobs ? (
                        // Empty State component, inspired by the JobCard.Empty logic
                        <div className="p-10 border border-border rounded-lg text-center bg-white shadow-sm">
                            <Briefcase className="w-10 h-10 mx-auto text-text-light mb-4" />
                            <p className="text-xl font-semibold text-text-primary mb-2">
                                You haven't bookmarked any projects yet.
                            </p>
                            <p className="text-text-secondary mb-6">
                                Explore the marketplace and click the bookmark icon on any interesting job to save it for later.
                            </p>
                            <Link to="/jobs/search">
                                <Button variant="primary">
                                    Browse Job Marketplace
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        // Use JobCard.List wrapper and map over saved jobs
                        <JobCard.List>
                            {savedJobs.map((job) => (
                                <JobCard
                                    key={job._id}
                                    job={job}
                                />
                            ))}
                        </JobCard.List>
                    )}
                </main>
            </div>
        </>
    );
};

 

export default SavedJobsPage;