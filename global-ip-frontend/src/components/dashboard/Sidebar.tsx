import { LayoutDashboard, Search, FileText, Bookmark, Bell, Settings, LogOut, BarChart3, Network, Users, FolderOpen, Download, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../../routes/routeConfig";

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
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
  
  // Determine active item based on current route
  const getActiveItem = () => {
    if (location.pathname.includes("/analyst/advanced-search")) return "advanced-search";
    if (location.pathname.includes("/analyst/visualization")) return "visualization";
    if (location.pathname.includes("/analyst/competitor-analytics")) return "competitor";
    if (location.pathname.includes("/user/portfolio-tracker")) return "portfolio";
    if (location.pathname.includes("/analyst/export-tools")) return "export";
    if (location.pathname.includes("/search")) return "search";
    if (location.pathname.includes("/user/filing-tracker")) return "tracker";
    if (location.pathname.includes("/user/subscriptions")) return "subscriptions";
    if (location.pathname.includes("/user/alerts")) return "alerts";
    if (location.pathname.includes("/user/profile")) return "profile";
    if (location.pathname.includes("/settings")) return "settings";
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
      case "competitor":
        navigate(ROUTES.COMPETITOR_ANALYTICS);
        break;
      case "portfolio":
        navigate(ROUTES.PORTFOLIO_TRACKER);
        break;
      case "export":
        navigate(ROUTES.EXPORT_TOOLS);
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
      case "alerts":
        navigate(ROUTES.ALERTS);
        break;
      case "profile":
        navigate(ROUTES.PROFILE);
        break;
      case "settings":
        navigate(ROUTES.SETTINGS);
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
    { id: "tracker", label: "Filing Tracker", icon: FileText },
    { id: "subscriptions", label: "My Subscriptions", icon: Bookmark },
    { id: "alerts", label: "Alerts", icon: Bell },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // Menu items for analysts
  const analystMenuItems = [
    { id: "dashboard", label: "Analyst Dashboard", icon: LayoutDashboard },
    { id: "advanced-search", label: "Advanced Search", icon: Search },
    { id: "visualization", label: "Visualization Engine", icon: Network },
    { id: "competitor", label: "Competitor Analytics", icon: Users },
    { id: "portfolio", label: "Portfolio Tracker", icon: FolderOpen },
    { id: "export", label: "Export Tools", icon: Download },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const menuItems = isAnalyst ? analystMenuItems : userMenuItems;

  return (
    <aside className="w-72 bg-[#1e3a5f] border-r border-[#2d4a6f] h-screen sticky top-0 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-[#2d4a6f]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl">P</span>
          </div>
          <div>
            <h1 className="text-white text-lg leading-tight">IPIntel</h1>
            <p className="text-blue-200 text-sm">Intelligence Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-blue-100 hover:bg-[#2d4a6f]"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-700">
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