/**
 * ServiceBadge Component
 * Displays colored badge for different API services
 */

import type { ServiceBadgeProps } from '../../types/admin';

export function ServiceBadge({ service, size = 'md' }: ServiceBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  const getServiceColor = (service: string) => {
    switch (service.toUpperCase()) {
      case 'EPO':
        return 'bg-blue-100 text-blue-700';
      case 'USPTO':
        return 'bg-green-100 text-green-700';
      case 'TRADEMARK':
        return 'bg-amber-100 text-amber-700';
      case 'TRENDS':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${sizeClasses[size]} ${getServiceColor(
        service
      )}`}
    >
      {service}
    </span>
  );
}
