import React from 'react';
import { Check } from 'lucide-react';

const Stepper = ({ steps, currentStep }) => {
  return (
    <nav aria-label="Progress" className="  w-full px-4">
      <ol role="list" className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          const isLast = index === steps.length - 1;
          
          return (
            <li key={step.name} className="relative flex flex-col items-center flex-1">
              {/* Connector Line - positioned before circle for better layering */}
              {!isLast && (
                <div 
                  className="absolute left-1/2 top-5 h-0.5 w-full -z-10"
                  aria-hidden="true"
                >
                  <div className={`h-full transition-all duration-300 ${
                    isCompleted ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                </div>
              )}
              
              {/* Step Container */}
              <div className="relative flex flex-col items-center">
                {/* Circle Indicator */}
                <div
                  className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isActive
                      ? 'border-blue-600 bg-blue-50 shadow-lg shadow-blue-200 scale-110'
                      : isCompleted
                      ? 'border-blue-600 bg-blue-600 shadow-md'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5 text-white" strokeWidth={3} aria-hidden="true" />
                  ) : (
                    <span
                      className={`text-sm font-semibold transition-colors ${
                        isActive ? 'text-blue-600' : 'text-gray-400'
                      }`}
                    >
                      {stepNumber}
                    </span>
                  )}
                  
                  {/* Active pulse animation */}
                  {isActive && (
                    <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping" />
                  )}
                </div>
                
                {/* Label */}
                <span
                  className={`mt-3 text-center text-xs sm:text-sm font-medium max-w-48 transition-colors ${
                    isActive 
                      ? 'text-blue-600 font-semibold' 
                      : isCompleted 
                      ? 'text-gray-700' 
                      : 'text-gray-400'
                  }`}
                >
                  {step.name}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

// Demo Component
export default   Stepper 