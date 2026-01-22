import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { AdminSidebar } from "../components/dashboard/AdminSidebar";
import { Users, Activity, Database, Clock, Shield, Key, RefreshCw, Edit, Trash2, Plus, AlertCircle, CheckCircle, XCircle, Filter, UserCog, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminOverview, useHealthSummary, useUsageLogs } from "../hooks/useAdminQueries";
import { useSearchUsers } from "../hooks/useUsers";
import { useAdminApiKeys } from "../hooks/useAdminApiKeys";

export function AdminDashboard() {
  const navigate = useNavigate();
  const { data: overview, isLoading } = useAdminOverview();
  const { data: healthSummary } = useHealthSummary();
  const { data: logsData } = useUsageLogs({ page: 0, size: 5, sortBy: 'timestamp', sortDir: 'desc' });
  const { data: usersData, isLoading: isLoadingUsers } = useSearchUsers({ page: 0, size: 4 });
  const { data: apiKeysData } = useAdminApiKeys({ page: 0, size: 5 });
  const [selectedLogLevel, setSelectedLogLevel] = useState("all");
  const [showUserModal, setShowUserModal] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  // Get users from API
  const users = usersData?.content || [];

  // Get API keys from API
  const apiKeys = apiKeysData?.content || [];

  // Get recent logs (first 5) and filter by level
  const recentLogs = logsData?.content || [];
  const filteredLogs = selectedLogLevel === "all" 
    ? recentLogs 
    : recentLogs.filter(log => log.status === selectedLogLevel);

  const getLogLevelColor = (status: string) => {
    switch (status) {
      case "ERROR": return "text-red-700 bg-red-100";
      case "SUCCESS": return "text-green-700 bg-green-100";
      default: return "text-slate-700 bg-slate-100";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      <DashboardHeader userName="Admin" />
      
      <div className="flex">
        <AdminSidebar />
        
        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-4xl text-blue-900 mb-2">Admin Dashboard</h1>
              <p className="text-slate-600">System health, user management & administrative controls</p>
            </div>

            {/* High-Level Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Users */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-4xl text-blue-900 mb-2">
                  {isLoading ? '...' : overview?.totalUsers || 0}
                </div>
                <div className="text-slate-600">Total Users</div>
              </div>

              {/* Active Users */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-4xl text-blue-900 mb-2">
                  {isLoading ? '...' : overview?.activeUsers || 0}
                </div>
                <div className="text-slate-600">Active Users</div>
              </div>

              {/* Errors Today */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-md">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-4xl text-blue-900 mb-2">
                  {isLoading ? '...' : overview?.errorsToday || 0}
                </div>
                <div className="text-slate-600">Errors Today</div>
              </div>

              {/* Requests Today */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-4xl text-blue-900 mb-2">
                  {isLoading ? '...' : overview?.requestsToday?.toLocaleString() || 0}
                </div>
                <div className="text-slate-600">Requests Today</div>
              </div>
            </div>

            {/* Role Requests Quick Access */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 border border-purple-400 shadow-xl text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <UserCog className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Pending Role Requests</h3>
                    <p className="text-purple-100">Review and manage admin access requests from users</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/admin/role-requests')}
                  className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-purple-50 text-purple-600 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
                >
                  Manage Requests
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main Grid Layout */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column - User Management & API Health */}
              <div className="lg:col-span-2 space-y-6">
                {/* User & Role Management */}
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl text-slate-900 mb-1">User & Role Management</h3>
                      <p className="text-slate-600">Manage users and their permissions</p>
                    </div>
                    <button 
                      onClick={() => setShowUserModal(true)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg flex items-center gap-2 transition-all shadow-lg"
                    >
                      <Plus className="w-4 h-4" />
                      Create User
                    </button>
                  </div>

                  {/* Filter Chips */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <button className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm transition-all">
                      All Users
                    </button>
                    <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm transition-all">
                      Admin
                    </button>
                    <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm transition-all">
                      Analyst
                    </button>
                    <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm transition-all">
                      User
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-blue-200">
                          <th className="text-left py-3 px-4 text-slate-700">Name</th>
                          <th className="text-left py-3 px-4 text-slate-700">Email</th>
                          <th className="text-left py-3 px-4 text-slate-700">Role</th>
                          <th className="text-left py-3 px-4 text-slate-700">Status</th>
                          <th className="text-left py-3 px-4 text-slate-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoadingUsers ? (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-slate-600">
                              Loading users...
                            </td>
                          </tr>
                        ) : users.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-slate-600">
                              No users found
                            </td>
                          </tr>
                        ) : (
                          users.map((user) => (
                            <tr
                              key={user.id}
                              className="border-b border-blue-100 hover:bg-blue-50/50 transition-all"
                            >
                              <td className="py-3 px-4 text-slate-900">{user.username}</td>
                              <td className="py-3 px-4 text-slate-700">{user.email}</td>
                              <td className="py-3 px-4">
                                <div className="flex gap-1 flex-wrap">
                                  {user.roles.map((role) => (
                                    <span key={role} className={`px-3 py-1 rounded-full text-xs ${
                                      role === 'ADMIN' 
                                        ? 'bg-purple-100 text-purple-700'
                                        : role === 'ANALYST'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-slate-100 text-slate-700'
                                    }`}>
                                      {role}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
                                  Active
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <button 
                                    onClick={() => navigate('/admin/users')}
                                    className="p-1.5 hover:bg-blue-100 rounded transition-all"
                                  >
                                    <Edit className="w-4 h-4 text-blue-600" />
                                  </button>
                                  <button className="p-1.5 hover:bg-red-100 rounded transition-all">
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* View All Link */}
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => navigate('/admin/users')}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2 mx-auto"
                    >
                      View All Users
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* API Health Monitor */}
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
                  <div className="mb-6">
                    <h3 className="text-2xl text-slate-900 mb-1">API Health Status</h3>
                    <p className="text-slate-600">Monitor API uptime and performance metrics</p>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-slate-900">Overall Health</span>
                      </div>
                      <div className="text-2xl text-green-700">{healthSummary?.overallHealth || 'Loading...'}</div>
                      <div className="text-sm text-slate-600 mt-1">{healthSummary?.healthyServices || 0} services healthy</div>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <Activity className="w-5 h-5 text-blue-600" />
                        <span className="text-slate-900">Avg Response</span>
                      </div>
                      <div className="text-2xl text-blue-700">{healthSummary?.avgResponseTime ? `${healthSummary.avgResponseTime}ms` : 'N/A'}</div>
                      <div className="text-sm text-slate-600 mt-1">Response time</div>
                    </div>

                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <Database className="w-5 h-5 text-purple-600" />
                        <span className="text-slate-900">Requests</span>
                      </div>
                      <div className="text-2xl text-purple-700">{overview?.requestsToday?.toLocaleString() || 0}</div>
                      <div className="text-sm text-slate-600 mt-1">Today</div>
                    </div>
                  </div>
                </div>

                {/* System Logs Viewer */}
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
                  <div className="mb-6">
                    <h3 className="text-2xl text-slate-900 mb-1">System Logs</h3>
                    <p className="text-slate-600">Real-time system events and errors</p>
                  </div>

                  {/* Log Filters */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <button 
                      onClick={() => setSelectedLogLevel("all")}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        selectedLogLevel === "all" 
                          ? "bg-blue-100 text-blue-700" 
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      }`}
                    >
                      <Filter className="w-3 h-3 inline mr-1" />
                      All Logs
                    </button>
                    <button 
                      onClick={() => setSelectedLogLevel("SUCCESS")}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        selectedLogLevel === "SUCCESS" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      }`}
                    >
                      SUCCESS
                    </button>
                    <button 
                      onClick={() => setSelectedLogLevel("ERROR")}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        selectedLogLevel === "ERROR" 
                          ? "bg-red-100 text-red-700" 
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      }`}
                    >
                      ERROR
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-blue-200">
                          <th className="text-left py-3 px-4 text-slate-700">Timestamp</th>
                          <th className="text-left py-3 px-4 text-slate-700">Level</th>
                          <th className="text-left py-3 px-4 text-slate-700">Message</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                          <tr
                            key={log.id}
                            className="border-b border-blue-100 hover:bg-blue-50/50 transition-all"
                          >
                            <td className="py-3 px-4 text-slate-700 text-sm font-mono">
                              {new Date(log.timestamp).toLocaleString()}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-3 py-1 rounded-full text-xs ${getLogLevelColor(log.status)}`}>
                                {log.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-900 text-sm">
                              {log.service} - {log.action} by {log.username}
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={3} className="py-6 text-center text-slate-500">
                              No logs available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Column - RBAC, API Keys, Data Sync */}
              <div className="lg:col-span-1 space-y-6">
                {/* Access Control Overview */}
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
                  <div className="flex items-center gap-2 mb-6">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <h3 className="text-xl text-slate-900">Access Control Overview</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Admin Role */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <div className="text-slate-900 mb-3">Admin</div>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-slate-700">Full System Access</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-slate-700">User Management</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-slate-700">API Configuration</span>
                        </div>
                      </div>
                    </div>

                    {/* Analyst Role */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="text-slate-900 mb-3">Analyst</div>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-slate-700">Read/Write Data</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-slate-700">Analytics Tools</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-500" />
                          <span className="text-slate-500">User Management</span>
                        </div>
                      </div>
                    </div>

                    {/* User Role */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="text-slate-900 mb-3">User</div>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-slate-700">Read Data</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-500" />
                          <span className="text-slate-500">Write Access</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-500" />
                          <span className="text-slate-500">Admin Functions</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* API Keys & Configuration */}
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Key className="w-5 h-5 text-blue-600" />
                      <h3 className="text-xl text-slate-900">API Keys</h3>
                    </div>
                    <button 
                      onClick={() => setShowApiKeyModal(true)}
                      className="p-2 hover:bg-blue-100 rounded-lg transition-all"
                    >
                      <Plus className="w-4 h-4 text-blue-600" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {apiKeys.map((apiKey) => (
                      <div key={apiKey.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                        <div className="text-slate-900 text-sm mb-1">{apiKey.name}</div>
                        <div className="text-xs text-slate-500 font-mono mb-2">{apiKey.maskedKey}</div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-600">Status: {apiKey.status}</span>
                          <button className="text-red-600 hover:text-red-700">Revoke</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Create User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl text-blue-900">Create New User</h3>
              <button onClick={() => setShowUserModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                <XCircle className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="fullName" className="text-slate-700 mb-2 block">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="John Smith"
                  className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="text-slate-700 mb-2 block">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="john.smith@company.com"
                  className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900"
                />
              </div>
              
              <div>
                <label htmlFor="role" className="text-slate-700 mb-2 block">Role</label>
                <select id="role" className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900">
                  <option value="user">User</option>
                  <option value="analyst">Analyst</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-lg">
                  Create User
                </button>
                <button 
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 bg-white border border-blue-200 hover:bg-blue-50 text-blue-600 rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generate API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl text-blue-900">Generate API Key</h3>
              <button onClick={() => setShowApiKeyModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                <XCircle className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="keyName" className="text-slate-700 mb-2 block">Key Name</label>
                <input
                  id="keyName"
                  type="text"
                  placeholder="Production API Key"
                  className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900"
                />
              </div>
              
              <div>
                <label htmlFor="environment" className="text-slate-700 mb-2 block">Environment</label>
                <select id="environment" className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900">
                  <option value="production">Production</option>
                  <option value="development">Development</option>
                  <option value="staging">Staging</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-lg">
                  Generate Key
                </button>
                <button 
                  onClick={() => setShowApiKeyModal(false)}
                  className="px-4 py-2 bg-white border border-blue-200 hover:bg-blue-50 text-blue-600 rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
