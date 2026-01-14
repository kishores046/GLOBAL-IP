import React from 'react';
import { LifecycleStep } from '../../types/lifecycle';
import { Check, Clock, AlertCircle, ChevronRight } from 'lucide-react';

interface LifecycleTimelineProps {
  steps: LifecycleStep[];
  currentStatus: string;
}

/**
 * Horizontal lifecycle timeline component
 * Shows progression through lifecycle states with dates
 */
export const LifecycleTimeline: React.FC<LifecycleTimelineProps> = ({
  steps,
  currentStatus,
}) => {
  if (!steps || steps.length === 0) {
    return null;
  }

  return (
    <div className="w-full px-4 py-6">
      <div className="flex items-center justify-between relative">
        {/* Timeline line background */}
        <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200" style={{
          width: '100%',
          zIndex: 0,
        }} />

        {/* Steps */}
        <div className="relative flex justify-between w-full gap-0" style={{ zIndex: 1 }}>
          {steps.map((step, index) => (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center flex-1">
                {/* Step circle */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                    step.isCompleted
                      ? 'bg-green-500 text-white'
                      : step.isCurrent
                      ? 'bg-blue-500 text-white ring-4 ring-blue-200'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {step.isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : step.isCurrent ? (
                    <Clock className="w-5 h-5" />
                  ) : (
                    <span className="text-xs">{index + 1}</span>
                  )}
                </div>

                {/* Step label and date */}
                <div className="mt-3 text-center">
                  <p className="text-sm font-semibold text-gray-900">
                    {step.label}
                  </p>
                  {step.date && (
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(step.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  )}
                </div>
              </div>

              {/* Arrow between steps */}
              {index < steps.length - 1 && (
                <div className="flex items-center justify-center" style={{ width: '2rem' }}>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Current status indicator */}
      <div className="mt-6 flex items-center gap-2 text-sm text-gray-700">
        <AlertCircle className="w-4 h-4 text-blue-500" />
        <span>
          Current Status: <span className="font-semibold">{currentStatus}</span>
        </span>
      </div>
    </div>
  );
};

export default LifecycleTimeline;
