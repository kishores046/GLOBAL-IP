/**
 * Authentication utility functions
 * Handles JWT token validation, expiration checking, and auth state management
 */

interface JwtPayload {
  exp: number;
  sub: string;
  roles?: string[];
  iat?: number;
  email?: string;
  username?: string;
  userId?: string;
  [key: string]: any;
}

/**
 * Decode JWT token without verification (for client-side expiration checking only)
 */
function decodeJwt(token: string): JwtPayload | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT token:', error);
    return null;
  }
}

/**
 * Check if JWT token is expired
 * Returns true if token is missing, invalid, or expired
 * Includes 5-second buffer for clock skew between client and server
 */
export function isTokenExpired(): boolean {
  const token = localStorage.getItem('jwt_token');
  
  if (!token) {
    console.log('🔐 No token found in localStorage');
    return true;
  }
  
  const decoded = decodeJwt(token);
  
  if (!decoded || !decoded.exp) {
    console.log('🔐 Invalid token format');
    return true;
  }
  
  const currentTime = Date.now() / 1000;
  // Add 5-second buffer for clock skew - prevents rejection of freshly issued tokens
  const expiryWithBuffer = decoded.exp - 5;
  const isExpired = currentTime > expiryWithBuffer;
  
  if (isExpired) {
    console.log('🔐 Token expired:', {
      expiredAt: new Date(decoded.exp * 1000).toLocaleString(),
      now: new Date().toLocaleString(),
    });
  } else {
    const timeLeft = decoded.exp - currentTime;
    console.log('🔐 Token valid for', Math.floor(timeLeft / 60), 'more minutes');
  }
  
  return isExpired;
}

/**
 * Get token information
 */
export function getTokenInfo(): JwtPayload | null {
  const token = localStorage.getItem('jwt_token');
  if (!token) return null;
  return decodeJwt(token);
}

/**
 * Check if user has required role
 */
export function hasRole(requiredRole: string): boolean {
  const tokenInfo = getTokenInfo();
  if (!tokenInfo || !tokenInfo.roles) return false;
  return tokenInfo.roles.includes(requiredRole);
}

/**
 * Clear authentication data from localStorage
 */
export function clearAuthData(): void {
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('user');
  console.log('🔐 Auth data cleared');
}

/**
 * Check if user is authenticated
 * Returns true if token exists and is not expired
 */
export function isAuthenticated(): boolean {
  const token = localStorage.getItem('jwt_token');
  if (!token) return false;
  return !isTokenExpired();
}

/**
 * Get current user from localStorage
 */
export function getCurrentUser(): any | null {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * Save authentication data
 */
export function saveAuthData(token: string, user: any): void {
  localStorage.setItem('jwt_token', token);
  localStorage.setItem('user', JSON.stringify(user));
  console.log('🔐 Auth data saved');
}

/**
 * Extract user profile from JWT token without calling backend
 * Backend may not have /api/user/profile or /api/user/me endpoint
 * This allows auth to work with JWT-only user info
 */
export function getUserProfileFromToken(): { userId: string; username: string; email: string; roles: string[] } | null {
  const token = localStorage.getItem('jwt_token');
  if (!token) return null;

  const decoded = decodeJwt(token);
  if (!decoded) return null;

  // Extract user info from JWT claims
  const userId = decoded.userId || decoded.sub || 'unknown';
  const email = decoded.email || decoded.sub || 'unknown@example.com';
  const username = decoded.username || decoded.preferred_username || email.split('@')[0] || 'user';
  
  // Parse roles - can be array of strings or objects with roleType
  let roles: string[] = [];
  if (decoded.roles) {
    roles = Array.isArray(decoded.roles) 
      ? decoded.roles.map((r: any) => typeof r === 'string' ? r : r.roleType || 'ROLE_USER')
      : [];
  }

  return {
    userId,
    username,
    email,
    roles: roles.length > 0 ? roles : ['ROLE_USER']
  };
}

/**
 * Determine the primary role based on role hierarchy
 * Higher privilege roles: ADMIN > ANALYST > USER
 * Returns the highest privilege role, or 'user' if none found
 */
export function getPrimaryRole(roles: any[]): string {
  if (!roles || !Array.isArray(roles) || roles.length === 0) {
    return 'user';
  }

  // Normalize roles to uppercase strings
  const normalizedRoles = roles.map(r => {
    const roleStr = typeof r === 'string' ? r : r?.roleType || '';
    return roleStr.replace(/^ROLE_/, '').toUpperCase();
  }).filter(Boolean);

  // Role hierarchy: ADMIN > ANALYST > USER
  if (normalizedRoles.includes('ADMIN')) return 'admin';
  if (normalizedRoles.includes('ANALYST')) return 'analyst';
  return 'user';
}

/**
 * Get the dashboard route for a given role
 * Maps role to correct dashboard path
 */
export function getDashboardRouteForRole(role: string): string {
  const normalizedRole = role.replace(/^ROLE_/, '').toLowerCase();
  
  switch (normalizedRole) {
    case 'admin':
      return '/dashboard/admin';
    case 'analyst':
      return '/dashboard/analyst';
    case 'user':
    default:
      return '/dashboard/user';
  }
}

/**
 * Format token for logging (shows first/last chars only)
 */
export function formatTokenForLog(token: string | null): string {
  if (!token) return 'NO TOKEN';
  if (token.length < 20) return 'INVALID TOKEN';
  return `${token.substring(0, 10)}...${token.substring(token.length - 10)}`;
}
