/**
 * Date Utility Functions for Admin Dashboard
 */

import { format, formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Format timestamp to readable date-time string
 * @param timestamp - ISO format timestamp
 * @returns Formatted string like "2025-12-10 14:32:15"
 */
export const formatTimestamp = (timestamp: string): string => {
  try {
    const date = typeof timestamp === 'string' ? parseISO(timestamp) : new Date(timestamp);
    return format(date, 'yyyy-MM-dd HH:mm:ss');
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return timestamp;
  }
};

/**
 * Format timestamp to relative time
 * @param timestamp - ISO format timestamp
 * @returns Relative time like "2 mins ago", "Just now"
 */
export const formatRelativeTime = (timestamp: string): string => {
  try {
    const date = typeof timestamp === 'string' ? parseISO(timestamp) : new Date(timestamp);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return timestamp;
  }
};

/**
 * Format date to ISO date string
 * @param date - Date object
 * @returns ISO date string like "2025-12-10"
 */
export const formatDate = (date: Date): string => {
  try {
    return format(date, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Format date to display format
 * @param date - Date object or ISO string
 * @returns Formatted string like "Dec 10, 2025"
 */
export const formatDisplayDate = (date: Date | string): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'MMM dd, yyyy');
  } catch (error) {
    console.error('Error formatting display date:', error);
    return String(date);
  }
};

/**
 * Format time only
 * @param timestamp - ISO format timestamp
 * @returns Time string like "14:32:15"
 */
export const formatTime = (timestamp: string): string => {
  try {
    const date = typeof timestamp === 'string' ? parseISO(timestamp) : new Date(timestamp);
    return format(date, 'HH:mm:ss');
  } catch (error) {
    console.error('Error formatting time:', error);
    return timestamp;
  }
};

/**
 * Get date range for common periods
 * @param period - "today" | "7days" | "30days"
 * @returns Object with start and end dates
 */
export const getDateRange = (period: 'today' | '7days' | '30days') => {
  const end = new Date();
  const start = new Date();

  switch (period) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      break;
    case '7days':
      start.setDate(start.getDate() - 7);
      break;
    case '30days':
      start.setDate(start.getDate() - 30);
      break;
  }

  return {
    startDate: start.toISOString(),
    endDate: end.toISOString(),
  };
};
