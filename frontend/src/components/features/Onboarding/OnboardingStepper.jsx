import React from 'react';
import { Check } from 'lucide-react';

const OnboardingStepper = ({ steps, currentStepId }) => {
  return (
    <nav aria-label="Progress" className=' bg-background-light border p-3 rounded-lg'>
      <ol role="list" className="flex items-center ">
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={`relative ${stepIdx !== steps.length - 1 ? 'flex-1' : ''}`}
          >
            {step.id < currentStepId ? (
              // --- Completed Step ---
              <div className="flex items-center">
                <span className="flex h-9 items-center">
                  <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                    <Check className="h-5 w-5 text-white" aria-hidden="true" />
                  </span>
                </span>
                <span className="ml-4 text-sm font-medium text-text-primary">
                  {step.name}
                </span>
              </div>
            ) : step.id === currentStepId ? (
              // --- Current Step ---
              <div className="flex items-center" aria-current="step">
                <span className="flex h-9 items-center">
                  <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-white">
                    <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                  </span>
                </span>
                <span className="ml-4 text-sm font-medium text-primary">
                  {step.name}
                </span>
              </div>
            ) : (
              // --- Upcoming Step ---
              <div className="flex items-center">
                <span className="flex h-9 items-center">
                  <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-border bg-white">
                    <span className="h-2.5 w-2.5 rounded-full bg-transparent" />
                  </span>
                </span>
                <span className="ml-4 text-sm font-medium text-text-secondary">
                  {step.name}
                </span>
              </div>
            )}

            {/* --- Connector --- */}
            {stepIdx !== steps.length - 1 ? (
              <div
                className={`absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 ${step.id < currentStepId ? 'bg-primary' : 'bg-border'}`}
                style={{ height: 'calc(100% - 2.25rem)' }}
                aria-hidden="true"
              />
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default OnboardingStepper;