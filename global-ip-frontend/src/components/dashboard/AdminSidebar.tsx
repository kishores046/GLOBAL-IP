import {
  LayoutDashboard,
  Users,
  Shield,
  Activity,
  Key,
  LogOut,
  LineChart,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/routeConfig";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [activeItem, setActiveItem] = useState("overview");
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["monitoring"]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // 🔑 Route → Active Item (prefix-based, stable)
  const getActiveItem = () => {
    const path = location.pathname;

    if (path.startsWith("/admin/overview")) return "overview";
    if (path.startsWith("/admin/monitoring/api-health")) return "monitoring-health";
    if (path.startsWith("/admin/monitoring/logs")) return "monitoring-logs";
    if (path.startsWith("/admin/monitoring/errors")) return "monitoring-errors";
    if (path.startsWith("/admin/user-management")) return "users";
    if (path.startsWith("/admin/role-requests")) return "rbac";
    if (path.startsWith("/admin/api-keys")) return "api-keys";

    return "overview";
  };

  useEffect(() => {
    setActiveItem(getActiveItem());
  }, [location.pathname]);

  const handleNavigation = (id: string) => {
    const routeMap: Record<string, string> = {
      overview: ROUTES.ADMIN_OVERVIEW,
      "monitoring-health": ROUTES.ADMIN_API_HEALTH,
      "monitoring-logs": ROUTES.ADMIN_SYSTEM_LOGS,
      "monitoring-errors": ROUTES.ADMIN_ERROR_SUMMARY,
      users: ROUTES.USER_MANAGEMENT,
      rbac: ROUTES.ROLE_REQUESTS,
      "api-keys": ROUTES.API_KEYS,
    };

    navigate(routeMap[id]);
    setActiveItem(id);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      toast.success("Logged out successfully");
      navigate(ROUTES.LOGIN, { replace: true });
    } catch {
      toast.error("Logout failed, clearing session");
      localStorage.clear();
      navigate(ROUTES.LOGIN, { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const menu = [
    { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
    {
      id: "monitoring",
      label: "Monitoring Hub",
      icon: LineChart,
      submenu: [
        { id: "monitoring-health", label: "API Health Status", icon: Activity },
        { id: "monitoring-logs", label: "Usage Logs", icon: FileText },
        { id: "monitoring-errors", label: "Error Analytics", icon: AlertTriangle },
      ],
    },
    { id: "users", label: "User Management", icon: Users },
    { id: "rbac", label: "Role-Based Access Control", icon: Shield },
    { id: "api-keys", label: "API Key Settings", icon: Key },
  ];

  return (
    <>
      <style>{`
        .admin-sidebar-dark {
          background-color: #1e3a8a;
          color: #dbeafe;
        }
        .admin-sidebar-dark nav {
          background-color: #1e3a8a;
        }
        .admin-sidebar-dark button:not(.active-item) {
          color: #bfdbfe;
        }
        .admin-sidebar-dark button.active-item {
          background-color: #0c2340;
          color: #ffffff;
        }
      `}</style>
      <aside className="admin-sidebar-dark w-72 h-screen flex flex-col" style={{ backgroundColor: '#1e3a8a', color: '#dbeafe' }}>
      {/* Header */}
      <div className="p-6 border-b border-blue-700" style={{ backgroundColor: '#1e3a8a', borderColor: '#1e40af' }}>
        <h1 className="text-white text-lg font-semibold">Admin Panel</h1>
        <p style={{ color: '#bfdbfe' }} className="text-xs">System Management</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto" style={{ backgroundColor: '#1e3a8a' }}>
        {menu.map(item => {
          const Icon = item.icon;

          if (item.submenu) {
            const expanded = expandedMenus.includes(item.id);
            const hasActiveSub = item.submenu.some(s => s.id === activeItem);

            return (
              <div key={item.id}>
                <button
                  onClick={() =>
                    setExpandedMenus(p =>
                      p.includes(item.id)
                        ? p.filter(i => i !== item.id)
                        : [...p, item.id]
                    )
                  }
                  className={`w-full flex justify-between items-center px-4 py-3 rounded-lg transition`}
                  style={{
                    backgroundColor: hasActiveSub ? '#0c2340' : 'transparent',
                    color: hasActiveSub ? '#ffffff' : '#bfdbfe'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-semibold">{item.label}</span>
                  </div>
                  <span className={`text-xs ${expanded ? "rotate-90" : ""}`}>▶</span>
                </button>

                {expanded && (
                  <div className="ml-4 mt-1 space-y-1 pl-3" style={{ borderLeft: '2px solid #1e40af' }}>
                    {item.submenu.map(sub => (
                      <button
                        key={sub.id}
                        onClick={() => handleNavigation(sub.id)}
                        className="w-full text-left px-3 py-2 rounded-lg transition"
                        style={{
                          backgroundColor: activeItem === sub.id ? '#0c2340' : 'transparent',
                          color: activeItem === sub.id ? '#ffffff' : '#bfdbfe'
                        }}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition"
              style={{
                backgroundColor: activeItem === item.id ? '#0c2340' : 'transparent',
                color: activeItem === item.id ? '#ffffff' : '#bfdbfe'
              }}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t" style={{ borderColor: '#1e40af', backgroundColor: '#1e3a8a' }}>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition"
          style={{ color: '#fca5a5' }}
        >
          <LogOut className="w-5 h-5" />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </aside>
    </>
  );
}
