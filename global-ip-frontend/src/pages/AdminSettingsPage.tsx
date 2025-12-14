import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { AdminSidebar } from "../components/dashboard/AdminSidebar";
import { User, Bell, Palette, Shield } from "lucide-react";

export function AdminSettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      <DashboardHeader userName="Admin" />
      
      <div className="flex">
        <AdminSidebar />
        
        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-4xl text-blue-900 mb-2">Admin Settings</h1>
              <p className="text-slate-600">Manage your profile, preferences, and system configuration</p>
            </div>

            {/* Profile Settings */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-blue-600" />
                <h3 className="text-2xl text-slate-900">Profile Settings</h3>
              </div>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fullName" className="text-slate-700 mb-2 block">Full Name</label>
                    <input
                      id="fullName"
                      type="text"
                      defaultValue="Admin User"
                      className="w-full px-4 py-3 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="text-slate-700 mb-2 block">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      defaultValue="admin@gmail.com"
                      className="w-full px-4 py-3 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="jobTitle" className="text-slate-700 mb-2 block">Job Title</label>
                    <input
                      id="jobTitle"
                      type="text"
                      defaultValue="System Administrator"
                      className="w-full px-4 py-3 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phoneNumber" className="text-slate-700 mb-2 block">Phone Number</label>
                    <input
                      id="phoneNumber"
                      type="tel"
                      defaultValue="+1 (555) 123-4567"
                      className="w-full px-4 py-3 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900"
                    />
                  </div>
                </div>

                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-lg">
                  Update Profile
                </button>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="w-6 h-6 text-blue-600" />
                <h3 className="text-2xl text-slate-900">Notification Preferences</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-lg">
                  <div>
                    <div className="text-slate-900 mb-1">Email Notifications</div>
                    <div className="text-sm text-slate-600">Receive email alerts for important events</div>
                  </div>
                  <label htmlFor="emailNotifications" className="relative inline-flex items-center cursor-pointer" aria-label="Toggle email notifications">
                    <input id="emailNotifications" type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-lg">
                  <div>
                    <div className="text-slate-900 mb-1">System Alerts</div>
                    <div className="text-sm text-slate-600">Notify about system errors and failures</div>
                  </div>
                  <label htmlFor="systemAlerts" className="relative inline-flex items-center cursor-pointer" aria-label="Toggle system alerts">
                    <input id="systemAlerts" type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-lg">
                  <div>
                    <div className="text-slate-900 mb-1">API Health Alerts</div>
                    <div className="text-sm text-slate-600">Get notified when APIs go down</div>
                  </div>
                  <label htmlFor="apiHealthAlerts" className="relative inline-flex items-center cursor-pointer" aria-label="Toggle API health alerts">
                    <input id="apiHealthAlerts" type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-lg">
                  <div>
                    <div className="text-slate-900 mb-1">User Activity Alerts</div>
                    <div className="text-sm text-slate-600">Notify about new user registrations</div>
                  </div>
                  <label htmlFor="userActivityAlerts" className="relative inline-flex items-center cursor-pointer" aria-label="Toggle user activity alerts">
                    <input id="userActivityAlerts" type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-lg">
                  <label htmlFor="weeklyReports" className="flex-1">
                    <div className="text-slate-900 mb-1">Weekly Reports</div>
                    <div className="text-sm text-slate-600">Receive weekly activity summary</div>
                  </label>
                  <label htmlFor="weeklyReports" className="relative inline-flex items-center cursor-pointer" aria-label="Toggle weekly reports">
                    <input id="weeklyReports" type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* System Preferences */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <Palette className="w-6 h-6 text-blue-600" />
                <h3 className="text-2xl text-slate-900">System Preferences</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-lg">
                  <label htmlFor="themeMode" className="flex-1">
                    <div className="text-slate-900 mb-1">Theme Mode</div>
                    <div className="text-sm text-slate-600">Choose your preferred interface theme</div>
                  </label>
                  <select id="themeMode" className="px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900">
                    <option value="light">Light Mode</option>
                    <option value="dark">Dark Mode</option>
                    <option value="auto">Auto (System)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-lg">
                  <label htmlFor="language" className="flex-1">
                    <div className="text-slate-900 mb-1">Language</div>
                    <div className="text-sm text-slate-600">Select interface language</div>
                  </label>
                  <select id="language" className="px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900">
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-lg">
                  <label htmlFor="timezone" className="flex-1">
                    <div className="text-slate-900 mb-1">Timezone</div>
                    <div className="text-sm text-slate-600">Set your local timezone</div>
                  </label>
                  <select id="timezone" className="px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900">
                    <option value="UTC">UTC</option>
                    <option value="EST">Eastern (EST)</option>
                    <option value="CST">Central (CST)</option>
                    <option value="PST">Pacific (PST)</option>
                  </select>
                </div>

                <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-lg">
                  Save Preferences
                </button>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-blue-600" />
                <h3 className="text-2xl text-slate-900">Security Settings</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="text-slate-700 mb-2 block">Current Password</label>
                  <input
                    id="currentPassword"
                    type="password"
                    placeholder="Enter current password"
                    className="w-full px-4 py-3 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900"
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="text-slate-700 mb-2 block">New Password</label>
                  <input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="text-slate-700 mb-2 block">Confirm New Password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-lg mt-4">
                  <div>
                    <div className="text-slate-900 mb-1">Two-Factor Authentication</div>
                    <div className="text-sm text-slate-600">Add an extra layer of security</div>
                  </div>
                  <label htmlFor="twoFactorAuth" className="relative inline-flex items-center cursor-pointer" aria-label="Toggle two-factor authentication">
                    <input id="twoFactorAuth" type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-lg">
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
