import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export function OAuthSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      // Store the token
      authService.handleOAuthSuccess(token);

      // Fetch user profile to get user details and role
      authService.getUserProfile()
        .then((user) => {
          // Refresh auth context with new user data
          refreshUser().catch(console.error);
          
          // Navigate to appropriate dashboard based on user role
          const firstRole = user?.roles?.[0];
          const primaryRole = (typeof firstRole === 'string' ? firstRole : firstRole?.roleType)?.toLowerCase() || 'user';
            
          if (primaryRole === 'admin') {
            navigate('/dashboard/admin', { replace: true });
          } else if (primaryRole === 'analyst') {
            navigate('/dashboard/analyst', { replace: true });
          } else {
            navigate('/dashboard/user', { replace: true });
          }
        })
        .catch((error) => {
          console.error('Failed to fetch user profile:', error);
          // Navigate to user dashboard by default
          navigate('/dashboard/user', { replace: true });
        });
    } else {
      // No token found, redirect to login
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate, refreshUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-blue-900 mb-2">
          Completing sign in...
        </h2>
        <p className="text-slate-600">
          Please wait while we redirect you to your dashboard
        </p>
      </div>
    </div>
  );
}
