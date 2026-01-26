import { LayoutDashboard, Search, LineChart, BarChart3, Network, Eye, LogOut, FileText, AlertTriangle, Key, Plus, User, Radio, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../routes/routeConfig";
import { toast } from "sonner";

export function AnalystSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['analytics']); // Analytics Hub expanded by default
  
  // Determine active item based on current route
  const getActiveItem = () => {
    if (location.pathname === ROUTES.ANALYST_DASHBOARD) return "dashboard";
    if (location.pathname === ROUTES.ADVANCED_SEARCH) return "advanced-search";
    if (location.pathname === ROUTES.ANALYST_ALERTS) return "alerts";
    if (location.pathname === ROUTES.PATENT_TRENDS) return "analytics-patent-trends";
    if (location.pathname === ROUTES.TRADEMARK_TRENDS) return "analytics-trademark-trends";
    if (location.pathname === ROUTES.PATENT_LIFECYCLE) return "analytics-patent-lifecycle";
    if (location.pathname === ROUTES.TRADEMARK_LIFECYCLE) return "analytics-trademark-lifecycle";
    if (location.pathname === ROUTES.COMPETITOR_ANALYTICS) return "competitor-analytics";
    // If path includes /competitors (but isn't the analytics sub-route) treat as competitor management
    if (location.pathname.startsWith('/competitors') && location.pathname !== ROUTES.COMPETITOR_ANALYTICS) return "competitor-management";
    if (location.pathname === ROUTES.VISUALIZATION_ENGINE) return "visualization";
    if (location.pathname === ROUTES.TRACKED_PATENTS) return "tracked-patents";
    if (location.pathname === ROUTES.API_KEYS_SETTINGS) return "api-keys";
    if (location.pathname === ROUTES.PROFILE) return "profile";
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
        navigate(ROUTES.ANALYST_DASHBOARD);
        break;
      case "advanced-search":
        navigate(ROUTES.ADVANCED_SEARCH);
        break;
      case "alerts":
        navigate(ROUTES.ANALYST_ALERTS);
        break;
      case "analytics-patent-trends":
        navigate(ROUTES.PATENT_TRENDS);
        break;
      case "analytics-trademark-trends":
        navigate(ROUTES.TRADEMARK_TRENDS);
        break;
      case "analytics-patent-lifecycle":
        navigate(ROUTES.PATENT_LIFECYCLE);
        break;
      case "analytics-trademark-lifecycle":
        navigate(ROUTES.TRADEMARK_LIFECYCLE);
        break;
      case "competitor-analytics":
        navigate(ROUTES.COMPETITOR_ANALYTICS);
        break;
      case "competitor-management":
        navigate(ROUTES.COMPETITORS);
        break;
      case "visualization":
        navigate(ROUTES.VISUALIZATION_ENGINE);
        break;
      case "tracked-patents":
        navigate(ROUTES.TRACKED_PATENTS);
        break;
      case "subscriptions":
        navigate(ROUTES.ANALYST_SUBSCRIPTIONS);
        break;
      case "create-subscription":
        navigate(ROUTES.ANALYST_CREATE_SUBSCRIPTION);
        break;
      case "api-keys":
        navigate(ROUTES.ANALYST_API_KEYS_SETTINGS);
        break;
      case "profile":
        navigate(ROUTES.ANALYST_PROFILE);
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

  const analystMenuItems = [
    { id: "dashboard", label: "Dashboard Overview", icon: LayoutDashboard },
    { id: "advanced-search", label: "Advanced Search", icon: Search },
    { id: "alerts", label: "Alerts & Monitoring", icon: AlertTriangle },
    { 
      id: "analytics", 
      label: "Analytics Hub", 
      icon: BarChart3,
      submenu: [
        { id: "analytics-patent-trends", label: "Patent Trends", icon: LineChart },
        { id: "analytics-trademark-trends", label: "Trademark Trends", icon: LineChart },
        { id: "analytics-patent-lifecycle", label: "Patent Lifecycle", icon: FileText },
        { id: "analytics-trademark-lifecycle", label: "Trademark Lifecycle", icon: FileText },
      ]
    },
    { id: "competitor-analytics", label: "Competitor Analytics", icon: Network },
    { id: "competitor-management", label: "Competitor Management", icon: Users },
    { id: "visualization", label: "Visualization Engine", icon: Eye },
    { id: "tracked-patents", label: "Tracked Patents", icon: Plus },
    { id: "subscriptions", label: "My Subscriptions", icon: Radio },
    { id: "create-subscription", label: "Create Subscription", icon: Plus },
    { id: "api-keys", label: "API Keys", icon: Key },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <>
      <style>{`
        .analyst-sidebar-dark {
          background-color: #1e3a8a;
          color: #dbeafe;
        }
        .analyst-sidebar-dark nav {
          background-color: #1e3a8a;
        }
        .analyst-sidebar-dark button:not(.active-item) {
          color: #bfdbfe;
        }
        .analyst-sidebar-dark button.active-item {
          background-color: #0c2340;
          color: #ffffff;
        }
      `}</style>
      <aside className="user-sidebar-dark w-64 h-screen flex flex-col overflow-hidden shadow-sm" style={{ backgroundColor: '#1e3a8a', color: '#dbeafe' }}>
      {/* Logo Section */}
      <div className="p-6 border-b" style={{ backgroundColor: '#1e3a8a', borderColor: '#1e40af' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(to bottom right, #1e40af, #1e3a8a)' }}>
            <LineChart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white text-lg leading-tight font-semibold">Analyst Panel</h1>
            <p className="text-xs" style={{ color: '#bfdbfe' }}>Data Analysis Hub</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto" style={{ backgroundColor: '#1e3a8a' }}>
        {analystMenuItems.map((item) => {
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
                  className="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg transition-all text-left group"
                  style={{
                    backgroundColor: hasActiveSubmenu ? '#0c2340' : 'transparent',
                    color: hasActiveSubmenu ? '#ffffff' : '#bfdbfe'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-semibold">{item.label}</span>
                  </div>
                  <span className={`text-xs transition-transform ${isExpanded ? 'rotate-90' : ''}`}>▶</span>
                </button>

                {/* Submenu Items */}
                {isExpanded && (
                  <div className="ml-4 space-y-1 pl-2" style={{ borderLeft: '2px solid #1e40af' }}>
                    {item.submenu?.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const isSubActive = activeItem === subItem.id;

                      return (
                        <button
                          key={subItem.id}
                          onClick={() => handleNavigation(subItem.id)}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-left group"
                          style={{
                            backgroundColor: isSubActive ? '#0c2340' : 'transparent',
                            color: isSubActive ? '#ffffff' : '#bfdbfe'
                          }}
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
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-left group"
              style={{
                backgroundColor: isActive ? '#0c2340' : 'transparent',
                color: isActive ? '#ffffff' : '#bfdbfe'
              }}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? '' : 'group-hover:scale-110'}`} />
              <span className="text-sm font-semibold">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Analyst Info Card */}
      <div className="p-4" style={{ borderTop: '1px solid #1e40af', backgroundColor: '#1e3a8a' }}>
        <div className="mb-3 p-3 rounded-lg" style={{ backgroundColor: '#0c2340', borderLeft: '3px solid #1e40af' }}>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs" style={{ color: '#bfdbfe' }}>Analysis Status</span>
          </div>
          <p className="text-white text-sm font-semibold">Ready to Analyze</p>
        </div>
        
        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ color: '#fca5a5' }}
        >
          <LogOut className="w-5 h-5" />
          <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
        </button>
      </div>
    </aside>
    </>
  );
}
