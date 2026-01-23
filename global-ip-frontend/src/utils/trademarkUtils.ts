/**
 * Frontend-only utility for USPTO trademark status normalization and validation
 * 
 * Note: This is a temporary UI-layer solution. Backend normalization will be
 * implemented in a future milestone.
 */

export type UITrademarkStatus = 'PENDING' | 'REGISTERED' | 'DEAD';

export interface TrademarkStatusInfo {
  uiStatus: UITrademarkStatus;
  displayLabel: string;
  badgeColor: string;
  description: string;
}

/**
 * Maps raw USPTO status codes (600-699 series) to high-level UI statuses
 * 
 * @param statusCode - Numeric USPTO status code
 * @param statusDescription - Raw status description from backend
 * @returns Normalized status information for UI display
 */
export function mapTrademarkStatus(
  statusCode?: string | number,
  statusDescription?: string
): TrademarkStatusInfo {
  // Convert to number if string
  const code = typeof statusCode === 'string' ? parseInt(statusCode, 10) : statusCode;

  // Default fallback
  if (!code || isNaN(code)) {
    return {
      uiStatus: 'PENDING',
      displayLabel: statusDescription || 'Unknown',
      badgeColor: 'bg-slate-100 text-slate-700',
      description: statusDescription || 'Status unknown'
    };
  }

  // PENDING statuses (600-649): examination, office actions, publication stages
  if (code >= 600 && code < 650) {
    return {
      uiStatus: 'PENDING',
      displayLabel: 'Pending',
      badgeColor: 'bg-yellow-100 text-yellow-700',
      description: statusDescription || 'Application pending'
    };
  }

  // REGISTERED statuses (650-679): active registrations
  if (code >= 650 && code < 680) {
    return {
      uiStatus: 'REGISTERED',
      displayLabel: 'Registered',
      badgeColor: 'bg-green-100 text-green-700',
      description: statusDescription || 'Registration active'
    };
  }

  // DEAD statuses (680-699): abandoned, cancelled, expired, terminated
  if (code >= 680 && code < 700) {
    return {
      uiStatus: 'DEAD',
      displayLabel: 'Dead',
      badgeColor: 'bg-red-100 text-red-700',
      description: statusDescription || 'Registration inactive'
    };
  }

  // Fallback for unexpected codes
  return {
    uiStatus: 'PENDING',
    displayLabel: statusDescription || 'Unknown',
    badgeColor: 'bg-slate-100 text-slate-700',
    description: statusDescription || 'Status unknown'
  };
}

/**
 * Validates a date string to ensure it's not in the future
 * 
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns True if date is valid and not in the future
 */
export function isValidFilingDate(dateString: string): boolean {
  if (!dateString) return true; // Empty is valid (optional field)

  const inputDate = new Date(dateString);
  const today = new Date();
  
  // Set time to start of day for accurate comparison
  today.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);

  return inputDate <= today && !isNaN(inputDate.getTime());
}

/**
 * Gets the maximum allowed filing date (today)
 * 
 * @returns Date string in YYYY-MM-DD format
 */
export function getMaxFilingDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * Validates filing date range
 * 
 * @param fromDate - Start date string
 * @param toDate - End date string
 * @returns Object with validation result and error message
 */
export function validateFilingDateRange(
  fromDate: string,
  toDate: string
): { isValid: boolean; error?: string } {
  // Check if from date is in the future
  if (fromDate && !isValidFilingDate(fromDate)) {
    return {
      isValid: false,
      error: 'Filing date cannot be in the future'
    };
  }

  // Check if to date is in the future
  if (toDate && !isValidFilingDate(toDate)) {
    return {
      isValid: false,
      error: 'Filing date cannot be in the future'
    };
  }

  // Check if from date is after to date
  if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
    return {
      isValid: false,
      error: 'Start date must be before or equal to end date'
    };
  }

  return { isValid: true };
}
