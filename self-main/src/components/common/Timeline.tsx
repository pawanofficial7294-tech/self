import React from 'react';
import { CheckCircle2, Circle, AlertCircle, PlayCircle } from 'lucide-react';

export interface TimelineStep {
  name: string;
  status: 'completed' | 'current' | 'pending' | 'failed';
  date?: string;
  remarks?: string;
}

interface TimelineProps {
  steps: TimelineStep[];
  layout?: 'horizontal' | 'vertical';
}

export const Timeline: React.FC<TimelineProps> = ({ steps, layout = 'horizontal' }) => {
  const getIcon = (status: TimelineStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-gov-success fill-green-50" />;
      case 'current':
        return <PlayCircle className="h-5 w-5 text-gov-navy animate-pulse fill-blue-50" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-gov-error fill-red-50" />;
      case 'pending':
      default:
        return <Circle className="h-5 w-5 text-gov-muted bg-white" />;
    }
  };

  return (
    <div>
      {/* Horizontal Layout (Desktop only: 1024px+) */}
      <div className={`hidden lg:flex items-start w-full ${layout === 'vertical' ? 'lg:hidden' : ''}`}>
        {steps.map((step, idx) => {
          const isLast = idx === steps.length - 1;
          const statusColors = {
            completed: 'text-gov-charcoal font-medium',
            current: 'text-gov-navy font-semibold scale-105',
            failed: 'text-gov-error font-medium',
            pending: 'text-gov-muted'
          };

          return (
            <React.Fragment key={idx}>
              <div className="flex flex-col items-center relative flex-1">
                {/* Node Icon */}
                <div className="z-10 bg-white p-1">
                  {getIcon(step.status)}
                </div>

                {/* Info Text */}
                <div className="mt-3 text-center px-2 select-none flex flex-col gap-0.5">
                  <span className={`text-sm ${statusColors[step.status]}`}>
                    {step.name}
                  </span>
                  {step.date && (
                    <span className="text-[10px] text-gov-muted font-medium bg-gov-bg-alt px-1.5 py-0.5 rounded-full border border-gov-border self-center">
                      {step.date}
                    </span>
                  )}
                  {step.remarks && (
                    <span className="text-[10px] text-gov-muted max-w-[120px] mx-auto italic mt-1 leading-normal">
                      "{step.remarks}"
                    </span>
                  )}
                </div>
              </div>

              {/* Connecting line */}
              {!isLast && (
                <div
                  className="flex-1 h-[2px] bg-gov-border mt-3.5 -mx-4 transition-all duration-300"
                  style={{
                    backgroundColor:
                      step.status === 'completed' && steps[idx + 1].status !== 'pending'
                        ? 'var(--color-success)'
                        : 'var(--color-border)',
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Vertical Layout (Mobile/Tablet and fallback) */}
      <div className={`flex flex-col gap-6 lg:hidden ${layout === 'vertical' ? 'lg:flex' : ''}`}>
        {steps.map((step, idx) => {
          const isLast = idx === steps.length - 1;
          const statusTextColors = {
            completed: 'text-gov-charcoal font-medium',
            current: 'text-gov-navy font-semibold scale-[1.01]',
            failed: 'text-gov-error font-medium',
            pending: 'text-gov-muted'
          };

          return (
            <div key={idx} className="flex gap-4 items-start relative">
              {/* Left timeline line */}
              {!isLast && (
                <div
                  className="absolute left-3.5 top-6 bottom-[-24px] w-0.5 bg-gov-border z-0"
                  style={{
                    backgroundColor:
                      step.status === 'completed' && steps[idx + 1].status !== 'pending'
                        ? 'var(--color-success)'
                        : 'var(--color-border)',
                  }}
                />
              )}

              {/* Node Icon */}
              <div className="z-10 bg-white py-1 flex-shrink-0">
                {getIcon(step.status)}
              </div>

              {/* Node Info Content */}
              <div className="flex-1 min-w-0 flex flex-col pt-0.5 select-none">
                <div className="flex items-center gap-2">
                  <h4 className={`text-sm ${statusTextColors[step.status]}`}>
                    {step.name}
                  </h4>
                  {step.date && (
                    <span className="text-[10px] text-gov-muted font-medium bg-gov-bg-alt px-1.5 py-0.5 rounded-full border border-gov-border">
                      {step.date}
                    </span>
                  )}
                </div>
                {step.remarks && (
                  <p className="text-xs text-gov-muted mt-1 leading-normal italic bg-gov-bg-alt/30 p-2 rounded border border-gov-border/50 max-w-lg">
                    {step.remarks}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
