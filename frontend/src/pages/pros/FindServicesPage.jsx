// src/pages/services/FindServicesPage.jsx (Refactored)

import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Loader2, Search } from 'lucide-react';
// --- FIX 1: Import react-router hooks ---
import { useLocation, useNavigate } from 'react-router-dom';

import proService from '../../services/proService';
import ServiceSearchFilterBar from '../../components/features/Services/ServiceSearchFilterBar';
import ServiceCard from '../../components/features/Services/ServiceCard';
import Button from '../../components/common/Button';
import FormInput from '../../components/common/FormInput';

const FindServicesPage = () => {
  // --- FIX 2: Initialize router hooks ---
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  // --- FIX 3: Get search/sort values from URL ---
  // The URL is the single source of truth.
  const urlSearch = queryParams.get('search') || '';
  const urlSort = queryParams.get('sort') || '-createdAt'; // Default: Newest

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [filters, setFilters] = useState({});
  
  // --- FIX 4: `inputValue` state for the search box ---
  // This is separate from the URL's `urlSearch`
  const [inputValue, setInputValue] = useState(urlSearch);

  // --- FIX 5: Sync URL to input box (e.g., for 'Back' button) ---
  useEffect(() => {
    setInputValue(urlSearch);
  }, [urlSearch]);

  const fetchServices = useCallback(async (
    currentPage,
    currentFilters,
    currentSearchTerm,
    currentSort,
    isLoadingMore = false
  ) => {
    // ... (rest of fetchServices function is identical)
  if (isLoadingMore) {
   setLoadingMore(true);
  } else {
   setLoading(true);
  }
  setError(null);

  try {
   const params = {
    page: currentPage,
    limit: 12,
    ...currentFilters,
    searchTerm: currentSearchTerm,
    sort: currentSort,
   };
   // Clean up empty/null params
   Object.keys(params).forEach(key => (params[key] === null || params[key] === '') && delete params[key]);

   const response = await proService.findServices(params);
  
   setServices(prevServices =>
    currentPage === 1 ? response.data : [...prevServices, ...response.data]
   );
  
   setTotalPages(response.totalPages || 1);
   setTotalItems(response.totalItems || 0);
   setPage(response.currentPage || 1);

  } catch (err) {
   setError(err.message || 'Failed to fetch services.');
   if (currentPage === 1) setServices([]);
  } finally {
   setLoading(false);
   setLoadingMore(false);
  }
  }, []);

  // --- FIX 6: Update main effect dependencies ---
  // It now listens to the URL-derived values, not local state.
  useEffect(() => {
    setPage(1);
    setServices([]);
    // Fetch using the values from the URL
    fetchServices(1, filters, urlSearch, urlSort, false);
  }, [filters, urlSearch, urlSort, fetchServices]);


  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // TODO: You could also write these filters to the URL.
  };

  // --- FIX 7: Update Search Submit handler ---
  // It now *only* updates the URL. The useEffect above will handle fetching.
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(location.search);
    
    if (inputValue) {
      newParams.set('search', inputValue);
    } else {
      newParams.delete('search');
    }
    newParams.delete('page'); // Reset to page 1
    
    navigate(`${location.pathname}?${newParams.toString()}`);
  };

  // --- FIX 8: Create a handler for Sort changes ---
  // This also *only* updates the URL.
  const handleSortChange = (e) => {
    const newSort = e.target.value;
    const newParams = new URLSearchParams(location.search);

    newParams.set('sort', newSort);
    newParams.delete('page'); // Reset to page 1

    navigate(`${location.pathname}?${newParams.toString()}`);
  };

  // --- FIX 9: Update Load More handler ---
  // Ensure it uses the URL-derived values, not stale state.
  const handleLoadMore = () => {
    if (page < totalPages && !loadingMore) {
      const nextPage = page + 1;
      // Pass the *current* URL params to fetch
      fetchServices(nextPage, filters, urlSearch, urlSort, true);
    }
  };

  const hasMoreServices = page < totalPages;

  return (
    <>
      <Helmet>
        <title>Find Professional Services | ASAP Marketplace</title>
        <meta name="description" content="Browse services offered by top professionals on ASAP Marketplace." />
      </Helmet>

        <div className="min-h-screen bg-gray-50">


    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-4">Find Your Next Artisan, Fast.</h1>
          <p className="text-green-100 text-lg mb-8">Browse thousands of certified Canadian trade professionals and hire with confidence.</p>
          
          {/* Search Bar */}
          <div className="relative max-w-3xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
                placeholder="Search for services by title, skills, or keywords..."
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


        

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start  container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          
          <aside className="lg:col-span-1 lg:sticky lg:top-24">
            <ServiceSearchFilterBar
              onSearch={handleFilterChange}
              disabled={loading || loadingMore}
            />
          </aside>

          <main className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 mb-6 border-b border-border">
              {loading ? (
                <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              ) : (
                <h1 className="text-xl font-semibold text-text-primary">
                  {totalItems} {totalItems === 1 ? 'Service' : 'Services'} Found
                </h1>
              )}
              
              <select 
                // --- FIX 11: Wire dropdown to URL value and new handler ---
                value={urlSort} 
                onChange={handleSortChange}
                className="mt-3 sm:mt-0 px-3 py-2 border border-border rounded-md shadow-sm text-sm"
              >
                <option value="-createdAt">Newest</option>
                <option value="relevance">Relevance</option>
                <option value="price">Price (Low to High)</option>
                <option value="-price">Price (High to Low)</option>
              </select>
            </div>
            
            {/* ... (Rest of your component is fine) ... */}

      {loading && services.length === 0 && (
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ServiceCard.Skeleton />
        <ServiceCard.Skeleton />
        <ServiceCard.Skeleton />
       </div>
      )}

      {error && <p className="text-center text-red-600 py-6">{error}</p>}

      {!loading && !error && (
       <>
        {services.length === 0 ? (
         <div className="bg-white border border-border rounded-lg p-10 text-center">
          <h3 className="text-xl font-semibold">No Services Found</h3>
          <p className="text-text-secondary mt-2">Try adjusting your search or filters.</p>
         </div>
        ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
           <ServiceCard key={service._id} service={service} />
          ))}
         </div>
        )}
       </>
      )}

      {/* "Load More" Button */}
      <div className="mt-8 text-center">
       {loadingMore && (
        <div className="flex justify-center items-center py-4">
         <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
       )}
       {!loadingMore && hasMoreServices && (
        <Button
         onClick={handleLoadMore}
         variant="primary"
         disabled={loadingMore}
        >
         Load More Services
        </Button>
       )}
       {!loading && !hasMoreServices && services.length > 0 && (
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

export default FindServicesPage;