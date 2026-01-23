/**
 * MetricCard Component
 * Displays a metric with icon, label, value, and optional trend
 */

import { TrendingUp, TrendingDown } from 'lucide-react';
import type { MetricCardProps } from '../../types/admin';

export function MetricCard({
  icon,
  label,
  value,
  trend,
  color = 'blue',
  loading = false,
}: MetricCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
    yellow: 'from-yellow-500 to-yellow-600',
    purple: 'from-purple-500 to-purple-600',
  };

  const gradientClass = colorClasses[color];

  if (loading) {
    return (
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 shadow-xl animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 bg-gradient-to-br ${gradientClass} rounded-lg shadow-md`}>
            {icon}
          </div>
          {trend !== undefined && (
            <div className="h-6 w-16 bg-slate-200 rounded"></div>
          )}
        </div>
        <div className="h-10 bg-slate-200 rounded mb-2 w-24"></div>
        <div className="h-4 bg-slate-200 rounded w-32"></div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 bg-gradient-to-br ${gradientClass} rounded-lg shadow-md`}>
          {icon}
        </div>
        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              trend >= 0
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {trend >= 0 ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="text-4xl font-bold text-blue-900 mb-2">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div className="text-slate-600">{label}</div>
    </div>
  );
}
