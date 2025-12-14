import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';
import { ReactElement } from 'react';

interface RequireRoleProps {
  readonly role: string | string[];
  readonly children: ReactElement;
  readonly redirectTo?: string;
}

export function RequireRole({ role, children, redirectTo = '/unauthorized' }: RequireRoleProps) {
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
    console.log('RequireRole: Not authenticated, redirecting to login');
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Check if user has required role
  const hasRequiredRole = hasRole(role);
  
  console.log('RequireRole Check:', {
    userRoles: user.roles,
    requiredRole: role,
    hasRequiredRole,
    path: location.pathname
  });
  
  if (!hasRequiredRole) {
    console.log('RequireRole: Access denied, redirecting to', redirectTo);
    return <Navigate to={redirectTo} replace state={{ requiredRole: role, attemptedPath: location.pathname }} />;
  }

  // User has required role, render children
  return children;
}
