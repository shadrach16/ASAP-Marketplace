import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, PackageSearch, Briefcase, Clock, RefreshCw, Loader2, X,AlertTriangle } from 'lucide-react';

// Common Components
import { useAuth } from '../../../hooks/useAuth';
import Button from '../../../components/common/Button';

// Feature Components
import ServiceForm from '../../../components/features/ProProfile/ServiceForm';
import ServiceAiAssistant from '../../../components/features/ProProfile/ServiceAiAssistant';

// Services
import proService from '../../../services/proService'; //



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


// --- Skeleton Loader for Service Card ---
const ServiceCardSkeleton = () => (
    <div className="bg-white p-4 border border-border rounded-lg   animate-pulse">
        <div className="flex justify-between items-center mb-3">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-6 w-12 bg-gray-200 rounded-full"></div>
        </div>
        <div className="w-full h-32 bg-gray-200 mb-3 rounded"></div>
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-1"></div>
        <div className="h-3 bg-gray-200 rounded w-full mb-3"></div>
        <div className="flex justify-end space-x-2 mt-auto pt-3 border-t border-border-light">
            <div className="h-8 w-16 bg-gray-200 rounded"></div>
            <div className="h-8 w-16 bg-gray-200 rounded"></div>
        </div>
    </div>
);

// --- Professional Switch Component (like Upwork/Fiverr) ---
const Switch = ({ checked, onChange, loading = false, disabled = false }) => {
    const isDisabled = loading || disabled;
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => !isDisabled && onChange(!checked)}
            disabled={isDisabled}
            className={`relative inline-flex items-center h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                checked ? 'bg-primary' : 'bg-gray-200'
            } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
        >
            <span className="sr-only">Toggle service status</span>
            {loading && (
                <span className="absolute inset-0 flex items-center justify-center">
                    <Loader2 size={14} className={`animate-spin ${checked ? 'text-white' : 'text-primary'}`} />
                </span>
            )}
            {!loading && (
                <span
                    aria-hidden="true"
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        checked ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
            )}
        </button>
    );
};

// --- REDESIGNED: Card for Displaying Managed Service ---
const ManagedServiceCard = ({ service, onEdit, onDelete, deletingId, onToggleActive, isTogglingId }) => {
    const isDeleting = deletingId === service._id;
    const isToggling = isTogglingId === service._id;
    const isDisabled = isDeleting || isToggling;

    return (
       <>

    <div className={`bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all overflow-hidden ${isDeleting ? 'opacity-50' : ''} ${!service.isActive ? 'bg-gray-50' : ''}`}>
     <div className="flex justify-between items-center  p-3 border-b border-border-light">
                <label
                    htmlFor={`service-active-${service._id}`}
                    className={`text-sm font-semibold ${service.isActive ? 'text-green-600' : 'text-text-secondary'}`}
                >
                    {service.isActive ? 'Active' : 'Paused'}
                </label>
                <Switch
                    id={`service-active-${service._id}`}
                    checked={service.isActive}
                    onChange={(newIsActive) => onToggleActive(service._id, newIsActive)}
                    loading={isToggling}
                    disabled={isDisabled}
                />
            </div>
      {service.imageUrl ? (
        <img src={service.imageUrl} alt={service.title} className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
          <Briefcase size={48} className="text-gray-400" />
        </div>
      )}
       <Link to={`/services/${service._id}`}>
      <div className="p-5">
        <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">{service.title}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description || 'No description provided'}</p>
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1.5">
            <Clock size={16} />
            <span>{service.deliveryTimeDays}d</span>
          </div>
          <div className="flex items-center gap-1.5">
            <RefreshCw size={16} />
            <span>{service.revisions} rev</span>
          </div>
        </div>
        {!service.isActive && (
          <span className="inline-block px-2 py-0.5 mb-3 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">Inactive</span>
        )}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <span className="text-xl font-bold text-gray-900">${service.price.toFixed(2)}</span>
            <span className="text-sm text-gray-600 ml-1">{service.currency}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(service)}
              disabled={isDeleting}
              className="p-2 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
              title="Edit service"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => onDelete(service._id)}
              disabled={isDeleting}
              className="p-2 rounded hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors"
              title="Delete service"
            >
              {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
            </button>
          </div>
        </div>
      </div>
      </Link>
    </div>
    </>
    );
};

// --- REFACTORED: Main Page Component ---
const ManageServicesPage = () => {
    // State declarations
  const { user, loading: authLoading } = useAuth();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true); // Loading service list
    const [error, setError] = useState(null); // General page/list error
    const [formMode, setFormMode] = useState('closed'); // 'closed', 'add', 'edit'
    const [editingService, setEditingService] = useState(null); // Data for edit form
    const [actionLoading, setActionLoading] = useState(false); // Loading state for form submission
    const [formError, setFormError] = useState(null); // Error state *specific* to the form
    const [deletingId, setDeletingId] = useState(null); // ID of service being deleted
    const [isTogglingId, setIsTogglingId] = useState(null); // ID of service being toggled
    const [aiSuggestion, setAiSuggestion] = useState(null); // { title: string, description: string }

    // --- Data Fetching ---
    const loadServices = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await proService.getMyServices(); // Fetches services for logged-in pro
            setServices(data || []);
        } catch (err) {
            const errMsg = err.message || "Failed to load your services.";
            setError(errMsg); // Set list error
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadServices();
    }, [loadServices]);

    // --- Form Visibility and Control ---
    const handleOpenAddForm = () => {
        setEditingService(null);
        setAiSuggestion(null); // Clear previous AI suggestions
        setFormError(null); // Clear old form errors
        setFormMode('add');
    };
    const handleOpenEditForm = (service) => {
        setEditingService(service);
        setAiSuggestion(null); // Clear AI suggestions when editing
        setFormError(null); // Clear old form errors
        setFormMode('edit');
    };
    const handleCloseForm = () => {
        setFormMode('closed');
        setEditingService(null);
        setAiSuggestion(null);
        setFormError(null); // Clear form-related errors
    };

    // --- AI Interaction ---
    const handleAiSuggestion = (suggestion) => {
        setAiSuggestion(suggestion); // Store suggestions { title, description }
        setEditingService(null); // Ensure we are in 'add' mode
        setFormMode('add'); // Open the form
        toast.info("AI suggestions ready. Fill in the rest of the form.");
    };

    // --- CRUD Operations ---
    const handleFormSubmit = async (formData) => {
        setActionLoading(true);
        setFormError(null); // Clear previous form errors
        const action = editingService ? 'update' : 'create';
        const successMsg = `Service ${action === 'update' ? 'updated' : 'created'} successfully!`;
        const errorMsg = `Failed to ${action} service. Please check details and try again.`;

        try {
            if (editingService) {
                await proService.updateService(editingService._id, formData); // Updates existing service
            } else {
                await proService.createService(formData); // Creates new service
            }
            toast.success(successMsg);
            handleCloseForm(); // Close form panel on success
            await loadServices(); // Refresh the list
        } catch (err)
 {
            const apiError = err.message || errorMsg;
            setFormError(apiError); // Set *form* error
            toast.error(apiError);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteService = async (serviceId) => {
         toast.warning('Are you sure you want to delete this service?', {
              id: 'delete-confirm', // Prevents stacking toasts
              action: {
                  label: 'Delete',
                  onClick: async () => {
                      setDeletingId(serviceId);
                      setError(null);
                      try {
                          await proService.deleteService(serviceId); // Deletes the service
                          toast.success('Service deleted successfully!');
                          setServices(prev => prev.filter(s => s._id !== serviceId)); // Update UI
                          // If deleting the item currently being edited, close the form
                          if(editingService?._id === serviceId) {
                              handleCloseForm();
                          }
                      } catch (err) {
                          const apiError = err.message || 'Failed to delete service.';
                          setError(apiError); // Set global list error
                          toast.error(apiError);
                      } finally {
                          setDeletingId(null);
                      }
                   }
              },
              cancel: { label: 'Cancel', onClick: () => {} },
              duration: 10000 // Keep confirmation toast longer
         });
    };

    // --- Handler for the Active/Paused Toggle ---
    const handleToggleActive = async (serviceId, newIsActive) => {
        setIsTogglingId(serviceId);
        
        // Optimistic UI update
        const originalServices = [...services];
        setServices(prev => 
            prev.map(s => s._id === serviceId ? { ...s, isActive: newIsActive } : s)
        );

        try {
            // Assumes updateService can handle partial updates
            await proService.updateService(serviceId, { isActive: newIsActive }); 
            toast.success(`Service ${newIsActive ? 'activated' : 'paused'}.`);
        } catch (err) {
            // Revert on error
            setServices(originalServices);
            const apiError = err.message || 'Failed to update service status.';
            toast.error(apiError);
        } finally {
            setIsTogglingId(null);
        }
    };

    // --- Render ---
    return (
        <>
            <Helmet>
                <title>Manage Services | ASAP Marketplace</title>
            </Helmet>
            <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">

                {/* Page Header (Always Visible) */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h1 className="text-3xl font-bold text-text-secondary">Manage Services</h1>
                    {formMode === 'closed' && (
                        <Button variant="primary" onClick={handleOpenAddForm} className='flex items-center justify-center'>
                            <Plus size={18} className="mr-2"/> Create New Service
                        </Button>
                    )}
                </div>

   { user?.complianceStatus !== 'approved' && (
            <div className='p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-4 mb-3  '>
                <AlertTriangle className='w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5' />
                <div>
                    <h3 className='text-md font-semibold text-yellow-800'>Compliance Check Required</h3>
                    <p className='text-sm text-yellow-700 mt-1'>
                        Your account compliance status is currently <strong>{user?.complianceStatus?.replace('_', ' ')}</strong>. {STATUS_CONFIG[user?.complianceStatus]?.details}
                      <br />     <Link to={user?.complianceStatus === 'in_review'? `/pros/${user._id}`:"/pro/onboarding"} 
                        className='text-yellow-800 border-yellow-600 no-underline font-medium underline ml-1 hover:text-gray-900 border p-2 w-52 mt-3 bg-secondary rounded-md block'>
                           {user?.complianceStatus === 'in_review'? "View Compliance Status":"Continue with Onboarding"}
                        </Link>
                    </p>
                </div>
            </div>
        )}

            
                {formMode === 'closed' && (
                    <div className="space-y-6">
                        {/* Global List Error */}
                        {error && (
                            <div className="text-red-600 p-3 bg-red-50 border border-red-200 rounded-md">⚠️ {error}</div>
                        )}

                        {/* Loading State */}
                        {loading && (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                <ServiceCardSkeleton />
                                <ServiceCardSkeleton />
                                <ServiceCardSkeleton />
                            </div>
                        )}

                        {/* Empty State */}
                        {!loading && services.length === 0 && (
                           <div className="text-center py-12 border border-dashed border-border rounded-lg bg-white   flex flex-col items-center justify-center space-y-5 min-h-[400px]">
                                <PackageSearch size={48} className="mx-auto text-text-light"/>
                                <h2 className="text-xl font-semibold text-text-primary">No Services Found</h2>
                                <p className="text-text-secondary max-w-md mx-auto">Click 'Create New Service' to add your offerings.</p>
                           </div>
                        )}

                        {/* Services Grid */}
                        {!loading && services.length > 0 && (
                             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {services.map(service => (
                                    <ManagedServiceCard
                                        key={service._id} service={service}
                                        onEdit={handleOpenEditForm} onDelete={handleDeleteService}
                                        onToggleActive={handleToggleActive}
                                        deletingId={deletingId}
                                        isTogglingId={isTogglingId}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* --- STATE 2: Form/AI View (When Form is OPEN) --- */}
                {formMode !== 'closed' && (
                    <div className="flex  gap-8 items-start">
                        
                        {/* Column 1: AI Assistant */}
                        <aside className=" ">
                            <ServiceAiAssistant onSuggestion={handleAiSuggestion} />
                        </aside>

                        {/* Column 2: Add/Edit Form Panel */}
                        <aside className="w-[80%] lg:top-24">
                            <div className="bg-white p-6   rounded-lg border border-border relative">
                                {/* Close Button */}
                                <button
                                    onClick={handleCloseForm}
                                    className="absolute top-4 right-4 p-2 rounded-full text-text-secondary bg-gray-100 hover:bg-gray-200 transition-colors"
                                    aria-label="Close form"
                                >
                                    <X size={20} />
                                </button>
                                {/* Service Form */}
                                <ServiceForm
                                    // Use key to force re-mount when switching
                                    key={editingService?._id || (aiSuggestion ? 'ai-add' : 'new')}
                                    initialData={editingService}
                                    aiSuggestion={formMode === 'add' ? aiSuggestion : null}
                                    onSubmit={handleFormSubmit}
                                    onCancel={handleCloseForm}
                                    loading={actionLoading}
                                    // Pass form-specific error
                                    formErrorProp={formError}
                                />
                            </div>
                        </aside>
                    </div>
                )}

            </div>
        </>
    );
};

export default ManageServicesPage;