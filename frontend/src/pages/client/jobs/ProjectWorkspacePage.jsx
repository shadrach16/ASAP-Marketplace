import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'sonner';

// Icon Imports (Imported once for efficiency)
import {
    Loader2,
    FileText,
    Calendar,
    DollarSign,
    AlertCircle,
    CheckCircle2,
    Clock,
    MessageSquare,
    TrendingUp,
    CreditCard,
    ChevronDown,
} from 'lucide-react';

// Layouts and Common Components
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';

// Feature Components
import MilestoneTracker from '../../../components/features/ProjectWorkspace/MilestoneTracker';
import FileUploader from '../../../components/features/ProjectWorkspace/FileUploader';
import ChatWindow from '../../../components/features/ProjectWorkspace/ChatWindow';
import ChangeOrderForm from '../../../components/features/ProjectWorkspace/ChangeOrderForm';
import TimeTracker from '../../../components/features/ProjectWorkspace/TimeTracker';
import SubmitReviewForm from '../../../components/features/Reviews/SubmitReviewForm';
import DisputeForm from '../../../components/features/Disputes/DisputeForm';
import CreateInvoiceForm from '../../../components/features/Payments/CreateInvoiceForm';
import Invoice from '../../../components/features/Payments/Invoice';
import CheckoutForm from '../../../components/features/Payments/CheckoutForm';

// Services
import workspaceService from '../../../services/workspaceService';
import bookingService from '../../../services/bookingService';
import paymentService from '../../../services/paymentService';
import { useAuth } from '../../../hooks/useAuth';

// Load Stripe outside component render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// --- TABS DEFINITION ---
const TABS = [
    { key: 'milestones', label: 'Milestones', icon: Calendar },
    { key: 'files', label: 'Files & Assets', icon: FileText },
    { key: 'invoices', label: 'Invoices', icon: DollarSign },
    { key: 'changeOrders', label: 'Change Orders', icon: TrendingUp },
];


// --- Modern Status Badge Component (Preserved) ---
const StatusBadge = ({ status, hasDispute }) => {
    const getStatusConfig = () => {
        if (hasDispute) {
            return {
                color: 'bg-amber-100 text-amber-800 border-amber-300',
                icon: <AlertCircle className="w-3 h-3" />,
                label: 'Dispute Active'
            };
        }

        const configs = {
            active: { color: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: <CheckCircle2 className="w-3 h-3" />, label: 'Active' },
            completed: { color: 'bg-blue-100 text-blue-800 border-blue-300', icon: <CheckCircle2 className="w-3 h-3" />, label: 'Completed' },
            pending_funding: { color: 'bg-purple-100 text-purple-800 border-purple-300', icon: <Clock className="w-3 h-3" />, label: 'Pending Funding' },
            in_dispute: { color: 'bg-red-100 text-red-800 border-red-300', icon: <AlertCircle className="w-3 h-3" />, label: 'In Dispute' },
        };

        return configs[status] || { color: 'bg-gray-100 text-gray-800 border-gray-300', icon: <Clock className="w-3 h-3" />, label: status?.replace('_', ' ') || 'N/A' };
    };

    const config = getStatusConfig();

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
            {config.icon}
            <span className="capitalize">{config.label}</span>
        </span>
    );
};


// --- Helper Component: FileList (Preserved) ---
const FileList = ({ files }) => {
    if (!Array.isArray(files) || files.length === 0) {
        return <p className="text-sm text-gray-500 mt-4">No files uploaded yet.</p>
    }
    const sortedFiles = [...files].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    return (
        <ul className="mt-4 space-y-2 max-h-60 overflow-y-auto custom-scroll">
            {sortedFiles.map(file => (
                <li key={file._id || file.publicId || file.fileName} className="flex justify-between items-center text-sm border-b border-gray-100 pb-2 last:border-b-0 hover:bg-gray-50 p-1 -mx-1 rounded">
                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 hover:underline truncate pr-2" title={file.fileName}>
                        {file.fileName || 'Unnamed File'}
                    </a>
                    <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
                        by {file.uploader?.name || 'User'} - {file.uploadedAt ? new Date(file.uploadedAt).toLocaleDateString() : 'N/A'}
                    </span>
                </li>
            ))}
        </ul>
    );
};

// --- Helper Component: ChangeOrderList (Preserved with minor styling) ---
const ChangeOrderList = ({ changeOrders, currentUserId, bookingId, onResponse }) => {
    // ... (internal logic remains the same)
    const [respondingOrderId, setRespondingOrderId] = useState(null);
    const [responseError, setResponseError] = useState(null);

    const handleResponse = async (orderId, responseStatus) => {
        setRespondingOrderId(orderId);
        setResponseError(null);
        try {
            await bookingService.respondToChangeOrder(bookingId, orderId, { responseStatus });
            onResponse(); // Trigger parent refresh
            toast.success(`Change order ${responseStatus}.`);
        } catch (err) {
            const errorMsg = err.message || 'Failed to respond.';
            setResponseError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setRespondingOrderId(null);
        }
    };

    if (!Array.isArray(changeOrders) || changeOrders.length === 0) {
        return <p className="text-sm text-gray-500 mt-4">No change orders requested.</p>;
    }

    // Return the JSX for rendering the list
    return (
        <div className="mt-4 space-y-3">
            {responseError && <p className="text-xs text-red-600">{responseError}</p>}
            {changeOrders.map(order => (
                <div key={order._id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm transition-shadow hover:shadow-sm">
                    <p className="font-semibold text-gray-800">{order.scopeChangeDescription}</p>
                    <p className="text-xs text-gray-600 mt-1">
                        **{order.priceImpact > 0 ? `+ $${order.priceImpact.toFixed(2)}` : 'No Price Change'}** | Requested by: {order.createdBy?.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500">
                        Status: <span className={`font-semibold capitalize ${order.status === 'approved' ? 'text-emerald-600' : order.status === 'rejected' ? 'text-red-600' : 'text-amber-600'}`}>{order.status}</span>
                    </p>
                    {order.status === 'pending' && order.requestedTo.toString() === currentUserId && (
                        <div className="flex gap-2 mt-3">
                            <Button size="xs" variant="primary" onClick={() => handleResponse(order._id, 'approved')} disabled={respondingOrderId === order._id} className="bg-emerald-600 hover:bg-emerald-700">
                                {respondingOrderId === order._id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Approve'}
                            </Button>
                            <Button size="xs" variant="secondary" onClick={() => handleResponse(order._id, 'rejected')} disabled={respondingOrderId === order._id}>
                                Reject
                            </Button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

// --- Helper Component: InvoiceList (Preserved with minor styling) ---
const InvoiceList = ({ invoices, onPayClick }) => {
    if (!Array.isArray(invoices) || invoices.length === 0) {
        return <p className="text-sm text-gray-500 mt-4">No custom invoices created yet.</p>
    }
    const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString() : 'N/A';

    const getStatusClass = (status) => {
        switch (status) {
            case 'paid': return 'text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded text-xs font-bold';
            case 'overdue': return 'text-red-600 bg-red-100 px-2 py-0.5 rounded text-xs font-bold';
            case 'sent': return 'text-blue-600 bg-blue-100 px-2 py-0.5 rounded text-xs font-bold';
            default: return 'text-amber-600 bg-amber-100 px-2 py-0.5 rounded text-xs font-bold';
        }
    };

    return (
        <ul className="mt-4 space-y-3 max-h-80 overflow-y-auto custom-scroll">
            {invoices.map(inv => (
                <li key={inv._id} className="p-4 bg-white border border-gray-200 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm gap-3 hover:shadow-md transition-shadow">
                   <div className="flex-grow mb-2 sm:mb-0">
                        <p className="font-semibold text-gray-900">Invoice #{inv.invoiceNumber || inv._id?.slice(-6) || 'N/A'}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={getStatusClass(inv.status)}>{inv.status?.replace('_', ' ') || 'N/A'}</span>
                            <span className="text-xs text-gray-500">Due: {formatDate(inv.dueDate)}</span>
                        </div>
                   </div>
                   <div className="text-left sm:text-right flex-shrink-0 w-full sm:w-auto flex items-center gap-3">
                        <p className="font-bold text-lg text-gray-900">${inv.totalAmount?.toFixed(2) || '0.00'}</p>
                        <Button size="sm" variant="secondary" onClick={() => onPayClick(inv)} className="min-w-20">
                            <Eye className="w-4 h-4 mr-1" /> View
                        </Button>
                   </div>
                </li>
            ))}
        </ul>
    );
};


// --- Main Page Component ---
const ProjectWorkspacePage = () => {
    const { bookingId } = useParams();
    const location = useLocation();
    const { user } = useAuth();
    const navigate = useNavigate();

    // State variables
    const [booking, setBooking] = useState(null);
    const [changeOrders, setChangeOrders] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [activeTab, setActiveTab] = useState('milestones'); // 💡 New state for tab control

    // Modal state variables
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showDisputeModal, setShowDisputeModal] = useState(false);
    const [showChangeOrderModal, setShowChangeOrderModal] = useState(false);
    const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);
    const [showViewInvoiceModal, setShowViewInvoiceModal] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [invoicePaymentDetails, setInvoicePaymentDetails] = useState(null);
    const [isPayingInvoice, setIsPayingInvoice] = useState(false);

    // Data loading function
    const loadBookingData = useCallback(async () => {
        try {
            const [bookingData, coData, invoiceData] = await Promise.all([
                bookingService.getBookingById(bookingId),
                bookingService.getChangeOrdersForBooking(bookingId),
                bookingService.getInvoicesForBooking(bookingId)
            ]);

            if (!bookingData?._id) throw new Error("Booking data could not be loaded.");

            setBooking(bookingData);
            setChangeOrders(Array.isArray(coData) ? coData : []);
            setInvoices(Array.isArray(invoiceData) ? invoiceData : []);
            setError(null);
        } catch (err) {
            console.error("Error loading workspace data:", err);
            setError(err.message || 'Failed to load project workspace.');
        } finally {
            if (loading) setLoading(false);
        }
    }, [bookingId, loading]);

    // Effect to load data
    useEffect(() => {
        if (bookingId) {
            loadBookingData();
        } else {
            setLoading(false);
            setError("Invalid Booking ID provided.");
            navigate('/');
        }
    }, [bookingId, loadBookingData, navigate]);


    // --- Event Handlers (Preserved) ---
    const handleRefreshData = useCallback(() => { loadBookingData(); }, [loadBookingData]);

    const handleFileSelect = useCallback(async (selectedFile) => {
        if (!selectedFile || !bookingId) return;
        setUploading(true); setUploadError(null);
        const formData = new FormData(); formData.append('workspaceFile', selectedFile);
        try {
            await workspaceService.uploadWorkspaceFile(bookingId, formData);
            handleRefreshData();
            toast.success("File uploaded successfully!");
        } catch (err) {
            const errorMsg = err.message || 'File upload failed.';
            setUploadError(errorMsg);
            toast.error(errorMsg);
        }
        finally { setUploading(false); }
    }, [bookingId, handleRefreshData]);

    const handleMilestoneUpdate = useCallback(() => {
        toast.success("Milestone updated!");
        handleRefreshData();
    }, [handleRefreshData]);

    const handleReviewSubmitted = useCallback(() => {
        toast.success("Review submitted!");
        handleRefreshData();
        setShowReviewModal(false);
    }, [handleRefreshData]);

    const handleDisputeSubmitted = useCallback(() => {
        toast.warning("Dispute submitted for review.");
        handleRefreshData();
        setShowDisputeModal(false);
    }, [handleRefreshData]);

    const handleChangeOrderSubmitted = useCallback(() => {
        toast.success("Change order submitted.");
        handleRefreshData();
        setShowChangeOrderModal(false);
    }, [handleRefreshData]);

    const handleChangeOrderResponded = useCallback(() => {
        handleRefreshData();
    }, [handleRefreshData]);

    const handleInvoiceCreated = useCallback(() => {
        toast.success("Invoice created successfully.");
        handleRefreshData();
        setShowCreateInvoiceModal(false);
    }, [handleRefreshData]);

    // --- Invoice Payment Logic (Preserved) ---
    const handlePayInvoiceClick = async (invoice) => {
        setSelectedInvoice(invoice);
        setShowViewInvoiceModal(true);
        setInvoicePaymentDetails(null);
        setIsPayingInvoice(true);
        setError(null);
        try {
            const paymentData = await paymentService.initiateInvoicePayment(invoice._id);
            setInvoicePaymentDetails({
                clientSecret: paymentData.clientSecret,
                amount: invoice.totalAmount,
                currency: invoice.currency,
            });
        } catch (err) {
            console.error("Initiate Invoice Payment Error:", err);
            setError(`Failed to prepare invoice payment: ${err.message}. Please close and try again.`);
            toast.error(`Failed to load payment form: ${err.message}`);
        } finally {
            setIsPayingInvoice(false);
        }
    };

    const handleInvoicePaymentSuccess = async (paymentIntent) => {
        console.log("Invoice Payment Succeeded:", paymentIntent);
        toast.success("Invoice paid successfully!");
        closeViewInvoiceModal();
        await handleRefreshData();
    }

    const handleInvoicePaymentError = (errorMessage) => {
        console.error("Invoice Payment Error in Form:", errorMessage);
        setError(`Payment failed: ${errorMessage}`);
        toast.error(`Payment failed: ${errorMessage}`);
    }

    const closeViewInvoiceModal = () => {
        setShowViewInvoiceModal(false);
        setSelectedInvoice(null);
        setInvoicePaymentDetails(null);
        setError(null);
    };


    // --- Derived State (Preserved) ---
    const otherParty = user && booking ? (user._id === booking.client?._id ? booking.pro : booking.client) : null;
    const isClient = user && booking && user._id === booking.client?._id;
    const isPro = user && booking && user._id === booking.pro?._id;
    const canReview = isClient && booking?.status === 'completed' && !booking?.currentUserHasReviewed;
    const canDispute = user && booking && !['resolved', 'closed', 'completed', 'cancelled'].includes(booking?.status) && !booking?.hasOpenDispute;
    const canRequestChangeOrder = user && booking && ['active', 'pending_funding'].includes(booking?.status) && !changeOrders.some(co => co.status === 'pending');
    const canCreateInvoice = isPro && booking && ['active', 'in_dispute', 'completed'].includes(booking?.status);
    const isTimeTrackingEnabled = booking && ['active', 'in_dispute'].includes(booking?.status);


    // --- Render Logic ---
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <p className="text-center py-10 text-gray-500 animate-pulse ml-3">Loading workspace...</p>
            </div>
        );
    }

    // ... Error and Access checks remain the same
    if (error && !booking) {
        return <p className="text-center py-10 text-red-600">Error loading workspace: {error}</p>;
    }
    if (!booking) {
        return <p className="text-center py-10 text-gray-500">Project workspace not found or access denied.</p>;
    }
    const isUserParticipant = user && (user._id === booking.client?._id || user._id === booking.pro?._id);
    if (!isUserParticipant) {
        return <p className="text-center text-red-600 py-10">Access Denied.</p>;
    }

    const pageTitle = `${booking.job?.title || 'Project Workspace'} | ASAP Marketplace`;


    // --- Main Component JSX ---
    return (
        <>
            <Helmet><title>{pageTitle}</title></Helmet>
            <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8  ">
                {/* 1. Header Section (Job Title, Status, Main Actions) */}
                <div className="bg-white rounded-xl   border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-2 break-words leading-tight">
                                {booking.job?.title || 'Project Workspace'}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3">
                                <StatusBadge status={booking.status} hasDispute={booking.hasOpenDispute} />
                                <span className="text-sm font-medium text-gray-600">
                                    Working with <Link to={`/pros/${otherParty?._id}`} className="text-blue-600 hover:underline">{otherParty?.name || 'User'}</Link>
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 flex-shrink-0">
                            {canReview && (
                                <Button variant="primary" onClick={() => setShowReviewModal(true)} className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Review
                                </Button>
                            )}
                            {canCreateInvoice && (
                                <Button variant="secondary" onClick={() => setShowCreateInvoiceModal(true)} className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4" />
                                    Invoice
                                </Button>
                            )}
                            {canRequestChangeOrder && (
                                <Button variant="secondary" onClick={() => setShowChangeOrderModal(true)} className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" />
                                    Change Order
                                </Button>
                            )}
                            {canDispute && (
                                <Button
                                    variant="secondary"
                                    onClick={() => setShowDisputeModal(true)}
                                    className="border-amber-400 text-amber-800 hover:bg-amber-50 flex items-center gap-2"
                                >
                                    <AlertCircle className="w-4 h-4" />
                                    Dispute
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* 2. Main Content Grid (Tabbed Content + Sticky Chat/Info Sidebar) */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                    {/* --- Left Column: Tabbed Workspace Content (3/4 width) --- */}
                    <div className="lg:col-span-3  ">

                        {/* Tab Navigation */}
                        <div className="flex border-b border-gray-200 bg-white rounded-t-xl overflow-x-auto
                         whitespace-nowrap lg:overflow-x-hidden lg:flex-nowrap shadow-sm">
                            {TABS.map(tab => {
                                const isActive = activeTab === tab.key;
                                return (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`flex-shrink-0 flex items-center justify-center px-6 py-3 text-sm font-semibold transition-colors border-b-2 ${
                                            isActive
                                                ? 'text-blue-600 border-blue-600 bg-gray-50'
                                                : 'text-gray-500 border-transparent hover:bg-gray-100 hover:text-gray-700'
                                        }`}
                                    >
                                        <tab.icon className="h-4 w-4 mr-2" />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                        
                        {/* Tab Content Panel */}
                        <div className="bg-white p-6   rounded-b-xl border border-gray-200 min-h-[500px]">
                            {/* Time Tracker sits outside the tabs if enabled, as per Upwork style */}
                            {isTimeTrackingEnabled && activeTab !== 'milestones' && <TimeTracker bookingId={bookingId} />}

                            {activeTab === 'milestones' && (
                                <div className='space-y-4' >
                                    <TimeTracker bookingId={bookingId} className="mb-6"/>

                                    <MilestoneTracker
                                        milestones={booking.milestones || []}
                                        bookingId={booking._id}
                                        onMilestoneUpdate={handleMilestoneUpdate}
                                        isClient={isClient}
                                    />
                                </div>
                            )}
                            
                            {activeTab === 'invoices' && (
                                <>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Custom Invoices</h3>
                                    <InvoiceList invoices={invoices} onPayClick={handlePayInvoiceClick} />
                                </>
                            )}
                            
                            {activeTab === 'changeOrders' && (
                                <>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Change Orders</h3>
                                    <ChangeOrderList changeOrders={changeOrders} currentUserId={user?._id} bookingId={bookingId} onResponse={handleChangeOrderResponded} />
                                </>
                            )}
                            
                            {activeTab === 'files' && (
                                <>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Project Files</h3>
                                    <div className="space-y-4 p-4 border border-gray-200 rounded-lg mb-6">
                                        <h4 className="text-lg font-semibold text-gray-800">Upload New File</h4>
                                        {uploadError && (<p className="text-xs text-red-600 mb-2">{uploadError}</p>)}
                                        <FileUploader onFileSelect={handleFileSelect} acceptedTypes="image/*, application/pdf, .doc, .docx, .zip, .txt, .csv" disabled={uploading}/>
                                        {uploading && <p className="text-sm text-gray-500 mt-2 animate-pulse">Uploading...</p>}
                                    </div>
                                    <h4 className="text-lg font-semibold text-gray-800">Uploaded Files</h4>
                                    <FileList files={booking.files || []} />
                                </>
                            )}
                        </div>
                    </div>

                    {/* --- Right Column: Sticky Chat Sidebar (1/4 width) --- */}
                    <div className="lg:col-span-1">
                        <div className="bg-white   rounded-xl border border-gray-200 h-[calc(100vh-150px)] flex flex-col sticky top-6 custom-scroll overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
                                <h3 className="text-lg font-bold text-gray-900">Project Chat</h3>
                                <MessageSquare className="w-5 h-5 text-blue-600" />
                            </div>
                            {bookingId ? <ChatWindow bookingId={bookingId} /> : <p className="p-4 text-gray-500">Chat unavailable.</p>}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Modals (Preserved) --- */}
            <Modal isOpen={showReviewModal} onClose={() => setShowReviewModal(false)}>
                {otherParty && (<SubmitReviewForm bookingId={bookingId} revieweeName={otherParty.name} onClose={() => setShowReviewModal(false)} onReviewSubmitted={handleReviewSubmitted} />)}
            </Modal>
            <Modal isOpen={showDisputeModal} onClose={() => setShowDisputeModal(false)}>
                {otherParty && (<DisputeForm bookingId={bookingId} otherPartyName={otherParty.name} onClose={() => setShowDisputeModal(false)} onDisputeSubmitted={handleDisputeSubmitted} />)}
            </Modal>
            <Modal isOpen={showChangeOrderModal} onClose={() => setShowChangeOrderModal(false)}>
                <ChangeOrderForm bookingId={bookingId} onClose={() => setShowChangeOrderModal(false)} onChangeOrderSubmitted={handleChangeOrderSubmitted} />
            </Modal>
            <Modal isOpen={showCreateInvoiceModal} onClose={() => setShowCreateInvoiceModal(false)}>
                {booking && (<CreateInvoiceForm bookingId={bookingId} clientName={booking.client?.name} defaultCurrency={booking.currency} onClose={() => setShowCreateInvoiceModal(false)} onInvoiceCreated={handleInvoiceCreated} />)}
            </Modal>
            <Modal isOpen={showViewInvoiceModal} onClose={closeViewInvoiceModal} className="!max-w-4xl">
                <div className="p-0 sm:p-2">
                    {selectedInvoice && <Invoice invoice={selectedInvoice} />}
                    {/* Invoice Payment Section */}
                    {isClient && selectedInvoice && ['sent', 'overdue'].includes(selectedInvoice.status) && (
                        <div className="mt-8 border-t border-gray-200 pt-6 px-4 sm:px-0">
                            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-blue-600"/> Payment Options</h4>
                            {invoicePaymentDetails?.clientSecret ? (
                                <Elements stripe={stripePromise} options={{ clientSecret: invoicePaymentDetails.clientSecret, appearance: { theme: 'stripe' } }}>
                                    <CheckoutForm
                                        clientSecret={invoicePaymentDetails.clientSecret}
                                        onPaymentSuccess={handleInvoicePaymentSuccess}
                                        onPaymentError={handleInvoicePaymentError}
                                        amount={invoicePaymentDetails.amount}
                                        currency={invoicePaymentDetails.currency}
                                    />
                                </Elements>
                            ) : isPayingInvoice ? (
                                <p className="text-center text-sm text-gray-500 animate-pulse p-4 bg-gray-50 rounded">Loading secure payment details...</p>
                            ) : error ? (
                                <p className="text-center text-sm text-red-600 p-4 bg-red-50 border border-red-200 rounded">{error}</p>
                            ) : null }
                        </div>
                    )}
                    {selectedInvoice && !['sent', 'overdue'].includes(selectedInvoice.status) && (
                        <p className="mt-6 text-center text-sm text-gray-600 font-medium p-3 bg-gray-100 rounded border border-gray-300">
                            This invoice is already **{selectedInvoice.status.toUpperCase()}** and cannot be paid.
                        </p>
                    )}
                </div>
            </Modal>
        </>
    );
};

export default ProjectWorkspacePage;