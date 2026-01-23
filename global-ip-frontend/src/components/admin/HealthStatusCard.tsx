/**
 * HealthStatusCard Component
 * Displays API health status with metrics
 */

import { Activity } from 'lucide-react';
import type { HealthStatusCardProps } from '../../types/admin';

export function HealthStatusCard({
  service,
  status,
  uptime,
  latency,
  lastSync,
  errorRate,
  onClick,
}: HealthStatusCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HEALTHY':
        return {
          dot: 'bg-green-500',
          badge: 'bg-green-100 text-green-700',
          border: 'border-green-200/50 hover:border-green-300/50',
        };
      case 'WARNING':
        return {
          dot: 'bg-yellow-500',
          badge: 'bg-yellow-100 text-yellow-700',
          border: 'border-yellow-200/50 hover:border-yellow-300/50',
        };
      case 'ERROR':
        return {
          dot: 'bg-red-500',
          badge: 'bg-red-100 text-red-700',
          border: 'border-red-200/50 hover:border-red-300/50',
        };
      case 'UNKNOWN':
      default:
        return {
          dot: 'bg-slate-400',
          badge: 'bg-slate-100 text-slate-700',
          border: 'border-slate-200/50 hover:border-slate-300/50',
        };
    }
  };

  const getLatencyColor = (latency: number) => {
    if (latency < 200) return 'text-green-700';
    if (latency < 500) return 'text-yellow-700';
    return 'text-red-700';
  };

  const colors = getStatusColor(status);

  return (
    <div
      className={`bg-white/70 backdrop-blur-xl rounded-2xl p-6 border ${colors.border} transition-all shadow-xl ${
        onClick ? 'cursor-pointer hover:shadow-2xl' : ''
      }`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${colors.dot} animate-pulse`}></div>
          <h3 className="text-xl font-semibold text-slate-900">{service}</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors.badge}`}>
          {status.charAt(0) + status.slice(1).toLowerCase()}
        </span>
      </div>

      {/* Metrics */}
      <div className="space-y-3">
        {/* Uptime */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-slate-600 text-sm">Uptime</span>
            <span className="text-slate-900 font-medium">{uptime.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                uptime >= 99 ? 'bg-green-500' : uptime >= 95 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(uptime, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Latency */}
        <div className="flex justify-between items-center">
          <span className="text-slate-600 text-sm">Avg Latency</span>
          <span className={`font-medium ${getLatencyColor(latency)}`}>
            {latency}ms
          </span>
        </div>

        {/* Error Rate (if provided) */}
        {errorRate !== undefined && (
          <div className="flex justify-between items-center">
            <span className="text-slate-600 text-sm">Error Rate</span>
            <span className={`font-medium ${errorRate > 0.05 ? 'text-red-700' : 'text-green-700'}`}>
              {(errorRate * 100).toFixed(1)}%
            </span>
          </div>
        )}

        {/* Last Sync */}
        <div className="flex justify-between items-center pt-2 border-t border-slate-200">
          <span className="text-slate-600 text-sm flex items-center gap-1">
            <Activity className="w-3 h-3" />
            Last Sync
          </span>
          <span className="text-slate-900 text-sm">{lastSync}</span>
        </div>
      </div>
    </div>
  );
}
