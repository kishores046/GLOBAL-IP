import { LayoutDashboard, Search, LogOut, BarChart3, Network, Users, User, Radio, Key, Plus, FileText, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROUTES, ROLES } from "../../routes/routeConfig";
import { toast } from "sonner";

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasRole, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
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
    'create-subscription': ['/user/subscriptions/create', '/analyst/subscriptions/create'],
    'subscriptions': ['/user/subscriptions', '/analyst/subscriptions'],
    'tracker': ['/user/filing-tracker'],
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

  

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      toast.success('Logged out successfully');
      navigate("/login", { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed, clearing session anyway');
      // Clear local state and redirect anyway
      localStorage.removeItem("lastDashboard");
      localStorage.removeItem("userRole");
      navigate("/login", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleNavigation = (itemId: string) => {
    setActiveItem(itemId);
    
    // Get the last dashboard from localStorage, default to user dashboard
    const lastDashboard = localStorage.getItem("lastDashboard") || ROUTES.USER_DASHBOARD;
    const isUserRole = !isAnalyst && !hasRole([ROLES.ANALYST, ROLES.ADMIN]);
    
    // Navigate to the appropriate route using ROUTES constants
    switch (itemId) {
      case "dashboard":
        navigate(lastDashboard);
        break;
      case "advanced-search":
        navigate(ROUTES.ADVANCED_SEARCH);
        break;
      case "visualization":
        navigate(isUserRole ? ROUTES.USER_VISUALIZATION_ENGINE : ROUTES.VISUALIZATION_ENGINE);
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
        navigate(isUserRole ? ROUTES.USER_PATENT_LIFECYCLE : ROUTES.PATENT_LIFECYCLE);
        break;
      case "trademark-lifecycle":
        navigate(isUserRole ? ROUTES.USER_TRADEMARK_LIFECYCLE : ROUTES.TRADEMARK_LIFECYCLE);
        break;
      case "tracked-patents":
        navigate(isUserRole ? ROUTES.USER_TRACKED_PATENTS : ROUTES.TRACKED_PATENTS);
        break;
      case "search":
        navigate(ROUTES.IP_SEARCH);
        break;
      case "tracker":
        navigate(ROUTES.FILING_TRACKER);
        break;
      case "profile":
        navigate(ROUTES.PROFILE);
        break;
      case "api-keys":
        navigate(ROUTES.API_KEYS_SETTINGS);
        break;
      case "create-subscription":
        // For analysts, navigate to analyst-specific subscription create page
        if (isAnalyst) {
          navigate(ROUTES.ANALYST_CREATE_SUBSCRIPTION);
        } else {
          navigate(ROUTES.CREATE_SUBSCRIPTION);
        }
        break;
      case "subscriptions":
        // Navigate to analyst subscriptions if analyst, user subscriptions if regular user
        if (isAnalyst) {
          navigate(ROUTES.ANALYST_SUBSCRIPTIONS);
        } else {
          navigate(ROUTES.SUBSCRIPTIONS);
        }
        break;
      case "alerts":
        // Navigate to analyst alerts if analyst, user alerts if regular user
        if (isAnalyst) {
          navigate(ROUTES.ANALYST_ALERTS);
        } else {
          navigate(ROUTES.ALERTS);
        }
        break;
        // Stay on current page
        break;
    }
  };

  // Menu items for regular users
  const userMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "search", label: "Global IP Search", icon: Search },
    { id: "alerts", label: "Alerts", icon: Bell },
    { id: "create-subscription", label: "Create Subscription", icon: Plus },
    { id: "subscriptions", label: "My Subscriptions", icon: Radio },
    { id: "tracked-patents", label: "Tracked Patents", icon: Radio },
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
    { id: "alerts", label: "Alerts", icon: Bell },
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
    <>
      <style>{`
        .user-sidebar-dark {
          background-color: #1e3a8a;
          color: #dbeafe;
        }
        .user-sidebar-dark nav {
          background-color: #1e3a8a;
        }
        .user-sidebar-dark button:not(.active-item) {
          color: #bfdbfe;
        }
        .user-sidebar-dark button.active-item {
          background-color: #0c2340;
          color: #ffffff;
        }
      `}</style>
      <aside className="user-sidebar-dark w-64 h-screen flex flex-col overflow-hidden shadow-sm" style={{ backgroundColor: '#1e3a8a', color: '#dbeafe' }}>
      {/* Logo Section */}
      <div className="p-6 border-b" style={{ backgroundColor: '#1e3a8a', borderColor: '#1e40af' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(to bottom right, #1e40af, #1e3a8a)' }}>
            <span className="text-white text-xl font-bold">IP</span>
          </div>
          <div>
            <h1 className="text-white text-lg font-bold leading-tight">IPIntel</h1>
            <p className="text-xs" style={{ color: '#bfdbfe' }}>Intelligence Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto" style={{ backgroundColor: '#1e3a8a' }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-left group"
              style={{
                backgroundColor: isActive ? '#0c2340' : 'transparent',
                color: isActive ? '#ffffff' : '#bfdbfe'
              }}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? "" : "group-hover:scale-110"}`} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4" style={{ borderTop: '1px solid #1e40af', backgroundColor: '#1e3a8a' }}>
        <button 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ color: '#fca5a5' }}
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
        </button>
      </div>
    </aside>
    </>
  );
}