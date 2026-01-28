import { Bell, ChevronDown, User, Globe, LayoutDashboard } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate} from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROUTES, ROLES } from "../../routes/routeConfig";
import { useLocation } from "react-router-dom";

interface DashboardHeaderProps {
  readonly userName: string;
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { hasRole } = useAuth();

  // Determine available dashboards based on roles
  interface Dashboard {
    role: string;
    label: string;
    path: string;
  }

  const availableDashboards: Dashboard[] = [];
  
  if (hasRole(ROLES.ADMIN)) {
    availableDashboards.push({
      role: ROLES.ADMIN,
      label: "Admin Dashboard",
      path: ROUTES.ADMIN_DASHBOARD,
    });
  }
  
  if (hasRole(ROLES.ANALYST)) {
    availableDashboards.push({
      role: ROLES.ANALYST,
      label: "Analyst Dashboard",
      path: ROUTES.ANALYST_DASHBOARD,
    });
  }
  
  if (hasRole(ROLES.USER)) {
    availableDashboards.push({
      role: ROLES.USER,
      label: "User Dashboard",
      path: ROUTES.USER_DASHBOARD,
    });
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowDropdown(false);
    navigate("/login");
  };

  // State for notifications - starts empty, will be populated by dashboard alerts if available
  const [notifications] = useState<any[]>([]);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
            <Globe className="w-7 h-7 text-white" />
          </div>
          <div>
            <span className="text-blue-900 text-xl block">IPIntel</span>
            <span className="text-slate-500 text-xs">Intelligence Platform</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Welcome Message */}
          <div className="hidden md:block text-slate-600">
            Welcome, <span className="text-blue-900">{userName}</span>
          </div>

          {/* Theme Toggle removed per request */}

          {/* Notification Bell */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-all relative"
            >
              <Bell className="w-6 h-6 text-slate-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50">
                  <h3 className="text-slate-900">Notifications</h3>
                  <p className="text-sm text-slate-600">{unreadCount} unread notifications</p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-slate-100 hover:bg-slate-50 transition-all cursor-pointer ${
                          notification.unread ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${notification.unread ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                          <div className="flex-1">
                            <p className="text-slate-900 text-sm">{notification.message}</p>
                            <p className="text-xs text-slate-500 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-slate-500">
                      <p className="text-sm">No notifications yet</p>
                      <p className="text-xs text-slate-400 mt-1">Dashboard alerts will appear here</p>
                    </div>
                  )}
                </div>
                <div className="p-3 border-t border-slate-200 bg-slate-50">
                  <button 
                    onClick={() => {
                      setShowNotifications(false);
                      navigate("/alerts");
                    }}
                    className="w-full text-center text-sm text-blue-600 hover:text-blue-700 transition-all"
                  >
                    View all alerts
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded-lg transition-all cursor-pointer border border-slate-200 bg-white"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-600 transition-all ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden z-50">
                <div className="p-2">
                  {/* Role Switcher - Only show if user has multiple roles */}
                  {availableDashboards.length > 1 && (
                    <>
                      <div className="px-4 py-2 text-xs text-slate-500 font-semibold uppercase tracking-wide">Switch Dashboard</div>
                      {availableDashboards.map((dashboard) => {
                        const isActive = location.pathname.toLowerCase().includes(dashboard.role.toLowerCase()) || 
                                       (dashboard.role === ROLES.USER && location.pathname.includes('/dashboard/user'));
                        return (
                          <button
                            key={dashboard.role}
                            onClick={() => {
                              setShowDropdown(false);
                              navigate(dashboard.path);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left mb-1 ${
                              isActive
                                ? 'bg-blue-50 text-blue-700 font-medium'
                                : 'text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            <span className="text-sm">{dashboard.label}</span>
                            {isActive && <span className="ml-auto text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded">Active</span>}
                          </button>
                        );
                      })}
                      <div className="border-t border-slate-200 my-2"></div>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all text-left"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}