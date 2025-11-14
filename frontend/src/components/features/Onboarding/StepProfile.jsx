import React from 'react';
import Button from '../../common/Button';
import FormInput from '../../common/FormInput';
import FormTextArea from '../../common/FormTextArea'; // Assuming you have or will create this

const StepProfile = ({ formData, onDataChange, onNext, onBack, loading, error }) => {
  return (
    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onNext(); }}>
      <h2 className="text-2xl font-bold text-text-primary">Tell us about yourself</h2>
      <p className="text-text-secondary">
        This is what clients will see first. Make a great first impression.
      </p>

      {error && (
        <div className="text-red-600 text-sm font-medium p-3 bg-red-50 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <FormInput
        id="title"
        label="Your Professional Title"
        placeholder="E.g., Licensed Plumber, Painter"
        value={formData.title}
        onChange={(e) => onDataChange('title', e.target.value)}
        required
      />

      {/* You will need to create this FormTextArea component */}
      <FormTextArea
        id="bio"
        label="Your Bio"
        placeholder="Introduce yourself, your experience, and what makes you a great pro."
        value={formData.bio}
        onChange={(e) => onDataChange('bio', e.target.value)}
        rows={6}
        maxLength={2000}
        required
      />

      <div className="flex justify-between">
        <Button type="button" onClick={onBack} variant="secondary" disabled={loading}>
          Back
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save & Continue'}
        </Button>
      </div>
    </form>
  );
};

export default StepProfile;