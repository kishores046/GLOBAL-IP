import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function UnauthorizedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, getRole } = useAuth();

  // Get the required roles from location state
  const requiredRoles = (location.state as any)?.requiredRoles || [];
  const attemptedPath = (location.state as any)?.attemptedPath || '';

  // Determine the page type from the attempted path
  const getPageType = () => {
    if (attemptedPath.includes('/dashboard/admin') || attemptedPath.includes('/admin/')) {
      return 'Admin Dashboard';
    } else if (attemptedPath.includes('/dashboard/analyst') || attemptedPath.includes('/analyst/')) {
      return 'Analyst Dashboard';
    } else if (attemptedPath.includes('/dashboard/user') || attemptedPath.includes('/user/')) {
      return 'User Dashboard';
    }
    return 'this page';
  };

  // Get required role display text
  const getRequiredRoleText = () => {
    if (requiredRoles.length === 0) return 'specific roles';
    
    const roleNames = requiredRoles.map((role: string) => {
      const upperRole = role.toUpperCase();
      if (upperRole === 'ADMIN') return 'Administrator';
      if (upperRole === 'ANALYST') return 'Analyst';
      if (upperRole === 'USER') return 'User';
      return role;
    });

    if (roleNames.length === 1) {
      return roleNames[0];
    } else if (roleNames.length === 2) {
      return `${roleNames[0]} or ${roleNames[1]}`;
    } else {
      return `${roleNames.slice(0, -1).join(', ')}, or ${roleNames[roleNames.length - 1]}`;
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    const role = getRole()?.toUpperCase();
    
    // Redirect based on user role
    if (role === 'ADMIN') {
      navigate('/dashboard/admin');
    } else if (role === 'ANALYST') {
      navigate('/dashboard/analyst');
    } else {
      navigate('/dashboard/user');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-slate-50 to-orange-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 md:p-12 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
              <ShieldAlert className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-red-900 mb-4">
            Access Denied
          </h1>

          {/* Message */}
          <p className="text-lg text-slate-700 mb-2">
            You don't have permission to access {getPageType()}.
          </p>
          <p className="text-slate-600 mb-8">
            This area is restricted to users with <span className="font-semibold text-red-700">{getRequiredRoleText()}</span> role.
          </p>

          {/* User Info */}
          {user && (
            <div className="mb-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-sm text-slate-600 mb-1">Logged in as:</p>
              <p className="font-semibold text-blue-900">{user.username || user.email}</p>
              <p className="text-sm text-slate-600 mt-1">
                Current Role: <span className="font-medium text-slate-900">{getRole()}</span>
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGoBack}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
            <button
              onClick={handleGoHome}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <Home className="w-5 h-5" />
              Go to Dashboard
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-8 pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-600">
              If you believe you should have access to this page, please contact your administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
