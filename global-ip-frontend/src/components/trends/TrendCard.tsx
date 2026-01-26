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
          ? 'ring-2 ring-offset-2 ring-blue-500 shadow-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-800 dark:to-blue-900 border-blue-400 dark:border-blue-800 text-slate-900 dark:text-white'
          : 'border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-blue-300 hover:bg-gradient-to-br hover:from-slate-50 hover:to-blue-50 dark:hover:from-slate-700 dark:hover:to-blue-800 text-slate-900 dark:text-white'
      } ${isLoading ? 'opacity-75' : ''} rounded-lg`}
    >
      <div className="p-5 flex flex-col justify-between h-full">
        <div>
          <div className="flex items-start gap-3 mb-3">
            <div className="text-3xl">{icon}</div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight">{title}</h3>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mt-1">{description}</p>
            </div>
          </div>
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 mt-3 bg-blue-100 dark:bg-blue-800 px-3 py-2 rounded-lg">
            <Loader2 className="h-3 w-3 animate-spin text-blue-600 dark:text-blue-300" />
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-200">Loading...</span>
          </div>
        )}
        {!isLoading && isActive && (
          <div className="flex items-center gap-2 mt-3 bg-blue-200 dark:bg-blue-700 px-3 py-2 rounded-lg">
            <span className="text-xs font-bold text-blue-700 dark:text-blue-200">✓ Active</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TrendCard;
