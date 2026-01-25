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
      className={`cursor-pointer transition-all duration-300 h-36 flex flex-col justify-between border-2 ${
        isActive
          ? 'ring-2 ring-offset-2 ring-blue-500 shadow-xl bg-gradient-to-br from-blue-50 to-blue-100 border-blue-400'
          : 'border-slate-200 hover:shadow-lg hover:border-blue-300 hover:bg-gradient-to-br hover:from-slate-50 hover:to-blue-50'
      } ${isLoading ? 'opacity-75' : ''} rounded-lg`}
    >
      <div className="p-5 flex flex-col justify-between h-full">
        <div>
          <div className="flex items-start gap-3 mb-3">
            <div className="text-3xl">{icon}</div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
              <p className="text-xs text-slate-600 mt-1">{description}</p>
            </div>
          </div>
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 mt-3 bg-blue-100 px-3 py-2 rounded-lg">
            <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
            <span className="text-xs font-semibold text-blue-700">Loading...</span>
          </div>
        )}
        {!isLoading && isActive && (
          <div className="flex items-center gap-2 mt-3 bg-blue-200 px-3 py-2 rounded-lg">
            <span className="text-xs font-bold text-blue-700">✓ Active</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TrendCard;
