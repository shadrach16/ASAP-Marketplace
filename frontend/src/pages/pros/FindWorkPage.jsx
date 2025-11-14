// src/pages/pros/FindWorkPage.js (Fixed)

import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Loader2, Search, MapPin, DollarSign, Clock, Heart, Bookmark, ChevronDown, SlidersHorizontal, X, Briefcase, TrendingUp, Star } from 'lucide-react';

import jobService from '../../services/jobService';
import SearchFilterBar from '../../components/ui/SearchFilterBar';
import JobCard from '../../components/features/Jobs/JobCard';
import Button from '../../components/common/Button';
import FormInput from '../../components/common/FormInput';
import { useSavedJobs } from '../../hooks/useSavedJobs';
import { useLocation, useNavigate } from 'react-router-dom';


 

const TABS = [
  { id: 'bestMatches', label: 'Best Matches', icon: Star, sort: 'relevance' },
  { id: 'mostRecent', label: 'Most Recent', icon: Clock, sort: '-createdAt' },
  { id: 'savedJobs', label: 'Saved Jobs', icon: Bookmark },
];


const FindWorkPage = () => {
 const location = useLocation();
 const navigate = useNavigate();
 const queryParams = new URLSearchParams(location.search);

 const [jobs, setJobs] = useState([]);
 const [loading, setLoading] = useState(true);
 const [loadingMore, setLoadingMore] = useState(false);
 const [error, setError] = useState(null);
 const [page, setPage] = useState(1);
 const [totalPages, setTotalPages] = useState(1);
 const [totalItems, setTotalItems] = useState(0);

 const [filters, setFilters] = useState({});

  // --- FIX 1: Rename `searchTerm` to `inputValue` ---
  // This state just holds what's *in the text box*.
 const [inputValue, setInputValue] = useState(queryParams.get('search') || '');

 const [activeTab, setActiveTab] = useState('bestMatches');
 const { getSavedJobsArray, savedJobCount } = useSavedJobs();

 const fetchJobs = useCallback(async (
  currentPage,
  currentFilters,
  currentSearchTerm,
  sort,
  isLoadingMore = false
 ) => {
 
  if (isLoadingMore) {
   setLoadingMore(true);
  } else {
   setLoading(true);
  }
  setError(null);

  try {
   const params = {
    page: currentPage,
    limit: 10,
    ...currentFilters,
    searchTerm: currentSearchTerm, // --- This `currentSearchTerm` comes from the URL now
    sort: sort,
   };

   // Clean up empty params
   Object.keys(params).forEach(key => (params[key] === null || params[key] === '') && delete params[key]);

   const response = await jobService.getJobs(params);
  
   setJobs(prevJobs =>
    currentPage === 1 ? response.data : [...prevJobs, ...response.data]
   );
  
   setTotalPages(response.totalPages || 1);
   setTotalItems(response.totalItems || 0);
   setPage(response.currentPage || 1);

  } catch (err) {
   setError(err.message || 'Failed to fetch jobs.');
   if (currentPage === 1) setJobs([]);
  } finally {
   setLoading(false);
   setLoadingMore(false);
  }
 }, []);

  // --- FIX 2: Add this new effect ---
  // This effect syncs the URL to the input box, e.g., when the user clicks "Back".
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setInputValue(params.get('search') || '');
  }, [location.search]);


 // --- FIX 3: Update main fetching effect ---
 useEffect(() => {
  if (activeTab === 'savedJobs') {
   setLoading(true);
   const saved = getSavedJobsArray();
   setJobs(saved);
   setTotalItems(saved.length);
   setPage(1);
   setTotalPages(1);
   setLoading(false);
   return;
  }

  const currentTabConfig = TABS.find(t => t.id === activeTab);
  const sort = currentTabConfig.sort;

    // --- FIX 3a: Get the search term from the URL (our source of truth) ---
    const params = new URLSearchParams(location.search);
    const urlSearchTerm = params.get('search') || '';
 
  setPage(1);
  setJobs([]);
    // --- FIX 3b: Use the URL's search term to fetch ---
  fetchJobs(1, filters, urlSearchTerm, sort, false);

  // --- FIX 3c: Update dependency array. Remove `searchTerm`. ---
  // `location.search` now correctly triggers a refetch.
 }, [activeTab, filters, location.search, fetchJobs, getSavedJobsArray]);

 const handleFilterChange = (newFilters) => {
    // TODO: You can also update the URL with filter params here
  setFilters(newFilters);
 };

 // --- FIX 4: Update the submit handler ---
 const handleSearchSubmit = (e) => {
  e.preventDefault();
    // This handler's ONLY job is to update the URL.
    // The `useEffect` above will see the URL change and trigger the fetch.

  const newParams = new URLSearchParams(location.search);
    if (inputValue) {
    newParams.set('search', inputValue);
    } else {
      newParams.delete('search'); // Remove from URL if empty
    }
    
    // Always reset to page 1 on a new search
    newParams.delete('page'); 

    // Use navigate to update the URL
    navigate(`${location.pathname}?${newParams.toString()}`);
 };

 // --- FIX 5: Update `handleLoadMore` ---
 const handleLoadMore = () => {
  if (page < totalPages && !loadingMore && activeTab !== 'savedJobs') {
   const nextPage = page + 1;
   const currentTabConfig = TABS.find(t => t.id === activeTab);
   const sort = currentTabConfig.sort;

      // --- FIX 5a: Get current search term from the URL ---
      const params = new URLSearchParams(location.search);
      const urlSearchTerm = params.get('search') || '';
  
      // --- FIX 5b: Pass the URL search term ---
   fetchJobs(nextPage, filters, urlSearchTerm, sort, true);
  }
 };

 const hasMoreJobs = page < totalPages;

 const getHeaderJobCount = () => {
  if (activeTab === 'savedJobs') {
   return savedJobCount;
  }
  return totalItems;
 };

 return (
  <>
   <Helmet>
    <title>Find Freelance Work | ASAP Marketplace</title>
    <meta name="description" content="Browse and apply for freelance jobs on ASAP Marketplace." />
   </Helmet>

  <div className="min-h-screen bg-gray-50">
   

    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-4">Secure Your Next Contract.</h1>
          <p className="text-green-100 text-lg mb-8">Browse thousands of pre-vetted projects—from quick repairs to large-scale renovations—that match your skills.</p>
          
          {/* Search Bar */}
          <div className="relative max-w-3xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
                placeholder="Search for jobs by title, skills, or keywords..."
                className="w-full pl-12 pr-32 py-4 rounded-lg text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              <button
                onClick={handleSearchSubmit}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>



    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start container mx-auto py-8 px-4 sm:px-6 lg:px-8 ">
    
     <aside className="lg:col-span-1 lg:sticky lg:top-24">
      <SearchFilterBar
       onSearch={handleFilterChange}
       disabled={loading || loadingMore || activeTab === 'savedJobs'}
      />
     </aside>

     <main className="lg:col-span-3">
     
        <div className="bg-white border border-gray-200 rounded-lg mb-6">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <nav className="flex gap-1" aria-label="Tabs">
                  {TABS.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm rounded-lg transition-colors ${
                          activeTab === tab.id
                            ? 'bg-green-50 text-green-700'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                        {tab.id === 'savedJobs' && (
                          <span className="ml-1 px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full">
                            {savedJobCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
                
                {!loading && (
                  <span className="text-sm text-gray-600 font-medium">
                  Showing  {jobs.length} of {getHeaderJobCount()} {getHeaderJobCount() === 1 ? 'job' : 'jobs'}
                  </span>
                )}
              </div>
            </div>

      {loading && (
       <div className="space-y-4">
        <JobCard.Skeleton />
        <JobCard.Skeleton />
        <JobCard.Skeleton />
       </div>
      )}

      {error && <p className="text-center text-red-600 py-6">{error}</p>}

      {!loading && !error && (
       <>
        {jobs.length === 0 ? (
         <JobCard.Empty
          message={activeTab === 'savedJobs' ? "You have no saved jobs" : "No Jobs Found"}
          description={activeTab === 'savedJobs' ? "Click the heart icon on a job to save it here." : "Try adjusting your search or filters to find more projects."}
         />
        ) : (
         <JobCard.List>
          {jobs.map((job, index) => (
           <JobCard
            key={job._id}
            job={job}
            isFirst={index === 0 && activeTab === 'bestMatches'}
           />
          ))}
         </JobCard.List>
        )}
       </>
      )}

      <div className="mt-8 text-center">
       {loadingMore && (
        <div className="flex justify-center items-center py-4">
         <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
       )}
      
       {!loadingMore && hasMoreJobs && activeTab !== 'savedJobs' && (
        <Button
         onClick={handleLoadMore}
         variant="primary"
         disabled={loadingMore}
source        >
         Load More Jobs
        </Button>
       )}

       {!loading && !hasMoreJobs && jobs.length > 0 && activeTab !== 'savedJobs' && (
        <p className="text-text-secondary py-4">
         You've reached the end of the list.
        </p>
       )}
      </div>
     </main>
    </div>
   </div>
  </>
 );
};

export default FindWorkPage;