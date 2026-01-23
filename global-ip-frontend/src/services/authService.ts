import api from './api';

// Backend OAuth2 endpoints
const OAUTH2_REDIRECT_URI = 'http://localhost:8080/oauth2/authorization';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  role: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  passwordChangeRequired?: boolean;
  user?: any;
}

export interface UserProfile {
  userId: string;
  username: string;
  email: string;
  roles: (string | { roleId: string; roleType: string })[];
  phoneNumber?: string;
  company?: string;
  location?: string;
  position?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

class AuthService {
  // Normal login with email and password
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', credentials);
      const data = response.data;
      
      // Check if password change is required
      if (data.passwordChangeRequired === true) {
        // DO NOT store token when password change is required
        return {
          passwordChangeRequired: true,
          token: undefined
        };
      }
      
      // Normal login - store token
      const token = data.token || data;
      if (token) {
        this.setToken(token);
      }
      
      return data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Login failed. Please check your credentials.'
      );
    }
  }

  // Register new user
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/register', {
        username: userData.username,
        email: userData.email,
        role: userData.role,
        password: userData.password
      });
      
      // Registration doesn't return token, just success message
      return response.data;
    } catch (error: any) {
      console.error('authService: Registration failed:', error.response?.data);
      
      throw new Error(
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data ||
        'Registration failed. Please try again.'
      );
    }
  }  // Get current user profile
  async getUserProfile(): Promise<UserProfile> {
    try {
      const response = await api.get('/user/profile');
      const user = response.data;
      
      // Store user data in localStorage
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      return user;
    } catch (error: any) {
      console.error('authService: getUserProfile error:', error);
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to fetch user profile.'
      );
    }
  }

  // OAuth2 Login - Redirect to backend OAuth2 endpoint
  loginWithGoogle(): void {
    window.location.href = `${OAUTH2_REDIRECT_URI}/google`;
  }

  loginWithGitHub(): void {
    window.location.href = `${OAUTH2_REDIRECT_URI}/github`;
  }

  // Handle OAuth2 success callback
  handleOAuthSuccess(token: string): void {
    this.setToken(token);
  }

  // Store JWT token
  setToken(token: string): void {
    localStorage.setItem('jwt_token', token);
  }

  // Get JWT token
  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  // Logout user - calls backend to blacklist token
  async logout(): Promise<void> {
    try {
      const token = this.getToken();
      
      // Call backend logout endpoint if token exists
      if (token) {
        try {
          await api.post('/auth/logout', {}, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          console.log('✅ Backend logout successful - token blacklisted');
        } catch (error: any) {
          // Even if backend logout fails, still clear frontend
          console.warn('⚠️ Backend logout failed, clearing frontend state:', error.message);
        }
      }
    } catch (error) {
      console.error('❌ Logout error:', error);
    } finally {
      // Always clear localStorage and state regardless of backend response
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user');
      console.log('🔐 Local auth data cleared');
    }
  }

  // Get stored user data
  getUser(): UserProfile | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  // Get User Dashboard Data
  async getUserDashboard(): Promise<any> {
    try {
      const response = await api.get('/user/dashboard');
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Failed to fetch user dashboard.'
      );
    }
  }

  // Get Analyst Dashboard Data
  async getAnalystDashboard(): Promise<any> {
    try {
      const response = await api.get('/analyst/dashboard');
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Failed to fetch analyst dashboard.'
      );
    }
  }

  // Get Admin Dashboard Data
  async getAdminDashboard(): Promise<any> {
    try {
      const response = await api.get('/admin/dashboard');
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Failed to fetch admin dashboard.'
      );
    }
  }

  // Update User Profile
  async updateUserProfile(profileData: {
    username?: string;
    phoneNumber?: string;
    location?: string;
    company?: string;
    position?: string;
    bio?: string;
  }): Promise<UserProfile> {
    try {
      const response = await api.put('/user/profile', profileData);
      const updatedUser = response.data;
      
      // Update stored user data
      if (updatedUser) {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return updatedUser;
    } catch (error: any) {
      console.error('authService: updateUserProfile error:', error);
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to update profile.'
      );
    }
  }

  // Change password (for first-login users)
  async changePassword(email: string, oldPassword: string, newPassword: string): Promise<{ message: string }> {
    try {
      const response = await api.post('/auth/change-password', {
        email,
        oldPassword,
        newPassword
      });
      return response.data;
    } catch (error: any) {
      console.error('authService: changePassword error:', error);
      throw new Error(
        error.response?.data?.message ??
        error.response?.data?.error ??
        'Failed to change password.'
      );
    }
  }
}

export default new AuthService();
