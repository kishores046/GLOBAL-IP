import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import authService from '../services/authService';
import { isTokenExpired, clearAuthData } from '../utils/authUtils';

interface Role {
  roleId: string;
  roleType: string;
}

interface User {
  userId: string;
  username: string;
  email: string;
  roles: (string | Role)[]; // Support both string array and object array
  [key: string]: any;
}

interface UserProfile extends User {
  name?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getRole: () => string | null;
  getAllRoles: () => string[];
  hasRole: (roles: string | string[]) => boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user on initial mount or token change
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = authService.getToken();
      
      if (storedToken) {
        // Check if token is expired
        if (isTokenExpired()) {
          console.log('🔐 Token expired during initialization, clearing auth data');
          clearAuthData();
          setToken(null);
          setUser(null);
          setIsLoading(false);
          return;
        }
        
        setToken(storedToken);
        try {
          // Fetch user profile
          const userData = await authService.getUserProfile();
          setUser({ ...userData, username: userData.username || userData.email });
        } catch (error) {
          console.error('AuthContext: Failed to fetch user profile:', error);
          // Clear invalid token
          authService.logout();
          setToken(null);
          setUser(null);
        }
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      await authService.login({ email, password });
      const userData = await authService.getUserProfile();
      const newToken = authService.getToken();
      
      setToken(newToken);
      setUser({ ...userData, username: userData.username || userData.email });
    } catch (error) {
      console.error('AuthContext: Login failed:', error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    await authService.logout();
    setToken(null);
    setUser(null);
  };

  // Get current user role (primary/first role)
  const getRole = (): string | null => {
    if (!user?.roles?.length) return null;
    const firstRole = user.roles[0];
    return typeof firstRole === 'string' ? firstRole : firstRole?.roleType || null;
  };

  // Get all user roles
  const getAllRoles = (): string[] => {
    if (!user?.roles?.length) return [];
    return user.roles.map(r => 
      typeof r === 'string' ? r.toUpperCase() : r?.roleType?.toUpperCase()
    ).filter(Boolean) as unknown as string[];
  };

  // Check if user has specific role(s)
  const hasRole = (roles: string | string[]): boolean => {
    if (!user?.roles?.length) return false;
    
    // Handle roles as either string array or object array
    const userRoles = user.roles.map(r => 
      typeof r === 'string' ? r.toUpperCase() : r?.roleType?.toUpperCase()
    ).filter(Boolean);
    
    const allowedRoles = Array.isArray(roles) 
      ? roles.map(r => r.toUpperCase()) 
      : [roles.toUpperCase()];
    
    return allowedRoles.some(role => userRoles.includes(role));
  };

  // Refresh user data - wrapped in useCallback to prevent infinite loops
  const refreshUser = useCallback(async () => {
    try {
      const userData = await authService.getUserProfile();
      setUser({ ...userData, username: userData.username || userData.email });
    } catch (error) {
      console.error('AuthContext: Failed to refresh user:', error);
      throw error;
    }
  }, []);

  const isAuthenticated = !!token && !!user;

  const value: AuthContextType = useMemo(() => ({
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout,
    getRole,
    getAllRoles,
    hasRole,
    refreshUser,
  }), [user, token, isLoading, isAuthenticated, login, logout, getRole, getAllRoles, hasRole, refreshUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
