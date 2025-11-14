// src/hooks/useJobSearchParams.js (New Custom Hook)
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Custom hook to manage search, filter, and tab state via URL query parameters.
 * Makes the URL the 'Single Source of Truth' for the job list state.
 */
export const useJobSearchParams = (TABS, defaultTab = 'bestMatches') => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

    // --- State derived from URL ---
    const activeTab = queryParams.get('tab') || defaultTab;
    const searchTerm = queryParams.get('search') || '';
    const currentPage = parseInt(queryParams.get('page')) || 1;
    
    // Filters are complex, we extract them by excluding known parameters
    const getFilterParams = () => {
        const filters = {};
        queryParams.forEach((value, key) => {
            if (!['tab', 'search', 'page', 'sort'].includes(key)) {
                filters[key] = value;
            }
        });
        return filters;
    };
    const filters = getFilterParams();

    // --- Actions to update URL ---

    const updateURL = (key, value) => {
        const newParams = new URLSearchParams(queryParams.toString());

        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        
        // Always reset to page 1 for most state changes (search, filter, tab)
        if (key !== 'page') {
             newParams.delete('page');
        }

        navigate(`${location.pathname}?${newParams.toString()}`);
    };

    const handleTabChange = (newTabId) => {
        updateURL('tab', newTabId === defaultTab ? null : newTabId); // Use null to remove 'tab' if default
    };

    const handleSearchSubmit = (inputValue) => {
        updateURL('search', inputValue);
    };

    const handleFilterChange = (newFilters) => {
        // Clear old filters and set new ones
        const newParams = new URLSearchParams();
        
        // Retain search term, tab, and current page (if required for filters)
        if (searchTerm) newParams.set('search', searchTerm);
        if (activeTab !== defaultTab) newParams.set('tab', activeTab);

        // Apply new filters
        Object.entries(newFilters).forEach(([key, value]) => {
             // Only set non-empty filter values
            if (value && value !== '') {
                newParams.set(key, value);
            }
        });
        
        newParams.delete('page'); // Always reset page on filter change

        navigate(`${location.pathname}?${newParams.toString()}`);
    };
    
    const handlePageChange = (newPage) => {
        updateURL('page', newPage > 1 ? newPage.toString() : null);
    }
    
    // Get the current sort parameter based on the active tab
    const currentTabConfig = TABS.find(t => t.id === activeTab);
    const sortParam = currentTabConfig?.sort;

    return {
        // State
        activeTab,
        searchTerm,
        filters,
        currentPage,
        sortParam,
        // Actions
        handleTabChange,
        handleSearchSubmit,
        handleFilterChange,
        handlePageChange,
    };
};