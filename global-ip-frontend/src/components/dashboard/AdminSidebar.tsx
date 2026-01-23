import { LayoutDashboard, Users, Shield, Activity, Key, LogOut, LineChart, AlertTriangle, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../routes/routeConfig";
import { toast } from "sonner";

export function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['monitoring']); // Monitoring Hub expanded by default
  
  // Determine active item based on current route
  const getActiveItem = () => {
    if (location.pathname === ROUTES.ADMIN_DASHBOARD) return "dashboard";
    if (location.pathname === ROUTES.ADMIN_OVERVIEW) return "overview";
    if (location.pathname === ROUTES.ADMIN_API_HEALTH) return "monitoring-health";
    if (location.pathname === ROUTES.ADMIN_SYSTEM_LOGS) return "monitoring-logs";
    if (location.pathname === ROUTES.ADMIN_ERROR_SUMMARY) return "monitoring-errors";
    if (location.pathname === ROUTES.USER_MANAGEMENT) return "users";
    if (location.pathname === ROUTES.ROLE_REQUESTS) return "rbac";
    if (location.pathname === ROUTES.API_KEYS) return "api-keys";
    return "dashboard";
  };
  
  const [activeItem, setActiveItem] = useState(getActiveItem());

  // Update active item when route changes
  useEffect(() => {
    setActiveItem(getActiveItem());
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      toast.success('Logged out successfully');
      navigate(ROUTES.LOGIN, { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed, clearing session anyway');
      // Clear local state and redirect anyway
      localStorage.removeItem("lastDashboard");
      localStorage.removeItem("userRole");
      localStorage.removeItem("authToken");
      navigate(ROUTES.LOGIN, { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleNavigation = (itemId: string) => {
    setActiveItem(itemId);
    
    // Navigate to the appropriate route using ROUTES constants
    switch (itemId) {
      case "dashboard":
        navigate(ROUTES.ADMIN_DASHBOARD);
        break;
      case "overview":
        navigate(ROUTES.ADMIN_OVERVIEW);
        break;
      case "monitoring-health":
        navigate(ROUTES.ADMIN_API_HEALTH);
        break;
      case "monitoring-logs":
        navigate(ROUTES.ADMIN_SYSTEM_LOGS);
        break;
      case "monitoring-errors":
        navigate(ROUTES.ADMIN_ERROR_SUMMARY);
        break;
      case "users":
        navigate(ROUTES.USER_MANAGEMENT);
        break;
      case "rbac":
        navigate(ROUTES.ROLE_REQUESTS);
        break;
      case "api-keys":
        navigate(ROUTES.API_KEYS);
        break;
      default:
        break;
    }
  };

  const toggleMenuExpand = (itemId: string) => {
    setExpandedMenus(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const adminMenuItems = [
    { id: "dashboard", label: "Dashboard Overview", icon: LayoutDashboard },
    { 
      id: "monitoring", 
      label: "Monitoring Hub", 
      icon: LineChart,
      submenu: [
        { id: "overview", label: "System Overview", icon: LayoutDashboard },
        { id: "monitoring-health", label: "API Health Status", icon: Activity },
        { id: "monitoring-logs", label: "Usage Logs", icon: FileText },
        { id: "monitoring-errors", label: "Error Analytics", icon: AlertTriangle },
      ]
    },
    { id: "users", label: "User Management", icon: Users },
    { id: "rbac", label: "Role-Based Access Control", icon: Shield },
    { id: "api-keys", label: "API Key Settings", icon: Key },
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
          
          // Check if this is a menu item with submenu
          if ('submenu' in item) {
            const hasActiveSubmenu = item.submenu?.some(sub => activeItem === sub.id);
            const isExpanded = expandedMenus.includes(item.id);
            
            return (
              <div key={item.id} className="space-y-1">
                <button
                  onClick={() => toggleMenuExpand(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all text-left ${
                    hasActiveSubmenu
                      ? "bg-purple-900/50 text-white"
                      : "text-blue-100 hover:bg-[#2d4a6f] hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-semibold">{item.label}</span>
                  </div>
                  <span className={`text-xs transition-transform ${isExpanded ? 'rotate-90' : ''}`}>▶</span>
                </button>
                
                {/* Submenu Items */}
                {isExpanded && (
                  <div className="ml-4 space-y-1 border-l-2 border-purple-500/30 pl-2">
                    {item.submenu?.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const isSubActive = activeItem === subItem.id;
                      
                      return (
                        <button
                          key={subItem.id}
                          onClick={() => handleNavigation(subItem.id)}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-left ${
                            isSubActive
                              ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg"
                              : "text-blue-100 hover:bg-[#2d4a6f] hover:text-white"
                          }`}
                        >
                          <SubIcon className="w-4 h-4 flex-shrink-0" />
                          <span className="text-sm">{subItem.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }
          
          // Regular menu item without submenu
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
          disabled={isLoggingOut}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-950 hover:text-red-300 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className="w-5 h-5" />
          <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
        </button>
      </div>
    </aside>
  );
}
