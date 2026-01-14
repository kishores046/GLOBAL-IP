import React from 'react';
import { Card } from '../ui/card';
import { Loader2 } from 'lucide-react';

interface TrendCardProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  isActive: boolean;
  isLoading: boolean;
  onClick: () => void;
}

export const TrendCard: React.FC<TrendCardProps> = ({
  id,
  title,
  icon,
  description,
  isActive,
  isLoading,
  onClick,
}) => {
  return (
    <Card
      onClick={onClick}
      className={`cursor-pointer transition-all duration-300 h-32 flex flex-col justify-between ${
        isActive
          ? 'ring-2 ring-blue-500 shadow-lg bg-blue-50'
          : 'hover:shadow-md hover:border-gray-400'
      } ${isLoading ? 'opacity-75' : ''}`}
    >
      <div className="p-6 flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="text-2xl">{icon}</div>
            <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
          </div>
          <p className="text-xs text-gray-600">{description}</p>
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 mt-3">
            <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
            <span className="text-xs text-blue-600">Loading...</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TrendCard;
