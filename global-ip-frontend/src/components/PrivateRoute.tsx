import { Navigate } from 'react-router-dom';
import authService from '../services/authService';
import { isTokenExpired, clearAuthData } from '../utils/authUtils';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const token = authService.getToken();
  
  // Check if token exists
  if (!token) {
    // No token - redirect to login
    return <Navigate to="/login" replace />;
  }
  
  // Check if token is expired
  if (isTokenExpired()) {
    // Token expired - clear auth data and redirect to login
    clearAuthData();
    return <Navigate to="/login" replace />;
  }

  // Token exists and is valid - render the protected component
  return <>{children}</>;
}
