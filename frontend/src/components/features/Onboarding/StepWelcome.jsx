import React from 'react';
import Button from '../../common/Button';
import { useAuth } from '../../../hooks/useAuth';

const StepWelcome = ({ onNext }) => {
  const { user } = useAuth();
  return (
    <div className="space-y-6 text-center flex flex-col items-center">
      <h2 className="text-3xl font-bold text-text-primary">
        Welcome, {user?.name}!
      </h2>
      <p className="text-lg text-text-secondary">
        Let's get your professional profile set up. This will help clients
        find you and build trust on the ASAP platform.
      </p>
      <p className="text-text-secondary text-md sm:mx-12 text-center  w-[80%]">
        We'll guide you through setting up your profile, adding your skills, and
        completing a one-time identity verification.
      </p>
      <Button  onClick={onNext} size="lg" fullWidth>
        Get Started
      </Button>
    </div>
  );
};

export default StepWelcome;