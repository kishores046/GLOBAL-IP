import { LayoutDashboard, Search, Bookmark, Bell, LogOut, BarChart3, Network, Users, User, Radio, Key, Plus, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROUTES, ROLES } from "../../routes/routeConfig";

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasRole } = useAuth();
  
  // Determine if user is an analyst - check localStorage first, then pathname
  const [isAnalyst, setIsAnalyst] = useState(() => {
    const storedRole = localStorage.getItem("userRole");
    return storedRole === "analyst" || location.pathname.includes("/analyst") || location.pathname.includes("/dashboard/analyst");
  });

  // Update isAnalyst state and localStorage when on analyst dashboard
  useEffect(() => {
    if (location.pathname.includes("/dashboard/analyst")) {
      setIsAnalyst(true);
      localStorage.setItem("userRole", "analyst");
    } else if (location.pathname.includes("/dashboard/user")) {
      setIsAnalyst(false);
      localStorage.setItem("userRole", "user");
    }
  }, [location.pathname]);
  
  // Route matching helper
  const matchRoute = (pathname: string, pattern: string): boolean => pathname.includes(pattern);
  
  // Route match patterns
  const routePatterns: Record<string, string[]> = {
    'advanced-search': ['/analyst/advanced-search'],
    'visualization': ['/analyst/visualization'],
    'patent-trends': ['/analyst/trends/patents'],
    'trademark-trends': ['/analyst/trends/trademarks'],
    'patent-lifecycle': ['/analyst/lifecycle/patents'],
    'trademark-lifecycle': ['/analyst/lifecycle/trademarks'],
    'competitor-analytics': ['/competitors/analytics'],
    'competitor-management': ['/competitors'],
    'create-subscription': ['/user/subscriptions/create'],
    'subscriptions': ['/user/subscriptions'],
    'tracker': ['/user/filing-tracker'],
    'alerts': ['/user/alerts'],
    'profile': ['/user/profile'],
    'api-keys': ['/settings/api-keys'],
    'settings': ['/settings'],
    'search': ['/search'],
  };
  
  // Determine active item based on current route
  const getActiveItem = (): string => {
    const pathname = location.pathname;
    for (const [route, patterns] of Object.entries(routePatterns)) {
      if (patterns.some((pattern) => matchRoute(pathname, pattern))) {
        return route;
      }
    }
    return "dashboard";
  };
  
  const [activeItem, setActiveItem] = useState(getActiveItem());

  // Store the current dashboard path when on a dashboard page
  useEffect(() => {
    if (location.pathname.includes("/dashboard/")) {
      localStorage.setItem("lastDashboard", location.pathname);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    // Clear any user data/tokens here if needed
    localStorage.removeItem("lastDashboard");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  const handleNavigation = (itemId: string) => {
    setActiveItem(itemId);
    
    // Get the last dashboard from localStorage, default to user dashboard
    const lastDashboard = localStorage.getItem("lastDashboard") || ROUTES.USER_DASHBOARD;
    
    // Navigate to the appropriate route using ROUTES constants
    switch (itemId) {
      case "dashboard":
        navigate(lastDashboard);
        break;
      case "advanced-search":
        navigate(ROUTES.ADVANCED_SEARCH);
        break;
      case "visualization":
        navigate(ROUTES.VISUALIZATION_ENGINE);
        break;
      case "competitor-analytics":
        navigate(ROUTES.COMPETITOR_ANALYTICS);
        break;
      case "competitor-management":
        navigate(ROUTES.COMPETITORS);
        break;
      case "patent-trends":
        navigate(ROUTES.PATENT_TRENDS);
        break;
      case "trademark-trends":
        navigate(ROUTES.TRADEMARK_TRENDS);
        break;
      case "patent-lifecycle":
        navigate(ROUTES.PATENT_LIFECYCLE);
        break;
      case "trademark-lifecycle":
        navigate(ROUTES.TRADEMARK_LIFECYCLE);
        break;
      case "tracked-patents":
        navigate(ROUTES.TRACKED_PATENTS);
        break;
      case "search":
        navigate(ROUTES.IP_SEARCH);
        break;
      case "tracker":
        navigate(ROUTES.FILING_TRACKER);
        break;
      case "subscriptions":
        navigate(ROUTES.SUBSCRIPTIONS);
        break;
      case "create-subscription":
        navigate(ROUTES.CREATE_SUBSCRIPTION);
        break;
      case "alerts":
        navigate(ROUTES.ALERTS);
        break;
      case "profile":
        navigate(ROUTES.PROFILE);
        break;
      case "api-keys":
        navigate(ROUTES.API_KEYS_SETTINGS);
        break;
      default:
        // Stay on current page
        break;
    }
  };

  // Menu items for regular users
  const userMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "search", label: "Global IP Search", icon: Search },
    { id: "subscriptions", label: "My Subscriptions", icon: Bookmark },
    { id: "alerts", label: "Alerts", icon: Bell },
    { id: "profile", label: "Profile", icon: User },
    // Show API Keys if user has allowed roles
    ...(hasRole([ROLES.USER, ROLES.ANALYST, ROLES.ADMIN]) 
      ? [{ id: "api-keys", label: "API Keys", icon: Key }]
      : []
    ),
  ];

  // Menu items for analysts
  const analystMenuItems = [
    { id: "dashboard", label: "Analyst Dashboard", icon: LayoutDashboard },
    { id: "advanced-search", label: "Advanced Search", icon: Search },
    { id: "visualization", label: "Visualization Engine", icon: Network },
    { id: "competitor-analytics", label: "Competitor Analytics", icon: Users },
    { id: "competitor-management", label: "Competitor Management", icon: Users },
    { id: "patent-trends", label: "Patent Trends", icon: BarChart3 },
    { id: "trademark-trends", label: "Trademark Trends", icon: BarChart3 },
    { id: "patent-lifecycle", label: "Patent Lifecycle", icon: FileText },
    { id: "trademark-lifecycle", label: "Trademark Lifecycle", icon: FileText },
    { id: "tracked-patents", label: "Tracked Patents", icon: Radio },
    { id: "create-subscription", label: "Create Subscription", icon: Plus },
    { id: "profile", label: "Profile", icon: User },
    // Show API Keys if user has allowed roles
    ...(hasRole([ROLES.USER, ROLES.ANALYST, ROLES.ADMIN]) 
      ? [{ id: "api-keys", label: "API Keys", icon: Key }]
      : []
    ),
  ];

  const menuItems = isAnalyst ? analystMenuItems : userMenuItems;

  return (
    <aside className="w-64 bg-gradient-to-b from-[#1e3a5f] via-[#1a2f4d] to-[#1e3a5f] border-r border-blue-900/30 h-screen sticky top-0 flex flex-col shadow-2xl">
      {/* Logo Section */}
      <div className="p-6 border-b border-blue-800/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50">
            <span className="text-white text-xl font-bold">IP</span>
          </div>
          <div>
            <h1 className="text-white text-lg font-bold leading-tight">IPIntel</h1>
            <p className="text-blue-300 text-xs">Intelligence Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-transparent">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-left group ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                  : "text-blue-300/70 hover:bg-blue-900/40 hover:text-white"
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? "" : "group-hover:scale-110"}`} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-blue-800/30">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-red-300 hover:bg-red-900/30 hover:text-red-200 rounded-lg transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}