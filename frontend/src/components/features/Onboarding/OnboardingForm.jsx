import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import userService from '../../../services/userService';
import { toast } from 'sonner';

// Import the new step components (create these below)
import OnboardingStepper from './OnboardingStepper';
import StepWelcome from './StepWelcome';
import StepProfile from './StepProfile';
import StepSkills from './StepSkills';
import StepCompliance from './StepCompliance';
import StepSuccess from './StepSuccess';

// Define the steps
const steps = [
  { id: 1, name: 'Your Profile' },
  { id: 2, name: 'Your Skills' },
  { id: 3, name: 'Verification' },
  { id: 4, name: 'All Set' },
];

const OnboardingForm = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // We'll store all form data here
  const [formData, setFormData] = useState({
    title: user?.title || '',
    bio: user?.bio || '',
    skills: user?.skills?.map(skill => skill._id) || [], // Store skill IDs
  });

  // Handle data changes from child steps
  const handleDataChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // --- API Calls ---
  const saveProfile = async (dataToSave) => {
    setLoading(true);
    setError(null);
    try {
      // Call the API to update the profile
      const updatedUser = await userService.updateMyProfile(dataToSave);
      // Update the global AuthContext state
      updateUser(updatedUser); 
      toast.success('Profile saved!');
      return true;
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to save profile.');
      toast.error(err.message || 'Failed to save profile.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // --- Navigation ---
  const handleNext = async () => {
    let success = true;

    // 1. Validation and Save logic for the step being COMPLETED (currentStep)
    if (currentStep === 1) { // Leaving 'Your Profile' (Step 1)
      success = await saveProfile({ title: formData.title, bio: formData.bio });
    } else if (currentStep === 2) { // Leaving 'Your Skills' (Step 2)
      
      // --- MANDATORY SKILLS VALIDATION ---
      if (!formData.skills || formData.skills.length === 0) {
        setError('Please select at least one skill to continue.');
        toast.error('Please select at least one skill.');
        return; // Stop: Do not proceed to save or next step
      }
      setError(null); // Clear error on successful validation
      success = await saveProfile({ skills: formData.skills });
    }
    // Step 3 (Compliance) uses handleComplianceSuccess

    // 2. Proceed to the next step
    if (success && currentStep < steps.length) {
      setCurrentStep(s => s + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      // Clear error state when moving back
      setError(null); 
      setCurrentStep(s => s - 1);
    }
  };

  // This is passed to the final compliance step
  const handleComplianceSuccess = () => {
    setCurrentStep(4); // Move to final "All Set" step
  };

  // --- Render Logic ---
  const renderStep = () => {
    switch (currentStep) {
        
      case 1:
        return (
          <StepProfile
            formData={formData}
            onDataChange={handleDataChange}
            onNext={handleNext}
            onBack={handlePrev}
            loading={loading}
            error={error}
          />
        );
      case 2:
        return (
          <StepSkills
            initialSkills={user?.skills || []} // Pass populated skills
            onDataChange={handleDataChange}
            onNext={handleNext}
            onBack={handlePrev}
            loading={loading}
            error={error}
          />
        );
      case 3:
        // This step handles its own internal logic
        return <StepCompliance onComplete={handleComplianceSuccess} onBack={handlePrev} />;
      case 4:
        return <StepSuccess onFinish={() => navigate(`/pros/${user._id}`)} />;
      default:
        // This logic seems to assume StepWelcome is used before Step 1
        return <StepWelcome onNext={handleNext} />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Hide stepper on Welcome and Success */}
      {currentStep > 1 && currentStep < 4 && (
        // The stepper uses the steps with IDs 1, 2, 3 (Profile, Skills, Verification)
        <OnboardingStepper steps={steps.slice(0, 3)} currentStepId={currentStep} />
      )}
      <div>{renderStep()}</div>
    </div>
  );
};

export default OnboardingForm;