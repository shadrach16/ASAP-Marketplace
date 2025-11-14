// src/pages/client/jobs/JobDetailsPage.js (Redesigned)

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import {
  DollarSign, MapPin, Clock, Tag, Briefcase, FileText,
  Loader2, CheckCircle, User, Link as LinkIcon, Download,
  Heart, Flag, MessageSquare,AlertTriangle,Trash2  
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../../hooks/useAuth';
import { useSavedJobs } from '../../../hooks/useSavedJobs';

// Import Services
import jobService from '../../../services/jobService';
import proposalService from '../../../services/proposalService';
import aiService from '../../../services/aiService';

// Import Components
import ViewProposals from '../../../components/features/Jobs/ViewProposals';
import SuggestedPros from '../../../components/features/Jobs/SuggestedPros';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal'; // <-- ADDED IMPORT




const STATUS_CONFIG = {
    // 1. Initial State
    'pending': { 
        text: 'Verification Not Started', 
        action: 'Start Verification Process',
        details: 'Identity verification is required for compliance and trust.',
    },
    // 2. Client-side Uploaded, Waiting for Provider Submission
    'submitted': { 
        text: 'Submission Received', 
        details: 'Your documents have been uploaded and are being prepared for external review.',
    },
    // 3. Provider Processing
    'in_review': { 
        text: 'Identity Check In Progress', 
        isAnimated: true,
        details: 'Review typically takes 1-2 business days. Please wait.',
    },
    // 4. Success
    'approved': { 
        text: 'KYC/Identity Verified', 
        details: 'Your profile now displays a trusted verification badge.',
    },
    // 5. Failure
    'rejected': { 
        text: 'Verification Failed', 
        action: 'Re-submit Verification',
        details: 'The submission was rejected. Check your email for details on why.',
    },
    // 6. Maintenance/Re-check Required
    'expired': { 
        text: 'Verification Expired', 
        action: 'Re-submit Verification',
        details: 'Periodic re-verification is required to maintain compliance status.',
    },
}; 


// --- Helper Components (Moved to top for readability) ---
const getFileType = (fileName) => {
  if (!fileName) return 'other';
  const ext = fileName.split('.').pop().toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
  if (ext === 'pdf') return 'pdf';
  if (['doc', 'docx', 'xls', 'xlsx', 'txt'].includes(ext)) return 'doc';
  return 'other';
};

const AttachmentCard = ({ file }) => {
  const fileType = getFileType(file.fileName);
  return (
    <a
      href={file.fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block border border-border rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden"
    >
      <div className="w-full h-40 bg-gray-50 flex items-center justify-center overflow-hidden">
        {fileType === 'image' ? (
          <img
            src={file.fileUrl}
            alt={file.fileName}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center text-gray-400">
            <FileText className="w-16 h-16" />
            <span className="text-sm font-medium mt-2 uppercase">{file.fileName.split('.').pop()}</span>
          </div>
        )}
      </div>
      <div className="p-3 bg-white border-t border-border-light">
        <p className="text-sm font-medium text-text-primary truncate" title={file.fileName}>
          {file.fileName}
        </p>
      </div>
    </a>
  );
};

const InfoCard = ({ icon, title, children }) => (
  <div className="flex items-start p-4 bg-white border border-border rounded-lg">
    <div className="flex-shrink-0 text-text-secondary mt-1">{icon}</div>
    <div className="ml-3">
        <span className="text-sm font-semibold text-text-secondary uppercase tracking-wide">{title}</span>
        <p className="text-md font-medium text-text-primary">{children}</p>
    </div>
  </div>
);
// --- End Helper Components ---

const JobDetailsPage = () => {
  const { jobId } = useParams();
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { isJobSaved, toggleSaveJob } = useSavedJobs();

  // State
  const [job, setJob] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [suggestedPros, setSuggestedPros] = useState([]);
  const [myProposal, setMyProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  
  // --- ADDED: State for proposal modal ---
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // <-- NEW: State for delete confirmation
  const [isDeleting, setIsDeleting] = useState(false); // <-- NEW: State for delete loading

  // Derived states (Cleaned up optional chaining)
  const isClientOwner = user && job && user.role === 'client' && user._id === job.client?._id;
  const isPro = user?.role === 'pro';
  const hasSubmitted = !!myProposal;
  const canProSubmit = isPro && job && job.status === 'open' && !hasSubmitted;
  const isHiredPro = user && job && isPro && job.pro?._id === user._id;

  // --- Data Fetching ---
  const loadJobDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const jobData = await jobService.getJobById(jobId);
      if (!jobData) throw new Error("Job not found.");
      setJob(jobData);
    } catch (err) {
      console.error("Error loading job details:", err);
      setError(err.message || 'Failed to load job details.');
      setJob(null);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    loadJobDetails();
  }, [loadJobDetails]);

  useEffect(() => {
    if (!job || !user) return;
    
    if (isClientOwner) {
      proposalService.getProposalsForJob(jobId)
        .then(setProposals)
        .catch(err => toast.error("Failed to load proposals."));
      if (job.status === 'open') {
        setLoadingSuggestions(true);
        aiService.getJobMatches(jobId)
          .then(setSuggestedPros)
          .catch(err => toast.error("Failed to load AI suggestions."))
          .finally(() => setLoadingSuggestions(false));
      }
    }

    if (isPro) {
      proposalService.getProposalsForJob(jobId) //
        .then(allProposals => {
          // --- FIX: Check p.pro._id as p.pro is a populated object ---
          const foundProposal = allProposals.find(p => p.pro?._id === user._id);
          setMyProposal(foundProposal || null);
        })
        .catch(err => toast.error("Failed to check proposal status."));
    }
  }, [jobId, user, job, isClientOwner, isPro]);
  // --- End Data Fetching ---


const handleDeleteJob = async () => {
    setIsDeleting(true);
    try {
      await jobService.deleteJob(jobId);
      toast.success('Job post deleted successfully.');
      navigate('/dashboard'); // Redirect client to their jobs list
    } catch (err) {
      console.error('Delete Job Failed:', err);
      const errorMessage = err.message || 'Failed to delete job. Ensure no proposals have been submitted.';
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };


  // --- Right Panel Logic (UPDATED) ---
  const renderRightPanel = () => {
    // 1. Client Owner View
    if (isClientOwner) {
      return (
        <div className="p-6 bg-white border rounded-lg border-border space-y-6">
          <h3 className="text-lg font-semibold text-text-primary">About Your Job</h3>
          
          {/* Stats */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">Status</span>
            <span className={`capitalize font-medium px-2 py-0.5 rounded-full text-sm ${job.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
              {job.status?.replace('_', ' ')}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">Proposals</span>
            <span className="font-semibold text-text-primary">{proposals.length}</span>
          </div>
          
          {/* --- ADDED: View Proposals Button --- */}
          {proposals.length > 0 && (
            <Button 
              variant="primary" 
              className="w-full my-2"
              onClick={() => setIsProposalModalOpen(true)} // <-- Triggers modal
            >
              View Proposals ({proposals.length})
            </Button>
          )}

          {['in_progress', 'completed'].includes(job.status) && job.booking && (
            <Button as={Link} to={`/workspace/${job.booking}`} variant="secondary" className="w-full my-2">
              Go to Project Workspace
            </Button>
          )}

       

          {job.status === 'open' && (
              <div className='space-y-2'>
                <Button as={Link} to={`/jobs/${jobId}/edit`} variant="primary" className="w-full mt-4 mb-2">
                  Edit Job Post
                </Button>
                <Button 
                  variant="secondary" 
                  className="w-full flex items-center justify-center mt-2 border-red-600 text-red-600"
                  onClick={() => setIsDeleteModalOpen(true)} // <-- Triggers delete modal
                  disabled={isDeleting}
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete Job Post
                </Button>
              </div>
          )}




        </div>
      );
    }

    // 2. Pro: Can Submit Proposal
    if (canProSubmit) {
      const isSaved = isJobSaved(jobId);
      return (
        <div className="p-6 bg-white border rounded-lg border-border space-y-4">


        { user?.complianceStatus !== 'approved' && (
            <div className='p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-4 mb-3  '>
                <AlertTriangle className='w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5' />
                <div>
                    <h3 className='text-md font-semibold text-yellow-800'>Compliance Check Required</h3>
                    <p className='text-sm text-yellow-700 mt-1'>
                        Your account compliance status is currently <strong>{user.complianceStatus.replace('_', ' ')}</strong>. {STATUS_CONFIG[user?.complianceStatus]?.details}
                      <br />       <Link to={user?.complianceStatus === 'in_review'? `/pros/${user._id}`:"/pro/onboarding"} 
                        className='text-yellow-800 border-yellow-600 no-underline font-medium underline ml-1 hover:text-gray-900 border p-2 w-52 mt-3 bg-secondary rounded-md block'>
                           {user?.complianceStatus === 'in_review'? "View Compliance Status":"Continue with Onboarding"}
                        </Link>
                    </p>
                </div>
            </div>
        )}

          <Button
            as={Link}
            to={`/jobs/${jobId}/propose`}
            variant="primary"
            className="w-full" 
            disabled={user?.complianceStatus !== 'approved'}
          >
            Apply Now
          </Button>
          <Button
            variant="secondary"
            onClick={() => toggleSaveJob(job)} 
            className='flex items-center justify-center w-full'
          >
            <Heart size={16} className={`mr-2 ${isSaved ? 'fill-primary text-primary' : ''}`} />
            {isSaved ? 'Saved' : 'Save Job'}
          </Button>
          <Button variant="ghost" className="w-full text-text-secondary hover:text-red-600 flex justify-center items-center">
            <Flag size={16} className="mr-2" />
            Flag as inappropriate
          </Button>
        </div>
      );
    }

    // 3. Pro: Already Submitted
    if (hasSubmitted) {
      return (
        <div className="p-6 bg-white border border-border rounded-lg text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
          <h3 className="text-lg font-semibold text-text-primary mt-4">Proposal Submitted</h3>
          <p className="text-sm text-text-secondary mt-1">
            Your bid: <span className="font-bold text-text-primary">${myProposal.bidAmount.toFixed(2)} {myProposal.currency}</span>
          </p>
          {isHiredPro && job.booking && (
            <Button as={Link} to={`/workspace/${job.booking}`} variant="primary" className="w-full mt-4">
              Go to Project Workspace
            </Button>
          )}
        </div>
      );
    }

    // 4. Guest / Non-Pro
    if (job.status === 'open') {
      return (
        <div className="p-6 bg-white border border-border rounded-lg text-center space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">Apply for this Job</h3>
          <Button
            as={Link}
            to={user ? '/jobs/search' : '/login'}
            state={{ from: location }}
            variant="primary"
            className="w-full"
          >
            {user ? 'View Other Jobs' : 'Log In to Apply'}
          </Button>
        </div>
      );
    }

    // 5. Job is not open
    return (
      <div className="p-6 bg-white border border-border rounded-lg">
        <h3 className="font-semibold text-text-primary">Job Status</h3>
        <p className="text-sm text-text-secondary capitalize mt-1">
          This job is currently {job.status?.replace('_', ' ')}.
        </p>
      </div>
    );
  };

  // --- Main Render ---

  if (loading || authLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }
  
  if (error) {
    return <p className="text-center py-10 text-red-600">{error}</p>;
  }
  
  if (!job) {
    return <p className="text-center py-10">Job not found.</p>;
  }

  return (
    <>
      <Helmet>
        <title>{`${job.title} | ASAP`}</title>
        <meta name="description" content={job.description.slice(0, 160) + '...'} />
      </Helmet>

      {/* --- Page Header --- */}
      <div className="  border-border mt-3">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2 break-words">{job.title}</h1>
          <div className="flex flex-wrap items-center text-sm text-text-secondary gap-x-6 gap-y-2">
            <span className="flex items-center text-primary font-medium">
              <Tag className="w-4 h-4 mr-1.5" />
              {job.category?.name}
            </span>
            <span className="flex items-center">
              <User className="w-4 h-4 mr-1.5" />
              Posted by {job.client?.name}
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1.5" />
              {format(new Date(job.createdAt), 'MMM d, yyyy')}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* --- Left Column (Main Content) --- */}
          <div className="lg:col-span-2 ">
            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4  mb-6">
              <InfoCard icon={<DollarSign size={20} />} title="Budget">
                ${job.budget?.toFixed(0) ?? '?'} {job.currency}
              </InfoCard>
              <InfoCard icon={<MapPin size={20} />} title="Location">
                {job.location || 'Remote'}
              </InfoCard>
            </div>
            
            <div className="bg-white border border-border rounded-lg shadow-sm divide-y divide-border-light">
            {/* Description */}
            <section className="p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-3">Job Details</h2>
              <div className="prose prose-sm max-w-none text-text-primary whitespace-pre-wrap">
                {job.description}
              </div>
            </section>
            
            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <section className="p-6">
                <h2 className="text-lg font-semibold text-text-primary mb-3">Skills Required</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span key={skill._id} className="px-3 py-1 border bg-green-50 text-text-secondary text-sm font-medium rounded-full">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Attachments */}
            {job.attachments && job.attachments.length > 0 && (
              <section className='p-6'>
                <h2 className="text-lg font-semibold text-text-primary mb-4">Attachments ({job.attachments.length})</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {job.attachments.map((file, index) => (
                    <AttachmentCard key={index} file={file} />
                  ))}
                </div>
              </section>
            )}

            {/* Activity */}
            <section className="p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-3">Activity on this job</h2>
              <p className="flex items-center text-sm text-text-secondary">
                <MessageSquare size={16} className="mr-2" />
                Proposals: {proposals.length}
              </p>
            </section>
          </div>
          </div>
          
          {/* --- Right Column (Action Panel) --- */}
          <aside className="lg:col-span-1 lg:sticky lg:top-24 space-y-6">
            {renderRightPanel()}
            
            <div className="p-6 bg-white border border-border rounded-lg">
              <h3 className="text-lg font-semibold text-text-primary">About the Client</h3>
              <div className="flex items-center space-x-3 mt-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-text-secondary">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-semibold text-text-secondary">{job.client?.name}</span>
                </div>
              </div>
            </div>

            {job.skills && job.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span key={skill._id} className="px-3 py-1 border bg-gray-100 text-text-secondary text-sm font-medium rounded-full">
                      {skill.name}
                    </span>
                  ))}
              </div>
            )}
          </aside>
        </div>

        {/* --- Client-Only Sections (Full Width Below) --- */}
        {isClientOwner && (
          <div className="mt-12 pt-8 border-t border-border-light">
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">Recommended Professionals</h2>
              {loadingSuggestions && <p className="text-sm text-text-secondary animate-pulse">Loading suggestions...</p>}
              {!loadingSuggestions && <SuggestedPros pros={suggestedPros} />}
            </section>

            {/* --- REMOVED: The old proposal list from here --- */}
          </div>
        )}
      </div>

      {/* --- ADDED: Modal for viewing proposals --- */}
      {isClientOwner && (
        <Modal
          isOpen={isProposalModalOpen}
          onClose={() => setIsProposalModalOpen(false)}
          title={`Proposals Received (${proposals.length})`}
        >
       
          <ViewProposals proposals={proposals} jobId={jobId} />
        </Modal>
      )}


      {isClientOwner && job.status === 'open' && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Confirm Job Deletion" 
          isAlert

        >
          <div className="p-4">
            <p className="text-md text-text-secondary mb-4">
              Are you sure you want to <strong>permanently delete</strong> the job "{job.title}"?
            </p>
            <p className="text-sm text-red-600 mb-6 font-medium">
              <strong>Warning:</strong> This action cannot be undone. If the job has proposals, the deletion might be blocked (you may need to "Cancel" the job instead).
            </p>
            <div className="flex justify-end space-x-3" >
              <Button 
                variant="secondary" 
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleDeleteJob}
                disabled={isDeleting}
                className='bg-red-600 '
              >
                {isDeleting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Delete Job'
                )}
              </Button>
            </div>
          </div>
        </Modal>
      )}


    </>
  );
};

export default JobDetailsPage;