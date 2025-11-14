import React, { useState } from 'react';
import Button from '../../common/Button';
import disputeService from '../../../services/disputeService';

const DisputeForm = ({ bookingId, otherPartyName, onClose, onDisputeSubmitted }) => {
  const [reason, setReason] = useState('');
  const [desiredOutcome, setDesiredOutcome] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please provide a reason for the dispute.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      await disputeService.submitDispute({
        bookingId,
        reason,
        desiredOutcome,
      });
      if(onDisputeSubmitted) onDisputeSubmitted();
      onClose(); // Close modal on success
    } catch (err) {
      setError(err.message || 'Failed to submit dispute.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-1">
      <h2 className="text-xl font-semibold text-text-primary">
        Raise a Dispute regarding this project
      </h2>
      <p className="text-sm text-text-secondary">
        If you have an issue with {otherPartyName || 'the other party'} that you couldn't resolve directly, please explain the situation below. An admin will review the case.
      </p>
      {error && (
        <div className="text-red-600 text-sm font-medium p-3 bg-red-50 rounded-md border border-red-200">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-text-secondary">
          Reason for Dispute <span className="text-red-500">*</span>
        </label>
        <textarea
          id="reason"
          name="reason"
          rows={5}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Clearly explain the issue, referencing specific milestones or messages if possible."
          required
          disabled={loading}
          className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent sm:text-sm"
        />
      </div>
       <div>
        <label htmlFor="desiredOutcome" className="block text-sm font-medium text-text-secondary">
          Desired Outcome (Optional)
        </label>
        <textarea
          id="desiredOutcome"
          name="desiredOutcome"
          rows={3}
          value={desiredOutcome}
          onChange={(e) => setDesiredOutcome(e.target.value)}
          placeholder="e.g., Partial refund, milestone adjustment, project cancellation."
          disabled={loading}
          className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent sm:text-sm"
        />
      </div>
       {/* Consider adding a file input here later for evidence */}
      <div className="flex justify-end space-x-3 pt-2">
        <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={loading || !reason.trim()}>
          {loading ? 'Submitting...' : 'Submit Dispute'}
        </Button>
      </div>
    </form>
  );
};

export default DisputeForm;