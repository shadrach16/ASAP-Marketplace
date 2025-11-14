// src/pages/Client/PostJobPage.js (or similar path)

import React, { useState, useEffect, useCallback } from 'react'; // ADD useEffect, useCallback
import { useNavigate, useParams } from 'react-router-dom'; // ADD useParams
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react'; // ADD Loader2 for loading state

import JobForm from '../../../components/features/Jobs/JobForm';
import JobAiAssistant from '../../../components/features/Jobs/JobAiAssistant';

import jobService from '../../../services/jobService'; //

const PostJobPage = () => {
    const { jobId } = useParams(); // <-- Get jobId from route params
    const isEditMode = !!jobId; // <-- Determine if in edit mode

    const [aiDescription, setAiDescription] = useState('');
    const [submissionLoading, setSubmissionLoading] = useState(false);
    const [submissionError, setSubmissionError] = useState(null);
    const [initialJobData, setInitialJobData] = useState(null); // <-- New state for edit data
    const [loadingJob, setLoadingJob] = useState(isEditMode); // <-- New state for loading in edit mode

    const navigate = useNavigate();

    // --- Fetch Job Data if in Edit Mode ---
    useEffect(() => {
        if (!isEditMode) {
            setLoadingJob(false);
            return;
        }

        const fetchJobData = async () => {
            try {
                const jobData = await jobService.getJobById(jobId);
                
                // Map the fetched data to the structure JobForm expects
                // Skills and category are populated objects, we need their IDs for the form.
                const mappedData = {
                    ...jobData,
                    category: jobData.category?._id, // Send back just the ID
                    skills: jobData.skills, // Send back an array of IDs
                };
                
                setInitialJobData(mappedData);
                setLoadingJob(false);
            } catch (err) {
                toast.error("Failed to load job for editing or you are not authorized.");
                setLoadingJob(false);
                navigate('/dashboard', { replace: true });
            }
        };

        fetchJobData();
    }, [isEditMode, jobId, navigate]);


    /**
     * Callback for the JobAiAssistant to pass up the generated description.
     */
    const handleAiSuggestion = (description) => {
        setAiDescription(description);
    };

    /**
     * Handles the final submission/update of the multi-step form.
     */
    const handleJobSubmit = async (formData) => {
        setSubmissionLoading(true);
        setSubmissionError(null);
       
        try {
            let resultJob;
            
            if (isEditMode) {
                // UPDATE EXISTING JOB
                resultJob = await jobService.updateJob(jobId, formData);
                toast.success('Job updated successfully!');
            } else {
                // CREATE NEW JOB
                resultJob = await jobService.postJob(formData);
                toast.success('Job posted successfully!');
            }
            
            // Navigate to the job details page
            navigate(`/jobs/${resultJob._id}`, { replace: true });
            
        } catch (err) {
            const errorMessage = err.message || (err.error && err.error.message) || 'An unexpected error occurred.';
            setSubmissionError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setSubmissionLoading(false);
        }
    };

    // Show loading spinner while fetching in edit mode
    if (loadingJob) {
        return (
             <div className="flex justify-center items-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }
    
    // If in edit mode and initial data is null, the error/redirect logic above handled it
    if (isEditMode && !initialJobData) {
        return null;
    }


    return (
        <>
            <Helmet>
                <title>{isEditMode ? `Edit Job: ${initialJobData?.title || 'Loading...'}` : 'Post a New Job'} | ASAP</title>
                <meta name="description" content={isEditMode ? "Edit your existing job posting." : "Post a new job to find qualified professionals."} />
            </Helmet>

            <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-text-primary">
                        {isEditMode ? 'Edit Job Post' : 'Post a New Job'}
                    </h1>
                    <p className="text-lg text-text-secondary mt-1">
                        {isEditMode ? 'Modify your project details to attract the right professionals.' : 'Clearly describe your project to attract reliable trade professionals.'}
                    </p>
                </div>

                {/* Main Content Grid: 1 col for AI, 2 cols for Form */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    
                    {/* Column 1: AI Assistant (Hide in Edit Mode) */}
                    {!isEditMode && (
                        <div className="lg:col-span-1">
                            <JobAiAssistant 
                                onSuggestion={handleAiSuggestion} 
                                disabled={submissionLoading} 
                            />
                        </div>
                    )}
                    
                    {/* Column 2: Multi-Step Job Form */}
                    <div className={isEditMode ? "lg:col-span-3" : "lg:col-span-2"}> {/* Full width if no AI Assistant */}
                        <div className="bg-white p-6 sm:p-8 border border-border rounded-lg shadow-xs">
                            <JobForm
                                onFormSubmit={handleJobSubmit}
                                submissionLoading={submissionLoading}
                                submissionError={submissionError}
                                aiGeneratedDescription={aiDescription}
                                isEditMode={isEditMode} // <-- PASS NEW PROP
                                initialData={initialJobData} // <-- PASS NEW PROP
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PostJobPage;