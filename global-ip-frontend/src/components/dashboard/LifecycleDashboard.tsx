import React from 'react';
import { PatentLifecyclePanel } from '../../trends/patent-lifecycle/PatentLifecyclePanel';
import { TrademarkLifecyclePanel } from '../../trends/trademark-lifecycle/TrademarkLifecyclePanel';
import { Card } from '../../components/ui/card';

type LifecycleType = 'patent' | 'trademark';

interface LifecycleDashboardProps {
  type: LifecycleType;
  id: string;
}

/**
 * Lifecycle Dashboard Component
 * Conditionally renders patent or trademark lifecycle based on type prop
 */
export const LifecycleDashboard: React.FC<LifecycleDashboardProps> = ({
  type,
  id,
}) => {
  if (!id) {
    return (
      <Card className="p-6">
        <p className="text-gray-500 text-center">No ID provided</p>
      </Card>
    );
  }

  return (
    <div className="w-full">
      {type === 'patent' && (
        <PatentLifecyclePanel publicationNumber={id} />
      )}

      {type === 'trademark' && (
        <TrademarkLifecyclePanel trademarkId={id} />
      )}
    </div>
  );
};

export default LifecycleDashboard;
