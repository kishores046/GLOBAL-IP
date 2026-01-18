/**
 * Competitor Tracking System - Utility Functions
 * Formatting, validation, and helper functions
 */

import { format, parseISO, formatISO } from 'date-fns';
import type { CompetitorDTO, FilingTrendDTO, JurisdictionBreakdownData } from '../types';

// ==================== DATE UTILITIES ====================

/**
 * Format ISO date string to display format
 */
export function formatDate(isoDate: string): string {
  try {
    return format(parseISO(isoDate), 'MMM d, yyyy');
  } catch {
    return isoDate;
  }
}

/**
 * Format ISO datetime string with time
 */
export function formatDateTime(isoDateTime: string): string {
  try {
    return format(parseISO(isoDateTime), 'MMM d, yyyy h:mm a');
  } catch {
    return isoDateTime;
  }
}

/**
 * Format date for API calls (ISO format)
 */
export function formatDateForApi(date: Date): string {
  return formatISO(date, { representation: 'date' });
}

/**
 * Format date as YYYY-MM
 */
export function formatYearMonth(isoDate: string): string {
  try {
    return format(parseISO(isoDate), 'yyyy-MM');
  } catch {
    return isoDate;
  }
}

/**
 * Format date range for display
 */
export function formatDateRange(fromDate: string, toDate: string): string {
  return `${formatDate(fromDate)} - ${formatDate(toDate)}`;
}

// ==================== JURISDICTION UTILITIES ====================

/**
 * Get jurisdiction label
 */
export function getJurisdictionLabel(jurisdiction: string): string {
  const labels: Record<string, string> = {
    US: 'US Patent Office',
    EP: 'European Patent Office',
    BOTH: 'US & Europe',
  };
  return labels[jurisdiction] || jurisdiction;
}

/**
 * Get jurisdiction badge with flag
 */
export function getJurisdictionBadge(jurisdiction: 'US' | 'EP'): {
  icon: string;
  label: string;
  color: string;
} {
  const config: Record<'US' | 'EP', { icon: string; label: string; color: string }> = {
    US: { icon: '🇺🇸', label: 'US', color: 'blue' },
    EP: { icon: '🇪🇺', label: 'EP', color: 'green' },
  };

  return config[jurisdiction];
}

/**
 * Get jurisdiction badge color
 */
export function getJurisdictionColor(jurisdiction: string): string {
  const colors: Record<string, string> = {
    US: 'bg-blue-100 text-blue-800',
    EP: 'bg-green-100 text-green-800',
    BOTH: 'bg-purple-100 text-purple-800',
  };
  return colors[jurisdiction] || 'bg-gray-100 text-gray-800';
}

// ==================== STATUS UTILITIES ====================

/**
 * Get filing status label
 */
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    PUBLISHED: 'Published',
    PENDING: 'Pending',
    ABANDONED: 'Abandoned',
  };
  return labels[status] || status;
}

/**
 * Get status badge color
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-800',
    INACTIVE: 'bg-gray-100 text-gray-800',
    PUBLISHED: 'bg-blue-100 text-blue-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    ABANDONED: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

// ==================== COMPETITOR UTILITIES ====================

/**
 * Format competitor code (uppercase)
 */
export function formatCompetitorCode(code: string): string {
  return code.toUpperCase().trim();
}

/**
 * Validate competitor code format
 */
export function isValidCompetitorCode(code: string): boolean {
  const trimmed = code.trim();
  // Alphanumeric only, 1-20 chars
  return /^[A-Z0-9]{1,20}$/.test(trimmed.toUpperCase());
}

/**
 * Truncate assignee names for display
 */
export function truncateAssigneeNames(
  names: string[],
  maxDisplay: number = 2
): { display: string; remaining: number } {
  const display = names.slice(0, maxDisplay).join(', ');
  const remaining = Math.max(0, names.length - maxDisplay);
  return { display, remaining };
}

/**
 * Get competitor display text
 */
export function getCompetitorDisplayText(competitor: CompetitorDTO): string {
  return `${competitor.code} - ${competitor.displayName}`;
}

// ==================== FILING UTILITIES ====================

/**
 * Check if filing has ownership change/transfer
 */
export function hasOwnershipTransfer(filingDTO: { filedBy: string; currentOwner: string }): boolean {
  return filingDTO.filedBy.trim() !== filingDTO.currentOwner.trim();
}

/**
 * Check if filing has ownership change (legacy alias)
 */
export function hasOwnershipChange(filedBy: string, currentOwner: string): boolean {
  return filedBy.trim() !== currentOwner.trim();
}

/**
 * Get filing type label
 */
export function getFilingTypeLabel(filingType?: string): string {
  if (!filingType) return 'N/A';
  const labels: Record<string, string> = {
    A1: 'Application',
    B1: 'Publication',
    B2: 'Grant',
  };
  return labels[filingType] || filingType;
}

/**
 * Get WIPO kind code tooltip description
 */
export function getFilingTypeTooltip(filingType?: string): string {
  const descriptions: Record<string, string> = {
    A1: 'Patent Application (with search report)',
    A2: 'Patent Application (without search report)',
    B1: 'Granted Patent',
    B2: 'Granted Patent (amended)',
    C1: 'Corrected Patent',
    C2: 'Corrected Patent (amended)',
    U1: 'Utility Model Certificate',
    U2: 'Utility Model Certificate (amended)',
  };

  return descriptions[filingType || ''] || 'Filing type information';
}

/**
 * Sort filings by date (newest first)
 */
export function sortFilingsByDate(
  filings: any[],
  ascending: boolean = false
): any[] {
  return [...filings].sort((a, b) => {
    const dateA = new Date(a.publicationDate).getTime();
    const dateB = new Date(b.publicationDate).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
}

// ==================== TREND DATA UTILITIES ====================

/**
 * Convert filing trends to chart data
 */
export function convertTrendsToChartData(trends: FilingTrendDTO[]) {
  return trends.map(trend => ({
    name: trend.competitorCode,
    displayName: trend.competitorName,
    value: trend.count,
  }));
}

/**
 * Calculate jurisdiction breakdown
 */
export function calculateJurisdictionBreakdown(
  usCount: number,
  epCount: number
): JurisdictionBreakdownData[] {
  const total = usCount + epCount;
  return [
    {
      jurisdiction: 'US',
      count: usCount,
      percentage: total > 0 ? Math.round((usCount / total) * 100) : 0,
    },
    {
      jurisdiction: 'EP',
      count: epCount,
      percentage: total > 0 ? Math.round((epCount / total) * 100) : 0,
    },
  ];
}

/**
 * Get top N competitors by filing count
 */
export function getTopCompetitors(
  trends: FilingTrendDTO[],
  limit: number = 10
): FilingTrendDTO[] {
  return [...trends]
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

// ==================== PAGINATION UTILITIES ====================

/**
 * Generate page numbers for pagination
 */
export function generatePageNumbers(
  currentPage: number,
  totalPages: number,
  windowSize: number = 5
): (number | string)[] {
  const pages: (number | string)[] = [];
  const halfWindow = Math.floor(windowSize / 2);

  let start = Math.max(1, currentPage - halfWindow);
  let end = Math.min(totalPages, start + windowSize - 1);

  if (end - start < windowSize - 1) {
    start = Math.max(1, end - windowSize + 1);
  }

  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push('...');
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < totalPages) {
    if (end < totalPages - 1) pages.push('...');
    pages.push(totalPages);
  }

  return pages;
}

// ==================== CSV EXPORT UTILITIES ====================

/**
 * Convert filing data to CSV format
 */
export function convertFilingsToCsv(filings: any[]): string {
  if (filings.length === 0) return '';

  const headers = [
    'Patent ID',
    'Title',
    'Competitor',
    'Publication Date',
    'Jurisdiction',
    'Filed By',
    'Current Owner',
    'Status',
  ];

  const rows = filings.map(filing => [
    filing.patentId,
    `"${filing.title}"`,
    filing.competitorCode,
    filing.publicationDate,
    filing.jurisdiction,
    filing.filedBy,
    filing.currentOwner,
    filing.status,
  ]);

  return [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');
}

/**
 * Download CSV file
 */
export function downloadCsv(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Download blob file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

// ==================== VALIDATION UTILITIES ====================

/**
 * Validate assignee names
 */
export function validateAssigneeNames(names: string[]): boolean {
  if (!Array.isArray(names) || names.length === 0) return false;
  return names.every(name => typeof name === 'string' && name.trim().length > 0);
}

/**
 * Validate competitor creation request
 */
export function validateCompetitorForm(data: any): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!data.code || !isValidCompetitorCode(data.code)) {
    errors.code = 'Code must be 1-20 alphanumeric characters';
  }

  if (!data.displayName || data.displayName.trim().length === 0) {
    errors.displayName = 'Display name is required';
  }

  if (!validateAssigneeNames(data.assigneeNames)) {
    errors.assigneeNames = 'At least one assignee name is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// ==================== COMPARISON UTILITIES ====================

/**
 * Check if competitor data has changed
 */
export function hasCompetitorChanged(
  original: CompetitorDTO,
  updated: Partial<CompetitorDTO>
): boolean {
  return Object.entries(updated).some(
    ([key, value]) => original[key as keyof CompetitorDTO] !== value
  );
}
