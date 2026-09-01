import React from 'react';
import { Check } from 'lucide-react';

interface StepperProps {
  steps: string[];
  currentStep: number; // 0-indexed
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-full py-4">
      {/* Stepper container */}
      <div className="flex items-center w-full justify-between">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isActive = idx === currentStep;

          return (
            <React.Fragment key={idx}>
              {/* Step circle */}
              <div className="flex flex-col items-center relative flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-semibold transition-all duration-300 z-10 ${
                    isCompleted
                      ? 'bg-gov-success border-gov-success text-white'
                      : isActive
                      ? 'bg-gov-navy border-gov-navy text-white shadow-md shadow-gov-navy/20 scale-105'
                      : 'bg-white border-gov-border text-gov-muted'
                  }`}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4 stroke-[3]" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                {/* Step Title */}
                <span
                  className={`mt-2 text-xs text-center font-medium max-w-[85px] leading-tight select-none ${
                    isActive
                      ? 'text-gov-navy font-semibold'
                      : isCompleted
                      ? 'text-gov-charcoal'
                      : 'text-gov-muted'
                  }`}
                >
                  {step}
                </span>
              </div>

              {/* Connecting line between steps */}
              {idx < steps.length - 1 && (
                <div
                  className="flex-1 h-0.5 bg-gov-border -translate-y-4 transition-all duration-500"
                  style={{
                    backgroundColor: idx < currentStep ? 'var(--color-success)' : 'var(--color-border)',
                  }}
                  aria-hidden="true"
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
