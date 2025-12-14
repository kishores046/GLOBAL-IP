// Route path constants
export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  OAUTH_SUCCESS: '/oauth/success',
  UNAUTHORIZED: '/unauthorized',
  
  // User routes
  USER_DASHBOARD: '/dashboard/user',
  REQUEST_ADMIN: '/request-admin',
  FILING_TRACKER: '/user/filing-tracker',
  PORTFOLIO_TRACKER: '/user/portfolio-tracker',
  SUBSCRIPTIONS: '/user/subscriptions',
  ALERTS: '/user/alerts',
  PROFILE: '/user/profile',
  
  // Analyst routes
  ANALYST_DASHBOARD: '/dashboard/analyst',
  COMPETITOR_ANALYTICS: '/analyst/competitor-analytics',
  ADVANCED_SEARCH: '/analyst/advanced-search',
  VISUALIZATION_ENGINE: '/analyst/visualization',
  EXPORT_TOOLS: '/analyst/export-tools',
  
  // Admin routes
  ADMIN_DASHBOARD: '/dashboard/admin',
  USER_MANAGEMENT: '/admin/user-management',
  ROLE_REQUESTS: '/admin/role-requests',
  API_HEALTH: '/admin/api-health',
  API_KEYS: '/admin/api-keys',
  USAGE_LOGS: '/admin/usage-logs',
  DATA_SYNC: '/admin/data-sync',
  ADMIN_SETTINGS: '/admin/settings',
  
  // Shared routes (all authenticated users)
  IP_SEARCH: '/search',
  SETTINGS: '/settings',
} as const;

// Role definitions
export const ROLES = {
  USER: 'USER',
  ANALYST: 'ANALYST',
  ADMIN: 'ADMIN',
} as const;

// Role hierarchy (higher roles inherit lower role permissions)
export const ROLE_HIERARCHY = {
  [ROLES.USER]: 1,
  [ROLES.ANALYST]: 2,
  [ROLES.ADMIN]: 3,
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];
