import React, { useState } from 'react';
import Button from '../../common/Button';
import FormInput from '../../common/FormInput';
import bookingService from '../../../services/bookingService';

const ChangeOrderForm = ({ bookingId, onClose, onChangeOrderSubmitted }) => {
  const [formData, setFormData] = useState({
    scopeChangeDescription: '',
    priceChange: '',
    scheduleChangeDays: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.scopeChangeDescription.trim()) {
      setError('Please describe the requested changes.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const changeData = {
        scopeChangeDescription: formData.scopeChangeDescription,
        priceChange: formData.priceChange ? parseFloat(formData.priceChange) : 0,
        scheduleChangeDays: formData.scheduleChangeDays ? parseInt(formData.scheduleChangeDays, 10) : 0,
      };
      await bookingService.requestChangeOrder(bookingId, changeData);
      if(onChangeOrderSubmitted) onChangeOrderSubmitted();
      onClose(); // Close modal on success
    } catch (err) {
      setError(err.message || 'Failed to request change order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-1">
      <h2 className="text-xl font-semibold text-text-primary">
        Request Change Order
      </h2>
      <p className="text-sm text-text-secondary">
        Describe the proposed changes to the project scope, budget, or schedule. The other party will need to approve this request.
      </p>
      {error && (
        <div className="text-red-600 text-sm font-medium p-3 bg-red-50 rounded-md border border-red-200">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="scopeChangeDescription" className="block text-sm font-medium text-text-secondary">
          Description of Changes <span className="text-red-500">*</span>
        </label>
        <textarea
          id="scopeChangeDescription"
          name="scopeChangeDescription"
          rows={4}
          value={formData.scopeChangeDescription}
          onChange={handleChange}
          placeholder="Clearly explain the proposed modifications to the project scope..."
          required
          disabled={loading}
          className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent sm:text-sm"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          id="priceChange"
          label="Price Adjustment (+/- Amount)"
          name="priceChange"
          type="number"
          step="0.01"
          value={formData.priceChange}
          onChange={handleChange}
          placeholder="e.g., 50 or -25"
          disabled={loading}
        />
        <FormInput
          id="scheduleChangeDays"
          label="Schedule Adjustment (+/- Days)"
          name="scheduleChangeDays"
          type="number"
          step="1"
          value={formData.scheduleChangeDays}
          onChange={handleChange}
          placeholder="e.g., 7 or -3"
          disabled={loading}
        />
      </div>
      <div className="flex justify-end space-x-3 pt-2">
        <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={loading || !formData.scopeChangeDescription.trim()}>
          {loading ? 'Submitting...' : 'Submit Request'}
        </Button>
      </div>
    </form>
  );
};

export default ChangeOrderForm;