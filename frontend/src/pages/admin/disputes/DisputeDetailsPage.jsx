import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import adminService from '../../../services/adminService';
import Button from '../../../components/common/Button';

// Placeholder - Implement full resolution UI later
const DisputeDetailsPage = () => {
    const { disputeId } = useParams();
    const [dispute, setDispute] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [resolving, setResolving] = useState(false);
    const [resolveError, setResolveError] = useState(null);
    const [resolutionText, setResolutionText] = useState('');

    useEffect(() => {
        const fetchDispute = async () => {
            setLoading(true); setError(null);
            try {
                const data = await adminService.getDisputeById(disputeId);
                setDispute(data);
            } catch (err) {
                setError(err.message || 'Failed to load dispute details.');
            } finally {
                setLoading(false);
            }
        };
        fetchDispute();
    }, [disputeId]);

    const handleResolve = async (status) => {
        if (!resolutionText.trim()) {
             setResolveError("Please provide a resolution summary."); return;
        }
        setResolving(true); setResolveError(null);
        try {
            const updatedDispute = await adminService.resolveDispute(disputeId, {
                resolution: resolutionText,
                status: status, // 'resolved' or 'closed'
            });
            setDispute(updatedDispute); // Update UI with new status
        } catch (err) {
            setResolveError(err.message || "Failed to resolve dispute.");
        } finally {
            setResolving(false);
        }
    }


    if (loading) return <p>Loading dispute...</p>;
    if (error) return <p className="text-red-600">{error}</p>;
    if (!dispute) return <p>Dispute not found.</p>;

    const canResolve = dispute.status === 'open' || dispute.status === 'under_review';
    const formatDate = (d) => d ? new Date(d).toLocaleString() : 'N/A';


    return (
        <div>
            <Link to="/admin/disputes" className="text-sm text-primary hover:underline mb-4 inline-block">&larr; Back to Disputes</Link>
             <div className="bg-white p-6 shadow rounded-lg border border-border">
                 <h1 className="text-xl font-semibold text-text-primary mb-4">Dispute Details</h1>
                 {/* Display Dispute Info */}
                  <div className="space-y-2 text-sm mb-6 border-b border-border-light pb-4">
                      <p><span className="font-medium text-text-secondary">Booking:</span> {dispute.booking?.job?.title || dispute.booking?._id}</p>
                      <p><span className="font-medium text-text-secondary">Plaintiff:</span> {dispute.plaintiff?.name} ({dispute.plaintiff?.email})</p>
                      <p><span className="font-medium text-text-secondary">Defendant:</span> {dispute.defendant?.name} ({dispute.defendant?.email})</p>
                      <p><span className="font-medium text-text-secondary">Status:</span> <span className="capitalize font-semibold">{dispute.status}</span></p>
                      <p><span className="font-medium text-text-secondary">Raised On:</span> {formatDate(dispute.createdAt)}</p>
                      <div className="pt-2"><p className="font-medium text-text-secondary mb-1">Reason:</p><p className="whitespace-pre-wrap bg-gray-50 p-2 rounded border border-gray-200">{dispute.reason}</p></div>
                       {dispute.desiredOutcome && <div className="pt-2"><p className="font-medium text-text-secondary mb-1">Desired Outcome:</p><p className="whitespace-pre-wrap bg-gray-50 p-2 rounded border border-gray-200">{dispute.desiredOutcome}</p></div>}
                       {/* TODO: Display evidence links */}
                  </div>

                 {/* Resolution Section */}
                 {canResolve ? (
                    <div className="space-y-4">
                         <h2 className="text-lg font-semibold text-text-primary">Resolve Dispute</h2>
                         {resolveError && <p className="text-red-500 text-sm">{resolveError}</p>}
                         <div>
                             <label htmlFor="resolution" className="block text-sm font-medium text-text-secondary">Resolution Summary *</label>
                             <textarea
                                id="resolution"
                                rows={4}
                                value={resolutionText}
                                onChange={(e) => setResolutionText(e.target.value)}
                                disabled={resolving}
                                className="mt-1 block w-full input-style"
                                placeholder="Explain the decision and next steps..."
                             />
                         </div>
                         <div className="flex justify-end space-x-3">
                             {/* Optionally add 'Close' if different from 'Resolve' */}
                              <Button variant="primary" onClick={() => handleResolve('resolved')} disabled={resolving || !resolutionText.trim()}>
                                {resolving ? 'Resolving...' : 'Mark as Resolved'}
                             </Button>
                         </div>
                    </div>
                 ) : (
                    <div>
                         <h2 className="text-lg font-semibold text-text-primary">Resolution</h2>
                         <p className="text-sm"><span className="font-medium text-text-secondary">Status:</span> <span className="capitalize font-semibold">{dispute.status}</span></p>
                         <p className="text-sm"><span className="font-medium text-text-secondary">Resolved By:</span> {dispute.resolvedBy?.name || 'N/A'} on {formatDate(dispute.resolvedAt)}</p>
                         <div className="pt-2"><p className="font-medium text-text-secondary mb-1">Summary:</p><p className="whitespace-pre-wrap bg-gray-50 p-2 rounded border border-gray-200">{dispute.resolution}</p></div>
                    </div>
                 )}
            </div>
        </div>
    );
};

export default DisputeDetailsPage;