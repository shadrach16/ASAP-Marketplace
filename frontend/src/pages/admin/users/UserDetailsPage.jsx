import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import adminService from '../../../services/adminService';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal'; // Import Modal
import FormInput from '../../../components/common/FormInput'; // For reason input

// Component for Override Modal Form
const OverrideComplianceForm = ({ userId, currentStatus, onOverride, onCancel, loading }) => {
    const [newStatus, setNewStatus] = useState('');
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!newStatus) { setError("Please select a new status."); return; }
        if (!reason.trim()) { setError("Please provide a reason for the override."); return; }
        onOverride(userId, { newStatus, reason });
    };

    return (
         <form onSubmit={handleSubmit} className="space-y-4 p-1">
             <h2 className="text-lg font-semibold text-text-primary">Override Compliance Status</h2>
              <p className="text-sm text-text-secondary">Current status: <span className="font-medium capitalize">{currentStatus || 'Pending'}</span></p>
             {error && <p className="text-xs text-red-500">{error}</p>}
             <div>
                <label htmlFor="newStatus" className="block text-sm font-medium text-text-secondary">New Status *</label>
                <select id="newStatus" value={newStatus} onChange={(e) => setNewStatus(e.target.value)} required disabled={loading} className="mt-1 block w-full input-style">
                    <option value="" disabled>Select status...</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="pending">Pending</option>
                     <option value="expired">Expired</option>
                </select>
             </div>
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-text-secondary">Reason for Override *</label>
                <textarea id="reason" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} required disabled={loading} className="mt-1 block w-full input-style" />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                 <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>Cancel</Button>
                 <Button type="submit" variant="primary" disabled={loading || !newStatus || !reason.trim()}>
                    {loading ? 'Overriding...' : 'Confirm Override'}
                 </Button>
              </div>
         </form>
    );
};


const UserDetailsPage = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null); // Includes populated complianceRequest
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showOverrideModal, setShowOverrideModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false); // For ban/override actions
    const [actionError, setActionError] = useState(null);

    const loadUser = async () => {
        setError(null); // Clear previous errors
        try {
            const data = await adminService.getUserById(userId);
            setUser(data);
        } catch (err) {
            setError(err.message || 'Failed to load user details.');
            setUser(null); // Clear user data on error
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        setLoading(true); // Set loading true when ID changes
        loadUser();
    }, [userId]); // Rerun effect if userId changes


    const handleBanUser = async () => { /* ... (same ban logic) ... */ };

    const handleOverride = async (id, data) => {
        setActionLoading(true); setActionError(null);
        try {
            await adminService.overrideComplianceStatus(id, data);
            setShowOverrideModal(false);
            await loadUser(); // Refresh user data to show new status
        } catch (err) {
             setActionError(err.message || "Failed to override status.");
             // Keep modal open to show error
        } finally {
             setActionLoading(false);
        }
    };

    if (loading) return <p>Loading user details...</p>;
    // Show error prominently if user load failed
    if (error && !user) return <p className="text-red-600">{error}</p>;
    if (!user) return <p>User not found.</p>;

    const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleString() : 'N/A';
    const complianceStatus = user.complianceRequest?.status || 'Not Submitted';
    const canOverride = user.role === 'pro'; // Only allow override for pros

    return (
        <div>
            <Link to="/admin/users" className="text-sm text-primary hover:underline mb-4 inline-block">&larr; Back to Users</Link>
             {actionError && <p className="text-red-500 mb-4 bg-red-50 p-2 border border-red-200 rounded">{actionError}</p>}
            <div className="bg-white p-6 shadow rounded-lg border border-border">
                {/* User Header Info */}
                <div className="md:flex md:justify-between md:items-start mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-text-primary">{user.name}</h1>
                        <p className="text-text-secondary text-sm">{user.email} - <span className="capitalize font-medium">{user.role}</span></p>
                        <p className="text-xs text-text-light mt-1">User ID: {user._id}</p>
                    </div>
                     {user.role !== 'admin' && ( <Button /* ... ban button ... */ /> )}
                </div>

                {/* User Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm border-t border-border-light pt-4">
                     <div><span className="font-medium text-text-secondary">Joined:</span> {formatDate(user.createdAt)}</div>
                     <div><span className="font-medium text-text-secondary">Last Updated:</span> {formatDate(user.updatedAt)}</div>

                     {/* Pro Specific Info */}
                     {user.role === 'pro' && (
                        <>
                             <div><span className="font-medium text-text-secondary">Stripe Account:</span> {user.stripeAccountId || 'Not Connected'}</div>
                             <div><span className="font-medium text-text-secondary">Stripe Onboarding:</span> {user.stripeOnboardingComplete ? 'Complete' : 'Incomplete'}</div>
                             <div><span className="font-medium text-text-secondary">Credits:</span> {user.credits ?? 0}</div>
                             {/* Compliance Status */}
                             <div className="md:col-span-2 flex items-center gap-x-4 pt-2 mt-2 border-t border-border-light">
                                <span className="font-medium text-text-secondary">Compliance Status:</span>
                                <span className={`capitalize font-semibold px-2 py-0.5 rounded-full text-xs ${
                                     complianceStatus === 'approved' ? 'bg-green-100 text-green-800' :
                                     complianceStatus === 'rejected' || complianceStatus === 'expired' ? 'bg-red-100 text-red-800' :
                                     complianceStatus === 'in_review' ? 'bg-blue-100 text-blue-800' :
                                     'bg-gray-100 text-gray-800'
                                }`}>{complianceStatus.replace('_', ' ')}</span>
                                {canOverride && (
                                     <Button
                                        size="xs" // Add extra small size to Button component
                                        variant="secondary"
                                        onClick={() => setShowOverrideModal(true)}
                                    >
                                        Override Status
                                    </Button>
                                )}
                             </div>
                             {user.complianceRequest?.overrideAt && (
                                 <div className="md:col-span-2 text-xs text-text-light">
                                     (Status overridden on {formatDate(user.complianceRequest.overrideAt)} Reason: {user.complianceRequest.overrideReason || 'N/A'})
                                 </div>
                             )}

                             <div className="md:col-span-2 mt-2">
                                 <Link to={`/pros/${user._id}`} target="_blank" className="text-primary hover:underline text-xs">View Public Profile &rarr;</Link>
                             </div>
                        </>
                     )}
                     {/* TODO: Add Compliance verification details, recent bookings etc. */}
                </div>
            </div>

            {/* Override Modal */}
            <Modal isOpen={showOverrideModal} onClose={() => setShowOverrideModal(false)}>
                 <OverrideComplianceForm
                    userId={userId}
                    currentStatus={complianceStatus}
                    onOverride={handleOverride}
                    onCancel={() => setShowOverrideModal(false)}
                    loading={actionLoading}
                 />
            </Modal>
        </div>
    );
};

export default UserDetailsPage;