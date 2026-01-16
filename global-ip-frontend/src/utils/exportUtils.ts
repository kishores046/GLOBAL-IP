/**
 * Export Utility Functions
 * Handle CSV file downloads and exports
 */

import { adminApi } from '../services/adminApi';
import type { LogFilters } from '../types/admin';
import { toast } from 'sonner';

/**
 * Download CSV file from blob
 * @param blob - CSV data blob
 * @param filename - Name for downloaded file
 */
const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Export usage logs to CSV file
 * @param filters - Log filters to apply
 * @param filename - Optional custom filename
 */
export const downloadLogsCSV = async (
  filters: Omit<LogFilters, 'page' | 'size' | 'sort'>,
  filename?: string
): Promise<void> => {
  try {
    // Show loading toast
    const loadingToast = toast.loading('Preparing CSV export...');

    // Fetch CSV data
    const blob = await adminApi.exportLogs(filters);

    // Generate filename with timestamp if not provided
    const timestamp = new Date().toISOString().split('T')[0];
    const finalFilename = filename || `api-logs-${timestamp}.csv`;

    // Download file
    downloadBlob(blob, finalFilename);

    // Dismiss loading toast and show success
    toast.dismiss(loadingToast);
    toast.success('Logs exported successfully!');
  } catch (error) {
    console.error('Error exporting logs:', error);
    toast.error('Failed to export logs. Please try again.');
    throw error;
  }
};

/**
 * Export data as JSON file
 * @param data - Data to export
 * @param filename - Name for downloaded file
 */
export const downloadJSON = <T>(data: T, filename: string): void => {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    downloadBlob(blob, filename);
    toast.success('Data exported successfully!');
  } catch (error) {
    console.error('Error exporting JSON:', error);
    toast.error('Failed to export data.');
    throw error;
  }
};

/**
 * Convert array data to CSV string
 * @param data - Array of objects to convert
 * @param headers - Optional custom headers
 * @returns CSV string
 */
export const arrayToCSV = <T extends Record<string, unknown>>(
  data: T[],
  headers?: string[]
): string => {
  if (data.length === 0) return '';

  // Get headers from first object if not provided
  const csvHeaders = headers || Object.keys(data[0]);

  // Create header row
  const headerRow = csvHeaders.join(',');

  // Create data rows
  const dataRows = data.map((row) => {
    return csvHeaders
      .map((header) => {
        const value = row[header];
        // Escape values containing commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return String(value ?? '');
      })
      .join(',');
  });

  return [headerRow, ...dataRows].join('\n');
};

/**
 * Download array data as CSV
 * @param data - Array of objects to export
 * @param filename - Name for downloaded file
 * @param headers - Optional custom headers
 */
export const downloadArrayAsCSV = <T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  headers?: string[]
): void => {
  try {
    const csv = arrayToCSV(data, headers);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, filename);
    toast.success('Data exported successfully!');
  } catch (error) {
    console.error('Error exporting CSV:', error);
    toast.error('Failed to export data.');
    throw error;
  }
};
