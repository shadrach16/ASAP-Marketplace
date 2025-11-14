import React, { useState, useEffect } from 'react';
import Button from '../../common/Button';
import FileUploader from '../ProjectWorkspace/FileUploader'; // Make sure this path is correct
import complianceService from '../../../services/complianceService';
import { toast } from 'sonner';
import { FileText,Loader2 } from 'lucide-react'; // Icon for PDF preview

// Internal stepper for this section
const ComplianceStepper = ({ currentStep }) => {
  const steps = ['Document Type', 'Upload', 'Review'];
  return (
    <nav className="mb-6">
      <ol className="flex items-center justify-center space-x-4">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          return (
            <li key={step} className={`flex-1 p-2 border-b-4 ${
              isActive ? 'border-primary' : isCompleted ? 'border-primary-light' : 'border-border'
            }`}>
              <div className="flex flex-col items-center">
                <span className={`text-xs font-semibold ${
                  isActive || isCompleted ? 'text-primary-dark' : 'text-text-light'
                }`}>
                  {`STEP ${stepNumber}`}
                </span>
                <span className={`text-sm font-medium ${
                  isActive ? 'text-text-primary' : 'text-text-secondary'
                }`}>
                  {step}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};


const StepCompliance = ({ onComplete, onBack }) => {
  const [step, setStep] = useState(1);
  const [docType, setDocType] = useState('driving_licence');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // --- NEW: State for image preview URL ---
  const [previewUrl, setPreviewUrl] = useState(null);

  // --- NEW: Effect to create/revoke preview URL ---
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    // Check if it's an image
    if (file.type.startsWith('image/')) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Cleanup: Revoke object URL on unmount or file change
      return () => URL.revokeObjectURL(objectUrl);
    }
    
    // Check if it's a PDF
    if (file.type === 'application/pdf') {
        // We can't preview a PDF in an <img>, so we'll use a placeholder
        setPreviewUrl('pdf'); 
    }

  }, [file]); // Re-run whenever the file changes

  const handleNext = () => setStep((s) => s + 1);
  const handlePrev = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    if (!file || !docType) {
      setError('Please select a document type and upload a file.');
      return;
    }
    setError(null);
    setLoading(true);
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', docType);

    try {
      await complianceService.submitCompliance(formData);
      toast.success('Documents submitted for review!');
      onComplete(); // Tell the parent OnboardingForm to move to the success step
    } catch (err) {
      const errMsg = err.message || 'An error occurred during submission.';
      setError(errMsg);
      toast.error(errMsg);
    }
    setLoading(false);
  };

  const renderInternalStep = () => {
    switch (step) {
      case 1: // Document Type
        return (
          <div className="space-y-6">
            <fieldset>
              <legend className="text-lg font-semibold text-text-primary">
                Select your document type
              </legend>
              <p className="text-sm text-text-secondary">
                Please choose the document you'd like to upload.
              </p>
              <div className="mt-4 space-y-3">
                {[
                  { id: 'driving_licence', label: "Driver's License" },
                  { id: 'passport', label: 'Passport' },
                  { id: 'id_card', label: 'National ID Card' },
                ].map((item) => (
                  <label
                    key={item.id}
                    htmlFor={item.id}
                    className="flex items-center p-4 border border-border rounded-md has-[:checked]:bg-primary-light has-[:checked]:border-primary"
                  >
                    <input
                      id={item.id} name="docType" type="radio" value={item.id}
                      checked={docType === item.id}
                      onChange={(e) => setDocType(e.target.value)}
                      className="h-4 w-4 text-primary focus:ring-primary-light"
                    />
                    <span className="ml-3 block text-sm font-medium text-text-primary">
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="flex justify-between">
              <Button onClick={onBack} variant="secondary">
                Back to Skills
              </Button>
              <Button onClick={handleNext}>Next</Button>
            </div>
          </div>
        );
      case 2: // Upload
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-text-primary">
              Upload your document
            </h2>
            <FileUploader
              onFileSelect={(selectedFile) => setFile(selectedFile)}
              acceptedTypes="image/jpeg, image/png, application/pdf"
            />
            
            {/* --- UPDATED: Added Preview --- */}
            {previewUrl && previewUrl !== 'pdf' && (
              <div>
                <p className="text-sm font-medium text-text-secondary mb-2">Preview:</p>
                <img src={previewUrl} alt="Document preview" className="rounded-md border border-border max-h-60 w-auto" />
              </div>
            )}
            {previewUrl === 'pdf' && file && (
              <div className="p-3 bg-background-light border border-border rounded-md flex items-center space-x-2">
                <FileText className="w-5 h-5 text-text-secondary" />
                <span className="text-sm font-medium text-text-primary">File selected:</span>
                <span className="text-sm text-text-secondary truncate">{file.name}</span>
              </div>
            )}
            {/* --- END PREVIEW --- */}
            
            <div className="flex justify-between">
              <Button onClick={handlePrev} variant="secondary">
                Back
              </Button>
              <Button onClick={handleNext} disabled={!file}>
                Next
              </Button>
            </div>
          </div>
        );
      case 3: // Review
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-text-primary">
              Review and Submit
            </h2>
            {error && (
              <div className="text-red-600 text-sm font-medium p-3 bg-red-50 rounded-md border border-red-200">
                {error}
              </div>
            )}
            <div className="p-4 bg-background-light rounded-md border border-border space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-text-secondary">Document Type:</span>
                <span className="text-sm font-medium text-text-primary capitalize">
                  {docType.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-text-secondary">File Name:</span>
                <span className="text-sm font-medium text-text-primary truncate max-w-xs">
                  {file?.name || 'N/A'}
                </span>
              </div>

              {/* --- UPDATED: Added Preview --- */}
              {previewUrl && previewUrl !== 'pdf' && (
                <div>
                  <p className="text-sm text-text-secondary mb-2">Preview:</p>
                  <img src={previewUrl} alt="Document preview" className="rounded-md border border-border max-h-60 w-auto" />
                </div>
              )}
              {previewUrl === 'pdf' && file && (
                 <div className="p-3 bg-white border border-border rounded-md flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-text-secondary" />
                    <span className="text-sm font-medium text-text-primary">Selected File:</span>
                    <span className="text-sm text-text-secondary truncate">{file.name}</span>
                 </div>
              )}
              {/* --- END PREVIEW --- */}
            </div>
            
            <p className="text-xs text-text-secondary">
              By clicking "Submit", you agree to let ASAP and our trusted
              third-party partners process your verification documents.
            </p>
            <div className="flex justify-between">
              <Button onClick={handlePrev} variant="secondary" disabled={loading}>
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? <span className='flex space-x-4   items-center justify-center'> Submitting... <Loader2 className="h-6 w-6 animate-spin text-primary mx-2" /> </span>   : 'Submit Verification'}
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-text-primary">Identity Verification</h2>
      <p className="text-text-secondary">
        Finally, we need to verify your identity to comply with regulations
        and build a trusted marketplace.
      </p>
      <div className="pt-4">
        <ComplianceStepper currentStep={step} />
        <div className="mt-6">
          {renderInternalStep()}
        </div>
      </div>
    </div>
  );
};

export default StepCompliance;