import { ROLES, ROLE_HIERARCHY, Role } from '../routes/routeConfig';

/**
 * Check if a user has a specific role
 */
export function hasRole(userRoles: (string | { roleType: string })[], allowedRoles: string[]): boolean {
  if (!userRoles || userRoles.length === 0) return false;
  
  // Normalize user roles to uppercase strings
  const normalizedUserRoles = userRoles
    .map(r => (typeof r === 'string' ? r : r?.roleType))
    .filter(Boolean)
    .map(r => r.toUpperCase());
  
  // Normalize allowed roles to uppercase
  const normalizedAllowedRoles = allowedRoles.map(r => r.toUpperCase());
  
  // Check if user has any of the allowed roles
  return normalizedAllowedRoles.some(role => normalizedUserRoles.includes(role));
}

/**
 * Check if user role is equal to or higher than required role
 * Uses role hierarchy: USER < ANALYST < ADMIN
 */
export function hasMinimumRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

/**
 * Get the highest role from a list of roles
 */
export function getHighestRole(roles: (string | { roleType: string })[]): Role | null {
  if (!roles || roles.length === 0) return null;
  
  const normalizedRoles = roles
    .map(r => (typeof r === 'string' ? r : r?.roleType))
    .filter(Boolean)
    .map(r => r.toUpperCase() as Role);
  
  let highestRole: Role | null = null;
  let highestLevel = 0;
  
  for (const role of normalizedRoles) {
    const level = ROLE_HIERARCHY[role];
    if (level && level > highestLevel) {
      highestLevel = level;
      highestRole = role;
    }
  }
  
  return highestRole;
}

/**
 * Check if user is admin
 */
export function isAdmin(userRoles: (string | { roleType: string })[]): boolean {
  return hasRole(userRoles, [ROLES.ADMIN]);
}

/**
 * Check if user is analyst or higher
 */
export function isAnalyst(userRoles: (string | { roleType: string })[]): boolean {
  return hasRole(userRoles, [ROLES.ANALYST, ROLES.ADMIN]);
}

/**
 * Get user's primary role (first role or highest role)
 */
export function getPrimaryRole(userRoles: (string | { roleType: string })[]): string | null {
  if (!userRoles || userRoles.length === 0) return null;
  
  // Return highest role instead of first
  return getHighestRole(userRoles);
}

/**
 * Get dashboard route based on user role
 */
export function getDashboardRoute(userRoles: (string | { roleType: string })[]): string {
  const highestRole = getHighestRole(userRoles);
  
  switch (highestRole) {
    case ROLES.ADMIN:
      return '/dashboard/admin';
    case ROLES.ANALYST:
      return '/dashboard/analyst';
    case ROLES.USER:
    default:
      return '/dashboard/user';
  }
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: Role): string[] {
  const basePermissions = ['view_dashboard', 'edit_profile'];
  
  switch (role) {
    case ROLES.ADMIN:
      return [
        ...basePermissions,
        'manage_users',
        'view_api_health',
        'manage_api_keys',
        'view_usage_logs',
        'manage_data_sync',
        'manage_system_settings',
        'export_data',
        'advanced_search',
        'competitor_analytics',
        'visualization',
      ];
    case ROLES.ANALYST:
      return [
        ...basePermissions,
        'export_data',
        'advanced_search',
        'competitor_analytics',
        'visualization',
      ];
    case ROLES.USER:
    default:
      return [
        ...basePermissions,
        'basic_search',
        'manage_filings',
        'manage_portfolio',
        'manage_subscriptions',
        'view_alerts',
      ];
  }
}
