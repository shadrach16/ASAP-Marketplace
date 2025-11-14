// src/pages/pros/SubmitProposalPage.js (NEW FILE)

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

import jobService from '../../services/jobService';
import proposalService from '../../services/proposalService';
import ProposalForm from '../../components/features/Jobs/ProposalForm';

/**
 * A dedicated page for submitting a proposal, inspired by Upwork.
 * It features a two-column layout: the form on the left,
 * and a summary of the job on the right.
 */
const SubmitProposalPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();


if (user && user?.role === 'pro' && user?.complianceStatus !== 'approved') {
    // Redirect the user away from the page and show a message
    toast.error("Compliance check required. You must be approved to submit proposals.");
    navigate('/dashboard', { replace: true });
    return null; // Block rendering the page content
  }


  // Fetch job details to display in the summary
  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true);
        const jobData = await jobService.getJobById(jobId);
        setJob(jobData);
      } catch (err) {
        setError(err.message || 'Failed to load job details.');
        toast.error(err.message || 'Failed to load job details.');
      } finally {
        setLoading(false);
      }
    };
    loadJob();
  }, [jobId]);

  /**
   * Handles the final submission from the ProposalForm.
   * @param {FormData} proposalFormData - The form data including milestones and attachments.
   */
  const handleProposalSubmit = async (proposalFormData) => {
    try {
      // The proposalService will send the FormData to the backend
      const newProposal = await proposalService.submitProposal(proposalFormData);
      toast.success('Your proposal has been submitted!');
      // Navigate back to the job details page
      navigate(`/jobs/${jobId}`);
    } catch (err) {
      // The error will be displayed within the ProposalForm component
      console.error('Submission failed:', err);
      throw err; // Re-throw to let the form handle its loading state
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p className="text-red-600">{error}</p>
        <Button as={Link} to="/jobs/search" variant="secondary" className="mt-4">
          Back to Find Work
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Submit Proposal | {job?.title}</title>
      </Helmet>
      
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-6">
          <Link
            to={`/jobs/${jobId}`}
            className="flex items-center text-sm text-primary font-medium hover:underline mb-4"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Job Details
          </Link>
          <h1 className="text-3xl font-bold text-text-primary">
            Submit a Proposal
          </h1>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column (Main Form) */}
          <div className="lg:col-span-2 bg-white border border-border rounded-lg shadow-sm">
            {/* The ProposalForm is now a self-contained, advanced component */}
            <ProposalForm
              job={job}
              onSubmit={handleProposalSubmit}
            />
          </div>

          {/* Right Column (Sticky Summary) */}
          <aside className="lg:col-span-1 lg:sticky lg:top-24 space-y-6">
            <JobSummaryCard job={job} />
          </aside>
        </div>
      </div>
    </>
  );
};

// This is a new component to show the job context on the proposal page
const JobSummaryCard = ({ job }) => (
  <div className="p-6 bg-white border border-border rounded-lg">
    <h3 className="text-lg font-semibold text-text-primary mb-3">Job Details</h3>
    <p className="text-sm text-text-secondary whitespace-pre-wrap line-clamp-[12]">
      {job.description}
    </p>
    <Link to={`/jobs/${job._id}`} className="text-sm text-primary font-medium hover:underline mt-3 block">
      View job posting
    </Link>
    
    {job.skills && job.skills.length > 0 && (
      <div className="mt-4 pt-4 border-t border-border-light">
        <h4 className="text-sm font-semibold text-text-primary mb-2">Skills Required</h4>
        <div className="flex flex-wrap gap-2">
          {job.skills.map((skill) => (
            <span key={skill._id} className="px-3 py-1 bg-gray-100 text-text-secondary text-xs font-medium rounded-full border">
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default SubmitProposalPage;