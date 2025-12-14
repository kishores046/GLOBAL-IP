import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { PrivateRoute } from '../components/PrivateRoute';
import { RoleRoute } from '../components/RoleRoute';
import { RequireRole } from '../components/RequireRole';
import { ROUTES, ROLES } from './routeConfig';

// Lazy load pages for better performance
// Public Pages
const HomePage = lazy(() => import('../pages/HomePage').then(m => ({ default: m.HomePage })));
const LoginPage = lazy(() => import('../pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegistrationPage = lazy(() => import('../pages/RegistrationPage').then(m => ({ default: m.RegistrationPage })));
const ForgotPasswordPage = lazy(() => import('../pages/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const OAuthSuccessPage = lazy(() => import('../pages/OAuthSuccessPage').then(m => ({ default: m.OAuthSuccessPage })));
const UnauthorizedPage = lazy(() => import('../pages/UnauthorizedPage').then(m => ({ default: m.UnauthorizedPage })));

// User Pages
const UserDashboard = lazy(() => import('../pages/UserDashboard').then(m => ({ default: m.UserDashboard })));
const RequestAdminPage = lazy(() => import('../pages/RequestAdminPage').then(m => ({ default: m.RequestAdminPage })));
const FilingTrackerPage = lazy(() => import('../pages/FilingTrackerPage').then(m => ({ default: m.FilingTrackerPage })));
const PortfolioTrackerPage = lazy(() => import('../pages/PortfolioTrackerPage').then(m => ({ default: m.PortfolioTrackerPage })));
const SubscriptionsPage = lazy(() => import('../pages/SubscriptionsPage').then(m => ({ default: m.SubscriptionsPage })));
const AlertsPage = lazy(() => import('../pages/AlertsPage').then(m => ({ default: m.AlertsPage })));
const ProfilePage = lazy(() => import('../pages/ProfilePage').then(m => ({ default: m.ProfilePage })));

// Analyst Pages
const AnalystDashboard = lazy(() => import('../pages/AnalystDashboard').then(m => ({ default: m.AnalystDashboard })));
const CompetitorAnalyticsPage = lazy(() => import('../pages/CompetitorAnalyticsPage').then(m => ({ default: m.CompetitorAnalyticsPage })));
const AdvancedSearchPage = lazy(() => import('../pages/AdvancedSearchPage').then(m => ({ default: m.AdvancedSearchPage })));
const VisualizationEnginePage = lazy(() => import('../pages/VisualizationEnginePage').then(m => ({ default: m.VisualizationEnginePage })));
const ExportToolsPage = lazy(() => import('../pages/ExportToolsPage').then(m => ({ default: m.ExportToolsPage })));

// Admin Pages
const AdminDashboard = lazy(() => import('../pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminUserManagementPage = lazy(() => import('../pages/AdminUserManagementPage').then(m => ({ default: m.AdminUserManagementPage })));
const AdminRoleRequestsPage = lazy(() => import('../pages/AdminRoleRequestsPage').then(m => ({ default: m.AdminRoleRequestsPage })));
const AdminAPIHealthPage = lazy(() => import('../pages/AdminAPIHealthPage').then(m => ({ default: m.AdminAPIHealthPage })));
const AdminAPIKeySettingsPage = lazy(() => import('../pages/AdminAPIKeySettingsPage').then(m => ({ default: m.AdminAPIKeySettingsPage })));
const AdminUsageLogsPage = lazy(() => import('../pages/AdminUsageLogsPage').then(m => ({ default: m.AdminUsageLogsPage })));
const AdminDataSyncPage = lazy(() => import('../pages/AdminDataSyncPage').then(m => ({ default: m.AdminDataSyncPage })));
const AdminSettingsPage = lazy(() => import('../pages/AdminSettingsPage').then(m => ({ default: m.AdminSettingsPage })));

// Shared Pages
const GlobalIPSearchPage = lazy(() => import('../pages/GlobalIPSearchPage').then(m => ({ default: m.GlobalIPSearchPage })));
const SettingsPage = lazy(() => import('../pages/SettingsPage').then(m => ({ default: m.SettingsPage })));

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
      <p className="text-slate-600">Loading...</p>
    </div>
  </div>
);

export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* ==================== PUBLIC ROUTES ==================== */}
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegistrationPage />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        <Route path={ROUTES.OAUTH_SUCCESS} element={<OAuthSuccessPage />} />
        <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />

        {/* ==================== ADMIN ROUTES (ADMIN only) ==================== */}
        <Route 
          path={ROUTES.ADMIN_DASHBOARD} 
          element={<RoleRoute roles={[ROLES.ADMIN]} element={<AdminDashboard />} />} 
        />
        <Route 
          path={ROUTES.USER_MANAGEMENT} 
          element={<RoleRoute roles={[ROLES.ADMIN]} element={<AdminUserManagementPage />} />} 
        />
        <Route 
          path={ROUTES.ROLE_REQUESTS} 
          element={<RoleRoute roles={[ROLES.ADMIN]} element={<AdminRoleRequestsPage />} />} 
        />
        <Route 
          path={ROUTES.API_HEALTH} 
          element={<RoleRoute roles={[ROLES.ADMIN]} element={<AdminAPIHealthPage />} />} 
        />
        <Route 
          path={ROUTES.API_KEYS} 
          element={<RoleRoute roles={[ROLES.ADMIN]} element={<AdminAPIKeySettingsPage />} />} 
        />
        <Route 
          path={ROUTES.USAGE_LOGS} 
          element={<RoleRoute roles={[ROLES.ADMIN]} element={<AdminUsageLogsPage />} />} 
        />
        <Route 
          path={ROUTES.DATA_SYNC} 
          element={<RoleRoute roles={[ROLES.ADMIN]} element={<AdminDataSyncPage />} />} 
        />
        <Route 
          path={ROUTES.ADMIN_SETTINGS} 
          element={<RoleRoute roles={[ROLES.ADMIN]} element={<AdminSettingsPage />} />} 
        />

        {/* ==================== ANALYST ROUTES (ANALYST + ADMIN) ==================== */}
        <Route 
          path={ROUTES.ANALYST_DASHBOARD} 
          element={<RoleRoute roles={[ROLES.ANALYST, ROLES.ADMIN]} element={<AnalystDashboard />} />} 
        />
        <Route 
          path={ROUTES.COMPETITOR_ANALYTICS} 
          element={<RoleRoute roles={[ROLES.ANALYST, ROLES.ADMIN]} element={<CompetitorAnalyticsPage />} />} 
        />
        <Route 
          path={ROUTES.ADVANCED_SEARCH} 
          element={<RoleRoute roles={[ROLES.ANALYST, ROLES.ADMIN]} element={<AdvancedSearchPage />} />} 
        />
        <Route 
          path={ROUTES.VISUALIZATION_ENGINE} 
          element={<RoleRoute roles={[ROLES.ANALYST, ROLES.ADMIN]} element={<VisualizationEnginePage />} />} 
        />
        <Route 
          path={ROUTES.EXPORT_TOOLS} 
          element={<RoleRoute roles={[ROLES.ANALYST, ROLES.ADMIN]} element={<ExportToolsPage />} />} 
        />

        {/* ==================== USER ROUTES (ALL authenticated users) ==================== */}
        <Route 
          path={ROUTES.USER_DASHBOARD} 
          element={<RoleRoute roles={[ROLES.USER, ROLES.ANALYST, ROLES.ADMIN]} element={<UserDashboard />} />} 
        />
        <Route 
          path={ROUTES.REQUEST_ADMIN} 
          element={<RoleRoute roles={[ROLES.USER]} element={<RequestAdminPage />} />} 
        />
        <Route 
          path={ROUTES.FILING_TRACKER} 
          element={<PrivateRoute><FilingTrackerPage /></PrivateRoute>} 
        />
        <Route 
          path={ROUTES.PORTFOLIO_TRACKER} 
          element={<PrivateRoute><PortfolioTrackerPage /></PrivateRoute>} 
        />
        <Route 
          path={ROUTES.SUBSCRIPTIONS} 
          element={<PrivateRoute><SubscriptionsPage /></PrivateRoute>} 
        />
        <Route 
          path={ROUTES.ALERTS} 
          element={<PrivateRoute><AlertsPage /></PrivateRoute>} 
        />
        <Route 
          path={ROUTES.PROFILE} 
          element={<PrivateRoute><ProfilePage /></PrivateRoute>} 
        />

        {/* ==================== SHARED ROUTES (ALL authenticated users) ==================== */}
        <Route 
          path={ROUTES.IP_SEARCH} 
          element={<PrivateRoute><GlobalIPSearchPage /></PrivateRoute>} 
        />
        <Route 
          path={ROUTES.SETTINGS} 
          element={<PrivateRoute><SettingsPage /></PrivateRoute>} 
        />

        {/* ==================== 404 NOT FOUND ==================== */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </Suspense>
  );
}
