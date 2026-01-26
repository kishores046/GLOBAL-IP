// Route path constants
export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  CHANGE_PASSWORD: '/change-password',
  OAUTH_SUCCESS: '/oauth/success',
  UNAUTHORIZED: '/unauthorized',
  
  // User routes
  USER_DASHBOARD: '/dashboard/user',
  REQUEST_ADMIN: '/request-admin',
  FILING_TRACKER: '/user/filing-tracker',
  PORTFOLIO_TRACKER: '/user/portfolio-tracker',
  SUBSCRIPTIONS: '/user/subscriptions',
  CREATE_SUBSCRIPTION: '/user/subscriptions/create',
  ALERTS: '/user/alerts',
  PROFILE: '/user/profile',
  
  // Analyst routes
  ANALYST_DASHBOARD: '/dashboard/analyst',
  ANALYST_PROFILE: '/analyst/profile',
  ANALYST_API_KEYS_SETTINGS: '/analyst/settings/api-keys',
  ANALYST_SUBSCRIPTIONS: '/analyst/subscriptions',
  ANALYST_CREATE_SUBSCRIPTION: '/analyst/subscriptions/create',
  COMPETITORS: '/competitors',
  COMPETITOR_DETAIL: '/competitors/:id',
  COMPETITOR_FILINGS: '/competitors/filings',
  COMPETITOR_SYNC: '/competitors/sync',
  COMPETITOR_ANALYTICS: '/competitors/analytics',
  ADVANCED_SEARCH: '/analyst/advanced-search',
  ANALYST_ALERTS: '/analyst/alerts',
  VISUALIZATION_ENGINE: '/analyst/visualization',
  EXPORT_TOOLS: '/analyst/export-tools',
  PATENT_TRENDS: '/analyst/trends/patents',
  TRADEMARK_TRENDS: '/analyst/trends/trademarks',
  PATENT_LIFECYCLE: '/analyst/lifecycle/patents',
  TRADEMARK_LIFECYCLE: '/analyst/lifecycle/trademarks',
  TRACKED_PATENTS: '/analyst/tracked-patents',
  MONITORING: '/monitoring',
  
  // User-specific routes (for USER role)
  USER_TRACKED_PATENTS: '/user/tracked-patents',
  USER_VISUALIZATION_ENGINE: '/user/visualization',
  USER_PATENT_LIFECYCLE: '/user/lifecycle/patents',
  USER_TRADEMARK_LIFECYCLE: '/user/lifecycle/trademarks',
  USER_CITATION_GRAPH: '/user/citation-graph',
  
  // Admin routes
  ADMIN_DASHBOARD: '/dashboard/admin',
  ADMIN_OVERVIEW: '/admin/overview', // New monitoring dashboard overview
  ADMIN_API_HEALTH: '/admin/monitoring/api-health', // New API health monitor
  ADMIN_SYSTEM_LOGS: '/admin/monitoring/logs', // New system logs
  ADMIN_ERROR_SUMMARY: '/admin/monitoring/errors', // New error summary
  USER_MANAGEMENT: '/admin/user-management',
  ROLE_REQUESTS: '/admin/role-requests',
  API_KEYS: '/admin/api-keys',
  ADMIN_SETTINGS: '/admin/settings',
  
  // Shared routes (all authenticated users)
  IP_SEARCH: '/search',
  SEARCH_RESULTS: '/search/results',
  PATENT_DETAIL: '/patents/:publicationNumber',
  PATENT_TRACKING: '/patents/:publicationNumber/track',
  TRADEMARK_DETAIL: '/trademarks/:trademarkId',
  SETTINGS: '/settings',
  API_KEYS_SETTINGS: '/settings/api-keys',
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
