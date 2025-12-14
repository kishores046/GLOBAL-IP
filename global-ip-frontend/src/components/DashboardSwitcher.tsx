import { LayoutDashboard, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES, ROLES } from "../routes/routeConfig";

interface Dashboard {
  role: string;
  label: string;
  path: string;
  description: string;
}

export function DashboardSwitcher() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { hasRole } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Determine available dashboards based on roles
  const availableDashboards: Dashboard[] = [];
  
  if (hasRole(ROLES.ADMIN)) {
    availableDashboards.push({
      role: ROLES.ADMIN,
      label: "Admin Dashboard",
      path: ROUTES.ADMIN_DASHBOARD,
      description: "System management & controls"
    });
  }
  
  if (hasRole(ROLES.ANALYST)) {
    availableDashboards.push({
      role: ROLES.ANALYST,
      label: "Analyst Dashboard",
      path: ROUTES.ANALYST_DASHBOARD,
      description: "Advanced analytics & insights"
    });
  }
  
  if (hasRole(ROLES.USER)) {
    availableDashboards.push({
      role: ROLES.USER,
      label: "User Dashboard",
      path: ROUTES.USER_DASHBOARD,
      description: "IP search & tracking"
    });
  }

  // Don't show switcher if user has only one role
  if (availableDashboards.length <= 1) {
    return null;
  }

  // Determine current dashboard based on path
  const getCurrentDashboard = (): Dashboard | undefined => {
    if (location.pathname.startsWith('/admin') || location.pathname.includes('/dashboard/admin')) {
      return availableDashboards.find(d => d.role === ROLES.ADMIN);
    }
    if (location.pathname.startsWith('/analyst') || location.pathname.includes('/dashboard/analyst')) {
      return availableDashboards.find(d => d.role === ROLES.ANALYST);
    }
    if (location.pathname.startsWith('/user') || location.pathname.includes('/dashboard/user')) {
      return availableDashboards.find(d => d.role === ROLES.USER);
    }
    return availableDashboards[0]; // Default to first available
  };

  const currentDashboard = getCurrentDashboard();

  const handleDashboardSwitch = (path: string) => {
    setShowDropdown(false);
    navigate(path);
  };

  const getDashboardBgColor = (dashboard: Dashboard, isActive: boolean): string => {
    if (isActive) return 'bg-blue-500';
    if (dashboard.role === ROLES.ADMIN) return 'bg-purple-500';
    if (dashboard.role === ROLES.ANALYST) return 'bg-green-500';
    return 'bg-blue-500';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 rounded-lg transition-all shadow-sm"
      >
        <LayoutDashboard className="w-5 h-5 text-blue-600" />
        <span className="text-slate-700 font-medium hidden md:inline">
          {currentDashboard?.label ?? "Dashboard"}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden z-50">
          <div className="p-3 border-b border-slate-200 bg-slate-50">
            <p className="text-sm text-slate-600">Switch Dashboard</p>
          </div>
          
          <div className="py-2">
            {availableDashboards.map((dashboard) => {
              const isActive = currentDashboard?.role === dashboard.role;
              
              return (
                <button
                  key={dashboard.role}
                  onClick={() => handleDashboardSwitch(dashboard.path)}
                  disabled={isActive}
                  className={`w-full text-left px-4 py-3 transition-all ${
                    isActive
                      ? 'bg-blue-50 cursor-default'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getDashboardBgColor(dashboard, isActive)}`}>
                      <LayoutDashboard className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium ${
                        isActive ? 'text-blue-900' : 'text-slate-900'
                      }`}>
                        {dashboard.label}
                        {isActive && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-slate-500">
                        {dashboard.description}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-3 border-t border-slate-200 bg-slate-50">
            <p className="text-xs text-slate-500">
              You have access to {availableDashboards.length} dashboard{availableDashboards.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
