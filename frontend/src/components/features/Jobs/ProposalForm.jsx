// src/components/features/Jobs/ProposalForm.js (Fixed)

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, DollarSign, Plus, Trash2, Upload, FileText, X } from 'lucide-react';
import FormInput from '../../common/FormInput';
import Button from '../../common/Button';
import { useNavigate } from 'react-router-dom';

// A single row for a milestone
const MilestoneRow = ({ milestone, index, onChange, onRemove, currency }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start py-3 border-t border-border-light">
    <div>
      <input
        id={`milestone-desc-${index}`}
        name="description"
        type="text"
        value={milestone.description}
        onChange={(e) => onChange(index, e)}
        placeholder="Milestone description"
        required
        className="block w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent sm:text-md"
      />
    </div>
    <div>
      <input
        id={`milestone-due-${index}`}
        name="dueDate"
        type="date"
        value={milestone.dueDate}
        onChange={(e) => onChange(index, e)}
        required
        className="block w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent sm:text-md"
      />
    </div>
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm">
          {currency}
        </span>
        <input
          id={`milestone-amount-${index}`}
          name="amount"
          type="number"
          step="0.01"
          min="0"
          value={milestone.amount}
          onChange={(e) => onChange(index, e)}
          placeholder="Amount"
          required
          className="block w-full pl-16 pr-3 py-2 border border-border rounded-md shadow-sm placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent sm:text-md"
        />
      </div>
      {onRemove && (
        <Button
          type="button"
          variant="secondary"
          size="icon"
          onClick={onRemove}
          className="text-red-600 border-red-200 hover:bg-red-50"
          aria-label="Remove milestone"
        >
          <Trash2 size={16} />
        </Button>
      )}
    </div>
  </div>
);

/**
 * A full-page form for submitting a proposal, including milestones.
 * @param {object} props
 * @param {object} props.job - The job object.
 * @param {function(FormData): Promise<void>} props.onSubmit - Async submit function.
 */
const ProposalForm = ({ job, onSubmit }) => {
  const navigate = useNavigate();
  const [paymentType, setPaymentType] = useState('milestone');
  const [milestones, setMilestones] = useState([
    { description: '', dueDate: '', amount: '' }
  ]);
  const [coverLetter, setCoverLetter] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [projectBid, setProjectBid] = useState('');

  const jobCurrency = job?.currency || 'CAD';

  // Milestone Management - Fixed immutable update
  const handleMilestoneChange = (index, e) => {
    const { name, value } = e.target;
    setMilestones(prevMilestones => 
      prevMilestones.map((ms, i) => 
        i === index ? { ...ms, [name]: value } : ms
      )
    );
  };

  const addMilestone = () => {
    setMilestones(prev => [...prev, { description: '', dueDate: '', amount: '' }]);
  };

  const removeMilestone = (index) => {
    if (milestones.length <= 1) return;
    setMilestones(prev => prev.filter((_, i) => i !== index));
  };

  const totalBidAmount = milestones.reduce((sum, ms) => {
    return sum + (parseFloat(ms.amount) || 0);
  }, 0);

  // File Management
  const handleFileChange = (e) => {
    setError(null);
    const newFiles = Array.from(e.target.files);
    if (newFiles.length === 0) return;

    const totalFiles = files.length + newFiles.length;
    if (totalFiles > 5) {
      setError("You can only upload a maximum of 5 files.");
      return;
    }
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (fileToRemove) => {
    setFiles(prev => prev.filter(file => file !== fileToRemove));
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (!coverLetter.trim()) {
      setError("A cover letter is required.");
      setLoading(false);
      return;
    } // Validation

    if (!estimatedDuration.trim()) {
      setError("An estimated Duration is required.");
      setLoading(false);
      return;
    }

    let finalBidAmount = 0;
    let finalMilestones = [];

    if (paymentType === 'milestone') {
      if (milestones.some(ms => !ms.description.trim() || !ms.dueDate || !ms.amount || parseFloat(ms.amount) <= 0)) {
        setError("Please fill out all fields for each milestone with a valid amount.");
        setLoading(false);
        return;
      }
      finalBidAmount = totalBidAmount;
      finalMilestones = milestones;
    } else {
      const bid = parseFloat(projectBid);
      if (isNaN(bid) || bid <= 0) {
        setError("Please enter a valid total project bid.");
        setLoading(false);
        return;
      }
      finalBidAmount = bid;
      finalMilestones = [{
        description: 'Project Completion',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        amount: finalBidAmount
      }];
    }

    // Create FormData
    const proposalFormData = new FormData();
    proposalFormData.append('jobId', job._id);
    proposalFormData.append('coverLetter', coverLetter.trim());
    proposalFormData.append('estimatedDuration', estimatedDuration.trim());
    proposalFormData.append('bidAmount', finalBidAmount);
    proposalFormData.append('currency', jobCurrency);
    proposalFormData.append('milestones', JSON.stringify(finalMilestones));

    files.forEach(file => {
      proposalFormData.append('attachments', file);
    });

    try {
      await onSubmit(proposalFormData);
    } catch (err) {
      setError(err.message || 'Failed to submit proposal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="divide-y divide-border-light">
      
      {/* Terms Section */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-text-primary mb-4">Terms</h3>
        <p className="text-sm text-text-secondary mb-2">How do you want to be paid?</p>
        <div className="space-y-3">
          {/* Milestone Option */}
          <label className="flex items-center p-4 border border-border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="paymentType"
              value="milestone"
              checked={paymentType === 'milestone'}
              onChange={() => setPaymentType('milestone')}
              className="h-4 w-4 text-primary focus:ring-primary"
            />
            <span className="ml-3">
              <span className="block text-sm font-semibold text-text-primary">By milestone</span>
              <span className="block text-sm text-text-secondary">Divide the project into smaller segments.</span>
            </span>
          </label>

          {/* By Project Option */}
          <label className="flex items-center p-4 border border-border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="paymentType"
              value="project"
              checked={paymentType === 'project'}
              onChange={() => setPaymentType('project')}
              className="h-4 w-4 text-primary focus:ring-primary"
            />
            <span className="ml-3">
              <span className="block text-sm font-semibold text-text-primary">By project</span>
              <span className="block text-sm text-text-secondary">Get your entire payment at the end.</span>
            </span>
          </label>
        </div>

        {/* Project Bid Input */}
        {paymentType === 'project' && (
          <div className="pl-10 pt-4">
            <label htmlFor="projectBid" className="block text-sm font-medium text-text-secondary mb-2">
              Total Project Bid ({jobCurrency})
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm">
                {jobCurrency}
              </span>
              <input
                id="projectBid"
                name="projectBid"
                type="number"
                step="0.01"
                min="0"
                value={projectBid}
                onChange={(e) => setProjectBid(e.target.value)}
                placeholder="e.g., 500"
                required
                disabled={loading}
                className="block w-full pl-16 pr-3 py-2 border border-border rounded-md shadow-sm placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent sm:text-md disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-text-secondary mt-2">
              You will be paid the full amount upon project completion.
            </p>
          </div>
        )}

        {/* Milestone Section */}
        {paymentType === 'milestone' && (
          <div className="mt-6">
            <h4 className="text-md font-semibold text-text-primary mb-2">
              Define the project milestones:
            </h4>
            <div className="space-y-2">
              {milestones.map((ms, index) => (
                <MilestoneRow
                  key={index}
                  milestone={ms}
                  index={index}
                  onChange={handleMilestoneChange}
                  onRemove={milestones.length > 1 ? () => removeMilestone(index) : null}
                  currency={jobCurrency}
                />
              ))}
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addMilestone}
              className="mt-4 flex justify-center items-center"
              disabled={loading}
            >
              <Plus size={16} className="mr-2" /> Add Milestone
            </Button>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg flex justify-between items-center">
              <span className="text-md font-semibold text-text-primary">Total Price of Project</span>
              <span className="text-xl font-bold text-text-primary">
                {jobCurrency} ${totalBidAmount.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-2">
              This is the total amount the client will see.
            </p>
          </div>
        )}
      </div>

      {/* Additional Details Section */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-text-primary mb-4">Additional Details</h3>
        <div>
          <label htmlFor="estimatedDuration" className="block text-sm font-medium text-text-secondary mb-2">
            How long will this project take? *
          </label>
          <textarea
            id="estimatedDuration"
            name="estimatedDuration"
            rows={10}
            value={estimatedDuration}
            onChange={(e) => setEstimatedDuration(e.target.value)}
            placeholder="eg. 2 - 3 months"
            required
            disabled={loading}
            className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label htmlFor="coverLetter" className="block text-sm font-medium text-text-secondary my-2">
            Cover Letter *
          </label>
          <textarea
            id="coverLetter"
            name="coverLetter"
            rows={10}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Introduce yourself and explain why you're a great fit for this project..."
            required
            disabled={loading}
            className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Attachments (Optional)
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-md hover:border-primary transition-colors">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-text-light" />
              <div className="flex text-sm text-text-secondary">
                <label htmlFor="proposal-attachments" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                  <span>Upload files</span>
                  <input 
                    id="proposal-attachments" 
                    name="attachments" 
                    type="file" 
                    multiple 
                    onChange={handleFileChange} 
                    className="sr-only"
                    disabled={loading}
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-text-light">Up to 5 files. Max 10MB each.</p>
            </div>
          </div>
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 border border-border rounded-md">
                  <div className="flex items-center space-x-2 truncate flex-1 min-w-0">
                    <FileText className="w-5 h-5 text-text-secondary flex-shrink-0" />
                    <span className="text-sm text-text-primary truncate">{file.name}</span>
                    <span className="text-xs text-text-light flex-shrink-0">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveFile(file)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0 ml-2"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Submission Footer */}
      <div className="p-6 bg-gray-50">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        <div className="flex flex-col sm:flex-row justify-end items-center gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(`/jobs/${job._id}`)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              'Submit Proposal'
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ProposalForm;