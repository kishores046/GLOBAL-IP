/**
 * StatusBadge Component
 * Displays status badge for SUCCESS/ERROR states
 */

import { CheckCircle, XCircle } from 'lucide-react';
import type { StatusBadgeProps } from '../../types/admin';

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const isSuccess = status === 'SUCCESS';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClasses[size]} ${
        isSuccess
          ? 'bg-green-100 text-green-700'
          : 'bg-red-100 text-red-700'
      }`}
    >
      {isSuccess ? (
        <CheckCircle className={iconSizes[size]} />
      ) : (
        <XCircle className={iconSizes[size]} />
      )}
      {status}
    </span>
  );
}
