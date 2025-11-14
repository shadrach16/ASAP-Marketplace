import React, { useState, useEffect } from 'react';
import Button from '../../common/Button';
import SkillSelector from '../../common/MultiSelectSkills'; // We will create this next

const StepSkills = ({ initialSkills, onDataChange, onNext, onBack, loading, error }) => {
  // Local state to manage the skill objects { _id, name }
  const [selectedSkills, setSelectedSkills] = useState(initialSkills || []);

  // When skills change, update the parent form's list of IDs
  useEffect(() => {
    onDataChange('skills', selectedSkills.map(skill => skill._id));
  }, [selectedSkills, onDataChange]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-text-primary">What are your skills?</h2>
      <p className="text-text-secondary">
        Select the skills you offer. This is crucial for matching you with
        the right job postings.
      </p>

      {error && (
        <div className="text-red-600 text-sm font-medium p-3 bg-red-50 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {/* This component will handle searching and selecting skills */}
      <SkillSelector
        selectedSkills={selectedSkills}
        onChange={setSelectedSkills}
      />

      <div className="flex justify-between pt-4">
        <Button type="button" onClick={onBack} variant="secondary" disabled={loading}>
          Back
        </Button>
        <Button type="button" onClick={onNext} disabled={loading}>
          {loading ? 'Saving...' : 'Save & Continue'}
        </Button>
      </div>
    </div>
  );
};

export default StepSkills;