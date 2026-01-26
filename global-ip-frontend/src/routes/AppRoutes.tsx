import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { PrivateRoute } from '../components/PrivateRoute';
import { RoleRoute } from '../components/RoleRoute';
import { ROUTES, ROLES } from './routeConfig';
import AnalystLayout from '../components/dashboard/AnalystLayout';

// Lazy load pages for better performance
// Public Pages
const HomePage = lazy(() => import('../pages/HomePage').then(m => ({ default: m.HomePage })));
const LoginPage = lazy(() => import('../pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegistrationPage = lazy(() => import('../pages/RegistrationPage').then(m => ({ default: m.RegistrationPage })));
const ForgotPasswordPage = lazy(() => import('../pages/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const ChangePasswordPage = lazy(() => import('../pages/ChangePasswordPage').then(m => ({ default: m.ChangePasswordPage })));
const OAuthSuccessPage = lazy(() => import('../pages/OAuthSuccessPage').then(m => ({ default: m.OAuthSuccessPage })));
const UnauthorizedPage = lazy(() => import('../pages/UnauthorizedPage').then(m => ({ default: m.UnauthorizedPage })));

// User Pages
const UserDashboard = lazy(() => import('../pages/UserDashboard').then(m => ({ default: m.UserDashboard })));
const RequestAdminPage = lazy(() => import('../pages/RequestAdminPage').then(m => ({ default: m.RequestAdminPage })));
const FilingTrackerPage = lazy(() => import('../pages/FilingTrackerPage').then(m => ({ default: m.FilingTrackerPage })));
const PortfolioTrackerPage = lazy(() => import('../pages/PortfolioTrackerPage').then(m => ({ default: m.PortfolioTrackerPage })));
const SubscriptionsPage = lazy(() => import('../pages/SubscriptionsPage').then(m => ({ default: m.SubscriptionsPage })));
const CreateSubscriptionPage = lazy(() => import('../pages/CreateSubscriptionPage').then(m => ({ default: m.CreateSubscriptionPage })));
const AlertsPage = lazy(() => import('../pages/AlertsPage').then(m => ({ default: m.AlertsPage })));
const ProfilePage = lazy(() => import('../pages/ProfilePage').then(m => ({ default: m.ProfilePage })));

// Analyst Pages
const AnalystDashboard = lazy(() => import('../pages/AnalystDashboard').then(m => ({ default: m.AnalystDashboard })));
const AnalystSubscriptionsPage = lazy(() => import('../pages/AnalystSubscriptionsPage').then(m => ({ default: m.AnalystSubscriptionsPage })));
const AdvancedSearchPage = lazy(() => import('../pages/AdvancedSearchPage').then(m => ({ default: m.AdvancedSearchPage })));

// Competitor Tracking Pages
const CompetitorsPage = lazy(() => import('../pages/competitors/CompetitorsPage').then(m => ({ default: m.CompetitorsPage })));
const CompetitorDetailPage = lazy(() => import('../pages/competitors/CompetitorDetailPage').then(m => ({ default: m.CompetitorDetailPage })));
const CompetitorFilingsPage = lazy(() => import('../pages/competitors/CompetitorFilingsPage').then(m => ({ default: m.CompetitorFilingsPage })));
const CompetitorSyncPage = lazy(() => import('../pages/competitors/CompetitorSyncPage').then(m => ({ default: m.CompetitorSyncPage })));
const CompetitorAnalyticsPage = lazy(() => import('../pages/competitors/CompetitorAnalyticsPage').then(m => ({ default: m.CompetitorAnalyticsPage })));

const VisualizationEnginePage = lazy(() => import('../pages/VisualizationEnginePage').then(m => ({ default: m.VisualizationEnginePage })));
const CitationGraphPage = lazy(() => import('../pages/CitationGraphPage').then(m => ({ default: m.CitationGraphPage })));
const ExportToolsPage = lazy(() => import('../pages/ExportToolsPage').then(m => ({ default: m.ExportToolsPage })));
const PatentTrendAnalysisPage = lazy(() => import('../pages/PatentTrendAnalysisPage').then(m => ({ default: m.PatentTrendAnalysisDashboard })));
const TrademarkTrendAnalysisPage = lazy(() => import('../pages/TrademarkTrendAnalysisPage').then(m => ({ default: m.default })));
const PatentLifecyclePage = lazy(() => import('../pages/PatentLifecyclePage').then(m => ({ default: m.PatentLifecyclePage })));
const TrademarkLifecyclePage = lazy(() => import('../pages/TrademarkLifecyclePage').then(m => ({ default: m.TrademarkLifecyclePage })));
const PatentTrackingPage = lazy(() => import('../pages/PatentTrackingPage').then(m => ({ default: m.PatentTrackingPage })));
const TrackedPatentsPage = lazy(() => import('../pages/TrackedPatentsPage').then(m => ({ default: m.TrackedPatentsPage })));
const MonitoringPage = lazy(() => import('../pages/MonitoringPage').then(m => ({ default: m.default })));

// Admin Pages
const AdminDashboard = lazy(() => import('../pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminDashboardOverview = lazy(() => import('../pages/admin/AdminDashboardOverview').then(m => ({ default: m.AdminDashboardOverview })));
const AdminAPIHealthMonitor = lazy(() => import('../pages/admin/AdminAPIHealthMonitor').then(m => ({ default: m.AdminAPIHealthMonitor })));
const AdminSystemLogs = lazy(() => import('../pages/admin/AdminSystemLogs').then(m => ({ default: m.AdminSystemLogs })));
const AdminErrorSummary = lazy(() => import('../pages/admin/AdminErrorSummary').then(m => ({ default: m.AdminErrorSummary })));
const AdminUserManagementPage = lazy(() => import('../pages/AdminUserManagementPage').then(m => ({ default: m.AdminUserManagementPage })));
const AdminRoleRequestsPage = lazy(() => import('../pages/AdminRoleRequestsPage').then(m => ({ default: m.AdminRoleRequestsPage })));
const AdminAPIKeySettingsPage = lazy(() => import('../pages/AdminAPIKeySettingsPage').then(m => ({ default: m.AdminAPIKeySettingsPage })));
const AdminAPIKeyManagementPage = lazy(() => import('../pages/AdminAPIKeyManagementPage').then(m => ({ default: m.AdminAPIKeyManagementPage })));
const AdminSettingsPage = lazy(() => import('../pages/AdminSettingsPage').then(m => ({ default: m.AdminSettingsPage })));

// Shared Pages
const GlobalIPSearchPage = lazy(() => import('../pages/GlobalIPSearchPage').then(m => ({ default: m.GlobalIPSearchPage })));
const UnifiedSearchResultsPage = lazy(() => import('../pages/UnifiedSearchResultsPage').then(m => ({ default: m.UnifiedSearchResultsPage })));
const PatentDetailPage = lazy(() => import('../pages/PatentDetailPage').then(m => ({ default: m.PatentDetailPage })));
const TrademarkDetailPage = lazy(() => import('../pages/TrademarkDetailPage').then(m => ({ default: m.TrademarkDetailPage })));
const SettingsPage = lazy(() => import('../pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const ApiKeySettingsPage = lazy(() => import('../pages/ApiKeySettingsPage').then(m => ({ default: m.ApiKeySettingsPage })));

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
        <Route path={ROUTES.CHANGE_PASSWORD} element={<ChangePasswordPage />} />
        <Route path={ROUTES.OAUTH_SUCCESS} element={<OAuthSuccessPage />} />
        <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />

        {/* ==================== ADMIN ROUTES (ADMIN only) ==================== */}
        <Route 
          path={ROUTES.ADMIN_DASHBOARD} 
          element={<RoleRoute roles={[ROLES.ADMIN]} element={<AdminDashboard />} />} 
        />
        {/* New Admin Monitoring Dashboard Routes */}
        <Route 
          path={ROUTES.ADMIN_OVERVIEW} 
          element={<RoleRoute roles={[ROLES.ADMIN]} element={<AdminDashboardOverview />} />} 
        />
        <Route 
          path={ROUTES.ADMIN_API_HEALTH} 
          element={<RoleRoute roles={[ROLES.ADMIN]} element={<AdminAPIHealthMonitor />} />} 
        />
        <Route 
          path={ROUTES.ADMIN_SYSTEM_LOGS} 
          element={<RoleRoute roles={[ROLES.ADMIN]} element={<AdminSystemLogs />} />} 
        />
        <Route 
          path={ROUTES.ADMIN_ERROR_SUMMARY} 
          element={<RoleRoute roles={[ROLES.ADMIN]} element={<AdminErrorSummary />} />} 
        />
        {/* Existing Admin Routes */}
        <Route 
          path={ROUTES.USER_MANAGEMENT} 
          element={<RoleRoute roles={[ROLES.ADMIN]} element={<AdminUserManagementPage />} />} 
        />
        <Route 
          path={ROUTES.ROLE_REQUESTS} 
          element={<RoleRoute roles={[ROLES.ADMIN]} element={<AdminRoleRequestsPage />} />} 
        />
        <Route 
          path={ROUTES.API_KEYS} 
          element={<RoleRoute roles={[ROLES.ADMIN]} element={<AdminAPIKeyManagementPage />} />} 
        />
        <Route 
          path={ROUTES.ADMIN_SETTINGS} 
          element={<RoleRoute roles={[ROLES.ADMIN]} element={<AdminSettingsPage />} />} 
        />

        {/* ==================== ANALYST ROUTES (ANALYST + ADMIN) - single layout wrapper ==================== */}
        <Route element={<RoleRoute roles={[ROLES.ANALYST, ROLES.ADMIN]} element={<AnalystLayout />} />}>
          <Route path={ROUTES.ANALYST_DASHBOARD} element={<AnalystDashboard />} />

          {/* Competitor Tracking Routes */}
          <Route path={ROUTES.COMPETITORS} element={<CompetitorsPage />} />
          <Route path={ROUTES.COMPETITOR_ANALYTICS} element={<CompetitorAnalyticsPage />} />
          <Route path={ROUTES.COMPETITOR_DETAIL} element={<CompetitorDetailPage />} />
          <Route path={ROUTES.COMPETITOR_FILINGS} element={<CompetitorFilingsPage />} />
          <Route path={ROUTES.COMPETITOR_SYNC} element={<CompetitorSyncPage />} />

          <Route path={ROUTES.ADVANCED_SEARCH} element={<AdvancedSearchPage />} />
          <Route path={ROUTES.VISUALIZATION_ENGINE} element={<VisualizationEnginePage />} />
          <Route path={ROUTES.EXPORT_TOOLS} element={<ExportToolsPage />} />
          <Route path={ROUTES.ANALYST_PROFILE} element={<ProfilePage />} />
          <Route path={ROUTES.ANALYST_API_KEYS_SETTINGS} element={<ApiKeySettingsPage />} />
          <Route path={ROUTES.PATENT_TRENDS} element={<PatentTrendAnalysisPage />} />
          <Route path={ROUTES.TRADEMARK_TRENDS} element={<TrademarkTrendAnalysisPage />} />
          <Route path={ROUTES.PATENT_LIFECYCLE} element={<PatentLifecyclePage />} />
          <Route path={ROUTES.TRADEMARK_LIFECYCLE} element={<TrademarkLifecyclePage />} />
          <Route path={ROUTES.TRACKED_PATENTS} element={<TrackedPatentsPage />} />
          <Route path={ROUTES.ANALYST_ALERTS} element={<AlertsPage />} />
          <Route path={ROUTES.MONITORING} element={<MonitoringPage />} />

          <Route path={ROUTES.ANALYST_SUBSCRIPTIONS} element={<AnalystSubscriptionsPage />} />
          <Route path={ROUTES.ANALYST_CREATE_SUBSCRIPTION} element={<CreateSubscriptionPage />} />
        </Route>

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
          path={ROUTES.CREATE_SUBSCRIPTION} 
          element={<RoleRoute roles={[ROLES.USER, ROLES.ANALYST, ROLES.ADMIN]} element={<CreateSubscriptionPage />} />} 
        />
        <Route 
          path={ROUTES.ANALYST_CREATE_SUBSCRIPTION} 
          element={<RoleRoute roles={[ROLES.ANALYST, ROLES.ADMIN]} element={<CreateSubscriptionPage />} />} 
        />
        <Route 
          path={ROUTES.ANALYST_SUBSCRIPTIONS} 
          element={<RoleRoute roles={[ROLES.ANALYST, ROLES.ADMIN]} element={<AnalystSubscriptionsPage />} />} 
        />
        <Route 
          path={ROUTES.ALERTS} 
          element={<PrivateRoute><AlertsPage /></PrivateRoute>} 
        />
        <Route 
          path={ROUTES.PROFILE} 
          element={<PrivateRoute><ProfilePage /></PrivateRoute>} 
        />

        {/* USER-SPECIFIC TRACKING ROUTES */}
        <Route 
          path={ROUTES.USER_TRACKED_PATENTS} 
          element={<RoleRoute roles={[ROLES.USER]} element={<TrackedPatentsPage />} />} 
        />
        <Route 
          path={ROUTES.USER_VISUALIZATION_ENGINE} 
          element={<RoleRoute roles={[ROLES.USER]} element={<VisualizationEnginePage />} />} 
        />
        <Route 
          path={ROUTES.USER_CITATION_GRAPH} 
          element={<RoleRoute roles={[ROLES.USER]} element={<CitationGraphPage />} />} 
        />
        <Route 
          path={ROUTES.USER_PATENT_LIFECYCLE} 
          element={<RoleRoute roles={[ROLES.USER]} element={<PatentLifecyclePage />} />} 
        />
        <Route 
          path={ROUTES.USER_TRADEMARK_LIFECYCLE} 
          element={<RoleRoute roles={[ROLES.USER]} element={<TrademarkLifecyclePage />} />} 
        />

        {/* ==================== SHARED ROUTES (ALL authenticated users) ==================== */}
        <Route 
          path={ROUTES.IP_SEARCH} 
          element={<PrivateRoute><GlobalIPSearchPage /></PrivateRoute>} 
        />
        <Route 
          path={ROUTES.SEARCH_RESULTS} 
          element={<PrivateRoute><UnifiedSearchResultsPage /></PrivateRoute>} 
        />
        <Route 
          path={ROUTES.PATENT_DETAIL} 
          element={<PrivateRoute><PatentDetailPage /></PrivateRoute>} 
        />
        <Route 
          path={ROUTES.PATENT_TRACKING} 
          element={<PrivateRoute><PatentTrackingPage /></PrivateRoute>} 
        />
        <Route 
          path={ROUTES.TRADEMARK_DETAIL} 
          element={<PrivateRoute><TrademarkDetailPage /></PrivateRoute>} 
        />
        <Route 
          path={ROUTES.SETTINGS} 
          element={<PrivateRoute><SettingsPage /></PrivateRoute>} 
        />
        <Route 
          path={ROUTES.API_KEYS_SETTINGS} 
          element={<RoleRoute roles={[ROLES.USER, ROLES.ANALYST, ROLES.ADMIN]} element={<ApiKeySettingsPage />} />} 
        />

        {/* ==================== 404 NOT FOUND ==================== */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </Suspense>
  );
}
