import React from 'react';
import Button from '../../common/Button';
import { CheckCircle } from 'lucide-react';

const StepSuccess = ({ onFinish }) => {
  return (
    <div className="space-y-6 text-center flex flex-col items-center">
      <CheckCircle className="w-16 h-16 text-green-600" />
      <h2 className="text-3xl font-bold text-text-primary">
        You're All Set!
      </h2>
      <p className="text-lg text-text-secondary">
        Your profile is complete and your verification documents have been
        submitted for review.
      </p>
      <p className="text-text-secondary">
        We'll notify you via email once the review is complete (usually within 24 hours).
        In the meantime, you can explore your dashboard.
      </p>
      <Button onClick={onFinish} size="lg" className="w-full max-w-xs">
        Go to Profile
      </Button>
    </div>
  );
};

export default StepSuccess;