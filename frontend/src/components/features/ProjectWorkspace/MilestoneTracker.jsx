import React, { useState } from 'react';
import Button from '../../common/Button';
import paymentService from '../../../services/paymentService'; // Ensure createMilestonePaymentIntent is exported
import Modal from '../../common/Modal'; // Assuming Modal component exists
import CheckoutForm from '../Payments/CheckoutForm'; // Reusable checkout form
import { Elements } from '@stripe/react-stripe-js'; // Stripe Elements provider
import { loadStripe } from '@stripe/stripe-js'; // Stripe.js loader

// Load Stripe outside component render - ensure VITE_STRIPE_PUBLISHABLE_KEY is in .env.local
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const MilestoneTracker = ({ milestones, bookingId, onMilestoneUpdate, isClient }) => {
  // State for loading specific actions (release, fund initiation)
  const [loadingMilestoneId, setLoadingMilestoneId] = useState(null);
  // General error for the component (e.g., failed to initiate payment)
  const [error, setError] = useState(null);
  // State to control payment modal visibility
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  // State to hold details needed for the payment modal (clientSecret, amount, etc.)
  const [paymentDetails, setPaymentDetails] = useState(null);

  // --- Handler to Release Funds ---
  const handleRelease = async (milestoneId) => {
    setLoadingMilestoneId(milestoneId);
    setError(null);
    try {
      await paymentService.releaseMilestone(milestoneId);
      if (onMilestoneUpdate) onMilestoneUpdate(); // Notify parent to refresh data
    } catch (err) {
      console.error("Release Milestone Error:", err);
      setError(err.message || 'Failed to release milestone.');
    } finally {
      setLoadingMilestoneId(null);
    }
  };

  // --- Handler to Initiate Funding Process ---
  const handleInitiateFund = async (milestone) => {
    setLoadingMilestoneId(milestone._id);
    setError(null);
    setPaymentDetails(null); // Clear previous details
    try {
        // Call backend API to get/create payment intent for this milestone
        const intentData = await paymentService.createMilestonePaymentIntent(milestone._id);

        if (!intentData || !intentData.clientSecret) {
            throw new Error("Could not retrieve payment details. Please try again.");
        }

        // Store details needed by the CheckoutForm and Elements provider
        setPaymentDetails({
             clientSecret: intentData.clientSecret,
             amount: milestone.amount,
             currency: milestone.currency,
             milestoneId: milestone._id, // Keep track of which milestone is being paid
        });
        setShowPaymentModal(true); // Open the payment modal
    } catch (err) {
      console.error("Initiate Funding Error:", err);
      setError(err.message || 'Failed to prepare payment.');
    } finally {
        setLoadingMilestoneId(null); // Stop button loading indicator
    }
  };

  // --- Callback for Successful Payment ---
  const handlePaymentSuccess = (paymentIntent) => {
      console.log("Milestone Payment Succeeded via CheckoutForm:", paymentIntent);
      setShowPaymentModal(false); // Close modal
      setPaymentDetails(null);    // Clear payment details
      setError(null);             // Clear any previous errors
      if (onMilestoneUpdate) onMilestoneUpdate(); // Refresh milestone list
      // Optionally show a success message/toast
  }

  // --- Callback for Payment Error in Form ---
   const handlePaymentError = (errorMessage) => {
      console.error("Milestone Payment Error via CheckoutForm:", errorMessage);
      // Error is displayed within CheckoutForm, maybe set component error too?
      setError(`Payment failed: ${errorMessage}`);
      // Keep modal open for user to retry or view error
   }

   // --- Close Modal Handler ---
   const handleClosePaymentModal = () => {
       setShowPaymentModal(false);
       setPaymentDetails(null);
       setError(null); // Clear errors when modal is closed manually
   };

  // --- Render Logic ---
  if (!milestones || milestones.length === 0) {
    return <p className="text-text-secondary text-sm">No milestones defined for this project yet.</p>;
  }

  const formatDate = (d) => d ? new Date(d).toLocaleDateString() : 'N/A';

  return (
    <div>
       <h3 className="text-lg font-semibold text-text-primary mb-4">Project Milestones</h3>
        {/* Display general component error */}
        {error && !showPaymentModal && ( // Don't show if modal is open and showing its own error
            <div className="mb-4 text-red-600 text-sm font-medium p-3 bg-red-50 rounded-md border border-red-200">
            {error}
            </div>
        )}
      {/* List of Milestones */}
      <div className="space-y-4">
        {milestones.map((milestone, index) => (
            <div key={milestone._id || index} className="p-4 bg-white border border-border rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            {/* Milestone Details */}
            <div className="flex-grow">
                <p className="font-semibold text-text-primary">{milestone.description}</p>
                <p className="text-sm text-text-secondary">
                    Amount: ${milestone.amount?.toFixed(2) || '0.00'} {milestone.currency}
                    {milestone.dueDate && ` | Due: ${formatDate(milestone.dueDate)}`}
                </p>
                {/* Status Badge */}
                <p className="text-xs font-medium uppercase tracking-wide mt-1">
                    Status: <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                        milestone.status === 'funded' ? 'bg-blue-100 text-blue-800' :
                        milestone.status === 'released' ? 'bg-green-100 text-green-800' :
                        milestone.status === 'approved' ? 'bg-purple-100 text-purple-800' :
                        milestone.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800' // Default/Cancelled
                    }`}>{milestone.status?.replace('_', ' ') || 'N/A'}</span>
                </p>
                 {/* Timestamps */}
                 <div className="text-xs text-text-light mt-1 space-x-2">
                    {milestone.fundedAt && <span>Funded: {formatDate(milestone.fundedAt)}</span>}
                    {milestone.releasedAt && <span>Released: {formatDate(milestone.releasedAt)}</span>}
                 </div>
            </div>
            {/* Action Buttons */}
            <div className="flex-shrink-0 space-x-2 mt-2 md:mt-0 self-start md:self-center">
                {/* Fund Button (Client, Pending) */}
                {isClient && milestone.status === 'pending' && (
                    <Button
                        variant="primary"
                        onClick={() => handleInitiateFund(milestone)}
                        disabled={loadingMilestoneId === milestone._id}
                        size="sm"
                    >
                        {loadingMilestoneId === milestone._id ? 'Preparing...' : 'Fund Milestone'}
                    </Button>
                )}
                {/* Release Button (Client, Funded) */}
                {isClient && milestone.status === 'funded' && (
                <Button
                    variant="primary"
                    onClick={() => handleRelease(milestone._id)}
                    disabled={loadingMilestoneId === milestone._id}
                    size="sm"
                >
                    {loadingMilestoneId === milestone._id ? 'Releasing...' : 'Release Funds'}
                </Button>
                )}
                {/* Released Indicator */}
                {milestone.status === 'released' && (
                    <span className="text-sm font-medium text-primary-dark inline-flex items-center">✓ Released</span>
                )}
                {/* Other statuses (e.g., Funded, Approved) don't need buttons here */}
            </div>
            </div>
        ))}
       </div>

        {/* Payment Modal */}
         <Modal isOpen={showPaymentModal} onClose={handleClosePaymentModal}>
             <div className="p-4 sm:p-6"> {/* Padding inside modal */}
                {paymentDetails?.clientSecret ? (
                    // Wrap CheckoutForm with Elements, passing clientSecret in options
                    <Elements stripe={stripePromise} options={{ clientSecret: paymentDetails.clientSecret, appearance: { theme: 'stripe' } }}>
                        <CheckoutForm
                            clientSecret={paymentDetails.clientSecret} // Pass again if needed internally
                            onPaymentSuccess={handlePaymentSuccess}
                            onPaymentError={handlePaymentError}
                            amount={paymentDetails.amount}
                            currency={paymentDetails.currency}
                        />
                    </Elements>
                ) : (
                    // Show loading or error if clientSecret fetch failed
                    <div className="text-center py-6">
                        {loadingMilestoneId === paymentDetails?.milestoneId ? // Check if still loading intent
                             <p className="animate-pulse text-text-secondary">Loading payment details...</p> :
                             <p className="text-red-600">{error || 'Could not load payment details.'}</p>
                        }
                    </div>
                )}
            </div>
         </Modal>

    </div>
  );
};

export default MilestoneTracker;