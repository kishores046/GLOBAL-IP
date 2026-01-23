import React from 'react';
import { LifecycleStep } from '../../types/lifecycle';
import { Check, Clock } from 'lucide-react';

interface TrademarkLifecycleTimelineProps {
  steps: LifecycleStep[];
  currentStatus: string;
}

/**
 * Trademark Lifecycle Timeline Component
 * Shows progression through trademark registration states with dates
 */
export const TrademarkLifecycleTimeline: React.FC<TrademarkLifecycleTimelineProps> = ({
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
        <div className="relative flex justify-between w-full gap-2" style={{ zIndex: 1 }}>
          {steps.map((step, index) => (
            <div
              key={step.key}
              className="flex flex-col items-center flex-1"
            >
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
          ))}
        </div>
      </div>

      {/* Current status indicator */}
      <div className="mt-6 text-sm text-gray-700">
        <p>
          Current Status: <span className="font-semibold">{currentStatus}</span>
        </p>
      </div>
    </div>
  );
};

export default TrademarkLifecycleTimeline;
