import React from 'react';
import { Card } from '../ui/card';
import { Loader2 } from 'lucide-react';

interface TrademarkCardViewProps {
  card: {
    id: string;
    title: string;
    icon: string;
    description: string;
  };
  isActive: boolean;
  isLoading: boolean;
  hasError: boolean;
  onClick: () => void;
}

export const TrademarkCardView: React.FC<TrademarkCardViewProps> = ({
  card,
  isActive,
  isLoading,
  hasError,
  onClick,
}) => {
  return (
    <Card
      onClick={onClick}
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
        isActive ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900 dark:ring-blue-400' : ''
      } ${hasError ? 'ring-2 ring-red-500 bg-red-50 dark:bg-red-900 dark:ring-red-400' : ''}`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <span className="text-4xl">{card.icon}</span>
          {isLoading && <Loader2 className="h-5 w-5 animate-spin text-blue-500" />}
          {hasError && <span className="text-red-500 text-lg">⚠️</span>}
        </div>

        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{card.title}</h3>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{card.description}</p>

        {isLoading && (
          <div className="mt-4 text-xs text-blue-600 font-medium">Loading...</div>
        )}
        {hasError && (
          <div className="mt-4 text-xs text-red-600 font-medium">Error loading data</div>
        )}
      </div>
    </Card>
  );
};

export default TrademarkCardView;
