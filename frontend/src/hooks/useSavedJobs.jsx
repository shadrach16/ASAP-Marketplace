// src/hooks/useSavedJobs.js (Fixed)

import React, {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  useMemo,
} from 'react';
import { toast } from 'sonner';

const STORAGE_KEY = 'asap_savedJobs';

// 1. Create the context
const SavedJobsContext = createContext(null);

/**
 * This component provides the saved jobs state to its children.
 * You will wrap this component around your routes in App.js.
 */
export const SavedJobsProvider = ({ children }) => {
  const [savedJobs, setSavedJobs] = useState(new Map());

  // On initial load, read from localStorage
  useEffect(() => {
    try {
      const storedJobs = localStorage.getItem(STORAGE_KEY);
      if (storedJobs) {
        setSavedJobs(new Map(JSON.parse(storedJobs)));
      }
    } catch (error) {
      console.error('Failed to read saved jobs from localStorage', error);
      setSavedJobs(new Map());
    }
  }, []); // Runs once on mount

  // Persist to localStorage whenever savedJobs state changes
  useEffect(() => {
    try {
      const storableJobs = JSON.stringify(Array.from(savedJobs.entries()));
      localStorage.setItem(STORAGE_KEY, storableJobs);
    } catch (error) {
      console.error('Failed to save jobs to localStorage', error);
    }
  }, [savedJobs]); // Runs every time 'savedJobs' changes

  // --- NEW: Add this effect to sync across tabs ---
  useEffect(() => {
    /**
     * Handles the 'storage' event from other browser tabs.
     */
    const handleStorageChange = (event) => {
      // Check if the change happened to our storage key and was from another tab
      if (event.key === STORAGE_KEY && event.newValue) {
        try {
          // Get the new value and update this tab's state
          setSavedJobs(new Map(JSON.parse(event.newValue)));
        } catch (error) {
          console.error('Failed to update state from storage event', error);
        }
      } else if (event.key === STORAGE_KEY && !event.newValue) {
        // The key was cleared from another tab
        setSavedJobs(new Map());
      }
    };

    // Add the event listener
    window.addEventListener('storage', handleStorageChange);

    // Return a cleanup function to remove the listener
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Only needs to run once to set up the listener
  // --- END OF NEW CODE ---

  /**
   * Adds or removes a job from the saved list.
   */
  const toggleSaveJob = useCallback((job) => {
    if (!job || !job._id) return;

    setSavedJobs(prevMap => {
      const newMap = new Map(prevMap); // Create a new Map to trigger re-render
      if (newMap.has(job._id)) {
        newMap.delete(job._id);
        toast.success('Job removed from saved list.');
      } else {
        newMap.set(job._id, job);
        toast.success('Job saved!');
      }
      return newMap; // Return the new map to update the state
    });
  }, []); // This function is stable

  /**
   * Checks if a job is currently saved.
   */
  const isJobSaved = useCallback((jobId) => {
    return savedJobs.has(jobId);
  }, [savedJobs]);

  /**
   * Returns an array of all saved job objects.
   */
  const getSavedJobsArray = useCallback(() => {
    // Sort by date added (most recent first)
    return Array.from(savedJobs.values()).reverse();
  }, [savedJobs]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    isJobSaved,
    toggleSaveJob,
    getSavedJobsArray,
    savedJobCount: savedJobs.size,
  }), [savedJobs, isJobSaved, toggleSaveJob, getSavedJobsArray]);

  return (
    <SavedJobsContext.Provider value={value}>
      {children}
    </SavedJobsContext.Provider>
  );
};

/**
 * Custom hook to consume the SavedJobsContext.
 * Any component calling this hook MUST be a child of <SavedJobsProvider>.
 */
export const useSavedJobs = () => {
  const context = useContext(SavedJobsContext);
  if (context === null) {
    throw new Error('useSavedJobs must be used within a SavedJobsProvider');
  }
  return context;
};