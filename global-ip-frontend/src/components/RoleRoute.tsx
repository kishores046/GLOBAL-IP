import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface RoleRouteProps {
  readonly roles: string[];
  readonly element: React.ReactElement;
}

export function RoleRoute({ roles, element }: RoleRouteProps) {
  const { user, isLoading, isAuthenticated, hasRole } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    console.log('RoleRoute: Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  // Handle roles as either string array or object array
  const userRoles = user?.roles?.map(r => 
    typeof r === 'string' ? r.toUpperCase() : r?.roleType?.toUpperCase()
  ).filter(Boolean) || [];
  
  const allowedRoles = roles.map(role => role.toUpperCase());
  const hasRequiredRole = allowedRoles.some(role => userRoles.includes(role));
  
  console.log('RoleRoute Check:', {
    userRoles,
    allowedRoles,
    hasRequiredRole
  });
  
  // Special case: If accessing /request-admin and user has ADMIN role, redirect to admin dashboard
  if (location.pathname === '/request-admin' && hasRole('ADMIN')) {
    console.log('RoleRoute: User already has admin role, redirecting to admin dashboard');
    return <Navigate to="/dashboard/admin" replace />;
  }
  
  if (userRoles.length === 0 || !hasRequiredRole) {
    console.log('RoleRoute: Access denied, redirecting to /unauthorized');
    return <Navigate to="/unauthorized" replace state={{ requiredRoles: roles, attemptedPath: location.pathname }} />;
  }

  // User has required role, render the element
  return element;
}
