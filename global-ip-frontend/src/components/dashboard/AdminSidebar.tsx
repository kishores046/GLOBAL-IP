import { LayoutDashboard, Users, Shield, Activity, Key, FileText, Database, Settings, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../../routes/routeConfig";

export function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine active item based on current route
  const getActiveItem = () => {
    if (location.pathname === ROUTES.ADMIN_DASHBOARD) return "dashboard";
    if (location.pathname === ROUTES.USER_MANAGEMENT) return "users";
    if (location.pathname === ROUTES.ROLE_REQUESTS) return "rbac";
    if (location.pathname === ROUTES.API_HEALTH) return "api-health";
    if (location.pathname === ROUTES.USAGE_LOGS) return "logs";
    if (location.pathname === ROUTES.API_KEYS) return "api-keys";
    if (location.pathname === ROUTES.DATA_SYNC) return "sync";
    if (location.pathname === ROUTES.ADMIN_SETTINGS) return "settings";
    return "dashboard";
  };
  
  const [activeItem, setActiveItem] = useState(getActiveItem());

  // Update active item when route changes
  useEffect(() => {
    setActiveItem(getActiveItem());
  }, [location.pathname]);

  const handleLogout = () => {
    // Clear any user data/tokens here if needed
    localStorage.removeItem("lastDashboard");
    localStorage.removeItem("userRole");
    localStorage.removeItem("authToken");
    navigate(ROUTES.LOGIN);
  };

  const handleNavigation = (itemId: string) => {
    setActiveItem(itemId);
    
    // Navigate to the appropriate route using ROUTES constants
    switch (itemId) {
      case "dashboard":
        navigate(ROUTES.ADMIN_DASHBOARD);
        break;
      case "users":
        navigate(ROUTES.USER_MANAGEMENT);
        break;
      case "rbac":
        navigate(ROUTES.ROLE_REQUESTS);
        break;
      case "api-health":
        navigate(ROUTES.API_HEALTH);
        break;
      case "logs":
        navigate(ROUTES.USAGE_LOGS);
        break;
      case "api-keys":
        navigate(ROUTES.API_KEYS);
        break;
      case "sync":
        navigate(ROUTES.DATA_SYNC);
        break;
      case "settings":
        navigate(ROUTES.ADMIN_SETTINGS);
        break;
      default:
        break;
    }
  };

  // Admin menu items
  const adminMenuItems = [
    { id: "dashboard", label: "Dashboard Overview", icon: LayoutDashboard },
    { id: "users", label: "User Management", icon: Users },
    { id: "rbac", label: "Role-Based Access Control", icon: Shield },
    { id: "api-health", label: "API Health Monitor", icon: Activity },
    { id: "logs", label: "System Logs", icon: FileText },
    { id: "api-keys", label: "API Key Settings", icon: Key },
    { id: "sync", label: "Trigger Data Sync", icon: Database },
    { id: "settings", label: "Admin Settings", icon: Settings },
  ];

  return (
    <aside className="w-72 bg-[#1e3a5f] border-r border-[#2d4a6f] h-screen sticky top-0 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-[#2d4a6f]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white text-lg leading-tight font-semibold">Admin Panel</h1>
            <p className="text-purple-200 text-xs">System Management</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {adminMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                isActive
                  ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg"
                  : "text-blue-100 hover:bg-[#2d4a6f] hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Admin Info Card */}
      <div className="p-4 border-t border-[#2d4a6f]">
        <div className="mb-3 p-3 bg-purple-900/30 rounded-lg border border-purple-500/30">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-purple-200">System Status</span>
          </div>
          <p className="text-white text-sm font-semibold">All Systems Operational</p>
        </div>
        
        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-950 hover:text-red-300 rounded-lg transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
