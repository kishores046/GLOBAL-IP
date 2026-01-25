import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { Sidebar } from "../components/dashboard/Sidebar";
import { AnalystSidebar } from "../components/dashboard/AnalystSidebar";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../routes/routeConfig";
import { User, Settings as SettingsIcon, Bell } from "lucide-react";

export function SettingsPage() {
  const { getRole } = useAuth();
  const userRole = getRole()?.toUpperCase();
  const isAnalyst = userRole === ROLES.ANALYST;
  const settingsCards = [
    {
      icon: User,
      title: "Profile Settings",
      description: "Update your profile information",
    },
    {
      icon: SettingsIcon,
      title: "Account Settings",
      description: "Change your account settings",
    },
    {
      icon: Bell,
      title: "Notification Settings",
      description: "Set up your notification preferences",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      <DashboardHeader userName="User" />
      
      <div className="flex">
        {isAnalyst ? <AnalystSidebar /> : <Sidebar />}
        
        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-12">
              <h1 className="text-5xl text-blue-900 mb-3">
                Settings
              </h1>
              <p className="text-slate-600 text-lg">
                View and manage your subscription settings
              </p>
            </div>

            {/* Settings Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {settingsCards.map((card, index) => (
                <div
                  key={card.title}
                  className="bg-white rounded-xl border border-slate-200 shadow-md hover:shadow-lg p-8 hover:border-blue-300 transition-all"
                >
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-md">
                    <card.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl text-blue-900 mb-3">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-600 mb-6">
                    {card.description}
                  </p>

                  {/* Manage Button */}
                  <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all">
                    Manage
                  </button>
                </div>
              ))}
            </div>

            {/* Additional Settings Sections */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Privacy & Security */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-md p-6">
                <h3 className="text-xl text-blue-900 mb-4">
                  Privacy & Security
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Two-Factor Authentication</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Login Alerts</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-md p-6">
                <h3 className="text-xl text-blue-900 mb-4">
                  Preferences
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Email Notifications</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Weekly Reports</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
