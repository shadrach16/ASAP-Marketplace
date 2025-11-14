import React, { useState, useEffect } from 'react';
import Button from '../../../components/common/Button';
// Import the redesigned components
import proService from '../../../services/proService'; // Assuming this service is correctly implemented
import { useAuth } from '../../../hooks/useAuth'; 
import api from '../../../services/api'; // Assuming you have a general API instance
import PortfolioItemCard from '../../../components/features/Portfolio/PortfolioItemCard';
import PortfolioEditForm from '../../../components/features/Portfolio/PortfolioEditForm';

// --- Portfolio Management Page ---
const ManagePortfolioPage = () => {
    const { user } = useAuth(); 
    const [portfolioItems, setPortfolioItems] = useState([]);
    const [loading, setLoading] = useState(false); // General loading state (for initial fetch)
    const [actionLoading, setActionLoading] = useState(false); // For add/edit/delete actions
    const [error, setError] = useState(null); // General error
    const [actionError, setActionError] = useState(null); // Error specific to the form
    const [editingItem, setEditingItem] = useState(null); // Item object being edited, or null
    const [isAddingNew, setIsAddingNew] = useState(false); // True when 'Add New Item' form is open
    const [deletingId, setDeletingId] = useState(null); // Track which item is being deleted

    // 1. Initialize state from auth context
    useEffect(() => {
        if (user?.portfolio) {
            setPortfolioItems(user.portfolio);
        }
    }, [user]);

    // 2. Data Reload Function (Used after successful action)
    const reloadPortfolio = async () => {
        setLoading(true); setError(null);
          try {
             // Re-fetch user profile to get updated portfolio from API
             // A dedicated updatePortfolioContext or a fresh profile fetch is assumed here
             const response = await api.get('/users/me'); 
             setPortfolioItems(response.data.portfolio || []);
          } catch (err) {
              setError("Failed to reload portfolio items.");
              console.error(err);
          } finally {
              setLoading(false);
          }
    };

    // 3. Form Handlers
    const handleOpenAddForm = () => {
        setEditingItem(null); 
        setIsAddingNew(true); 
        setActionError(null); // Clear previous form error
        window.scrollTo(0, 0); // Scroll to top for a better user focus
    };

    const handleOpenEditForm = (item) => {
        setIsAddingNew(false); 
        setEditingItem(item); 
        setActionError(null); // Clear previous form error
        window.scrollTo(0, 0); // Scroll to top for a better user focus
    };

    const handleCancelForm = () => {
        setIsAddingNew(false);
        setEditingItem(null);
        setActionError(null);
    };

    // 4. Submission Logic (Handles both Add and Edit)
    const handleFormSubmit = async (formData) => {
        setActionLoading(true);
        setActionError(null); // Clear form error before submission
        setError(null); // Clear main error

        try {
            if (editingItem) {
                // UPDATE
                await proService.updatePortfolioItem(editingItem._id, formData);
            } else {
                // ADD NEW
                await proService.addPortfolioItem(formData);
            }
            
            // On success: close form and reload data
            handleCancelForm(); 
            await reloadPortfolio(); 
            
        } catch (err) {
            // On failure: set form error and keep form open
            const errorMessage = err.response?.data?.message || err.message || 'Failed to save item.';
            setActionError(errorMessage);
        } finally {
            setActionLoading(false);
        }
    };

    // 5. Deletion Logic
    const handleDeleteItem = async (itemId) => {
        if (!window.confirm('Are you sure you want to delete this portfolio item? This action cannot be undone.')) return;
        setDeletingId(itemId);
        setError(null);
        try {
            await proService.deletePortfolioItem(itemId);
            // Optimistic UI update
            setPortfolioItems(prev => prev.filter(item => item._id !== itemId));
        } catch (err) {
            setError(err.message || 'Failed to delete item.');
        } finally {
            setDeletingId(null);
        }
    };
    
    // Determine the current view mode
    const currentFormMode = editingItem || isAddingNew;

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
                <h1 className="text-3xl font-bold text-text-primary">Manage Portfolio</h1>
                {/* Only show 'Add New Item' button when in list view */}
                {!currentFormMode && (
                    <Button variant="primary" onClick={handleOpenAddForm}>
                        + Add New Item
                    </Button>
                )}
            </div>

            {/* General Page Error Display */}
            {error && <div className="text-red-600 mb-6 bg-red-50 p-3 rounded-lg border border-red-200">{error}</div>}


            {currentFormMode ? (
                // --- FORM VIEW (Add or Edit) ---
                <PortfolioEditForm
                    // Pass existing item data if editing, otherwise null for adding
                    initialData={editingItem} 
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancelForm}
                    loading={actionLoading}
                    actionError={actionError}
                />
            ) : (
                // --- LIST VIEW ---
                <>
                    {loading && <p className="text-center py-10 text-text-secondary">Loading portfolio...</p>}

                    {!loading && portfolioItems.length === 0 ? (
                        // Empty State (Upwork style clean box)
                        <div className="text-center text-text-secondary py-20 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                            <p className="text-xl font-semibold mb-4">Showcase Your Work</p>
                            <p className="mb-6">Adding portfolio items increases your chances of getting hired.</p>
                            <Button variant="primary" onClick={handleOpenAddForm}>
                                Add Your First Project
                            </Button>
                        </div>
                    ) : (
                        // Grid List of Items
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {portfolioItems.map(item => (
                                <PortfolioItemCard
                                    key={item._id}
                                    item={item}
                                    onEdit={handleOpenEditForm}
                                    onDelete={handleDeleteItem}
                                    deleting={deletingId === item._id}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ManagePortfolioPage;