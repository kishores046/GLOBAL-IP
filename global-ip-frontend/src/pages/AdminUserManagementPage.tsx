import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { AdminSidebar } from "../components/dashboard/AdminSidebar";
import { Edit, UserX, UserPlus } from "lucide-react";
import { useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "User" | "Analyst" | "Admin";
  status: "Active" | "Inactive";
  lastLogin: string;
}

const usersData: User[] = [
  { id: "1", name: "John Smith", email: "john.smith@company.com", role: "User", status: "Active", lastLogin: "2 hours ago" },
  { id: "2", name: "Sarah Johnson", email: "sarah.j@company.com", role: "Analyst", status: "Active", lastLogin: "30 mins ago" },
  { id: "3", name: "Michael Chen", email: "m.chen@company.com", role: "User", status: "Active", lastLogin: "1 day ago" },
  { id: "4", name: "Emily Davis", email: "emily.d@company.com", role: "Analyst", status: "Inactive", lastLogin: "5 days ago" },
  { id: "5", name: "Admin User", email: "admin@gmail.com", role: "Admin", status: "Active", lastLogin: "Just now" },
  { id: "6", name: "Robert Wilson", email: "r.wilson@company.com", role: "User", status: "Active", lastLogin: "3 hours ago" },
  { id: "7", name: "Lisa Anderson", email: "lisa.a@company.com", role: "Analyst", status: "Active", lastLogin: "1 hour ago" },
  { id: "8", name: "David Brown", email: "d.brown@company.com", role: "User", status: "Inactive", lastLogin: "2 weeks ago" },
];

export function AdminUserManagementPage() {
  const [showUserModal, setShowUserModal] = useState(false);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Inactive":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getRoleBadgeColor = (role: string) => {
    if (role === "Admin") {
      return "bg-purple-100 text-purple-700";
    } else if (role === "Analyst") {
      return "bg-blue-100 text-blue-700";
    }
    return "bg-slate-100 text-slate-700";
  };

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
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl text-blue-900 mb-2">User Management</h1>
                  <p className="text-slate-600">Manage platform users and access controls</p>
                </div>
                <button 
                  onClick={() => setShowUserModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all flex items-center gap-2 shadow-lg"
                >
                  <UserPlus className="w-5 h-5" />
                  Add New User
                </button>
              </div>
            </div>

            {/* User Table */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-blue-200">
                      <th className="text-left py-3 px-4 text-slate-700">Name</th>
                      <th className="text-left py-3 px-4 text-slate-700">Email</th>
                      <th className="text-left py-3 px-4 text-slate-700">Role</th>
                      <th className="text-left py-3 px-4 text-slate-700">Status</th>
                      <th className="text-left py-3 px-4 text-slate-700">Last Login</th>
                      <th className="text-left py-3 px-4 text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersData.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-blue-100 hover:bg-blue-50/50 transition-all"
                      >
                        <td className="py-3 px-4 text-slate-900">{user.name}</td>
                        <td className="py-3 px-4 text-slate-700">{user.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-lg text-sm ${getRoleBadgeColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs ${getStatusBadgeColor(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-700 text-sm">{user.lastLogin}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-all">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-all">
                              <UserX className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Create User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl text-blue-900 mb-6">Create New User</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="fullname" className="text-slate-700 mb-2 block">Full Name</label>
                <input
                  id="fullname"
                  type="text"
                  placeholder="Enter full name"
                  className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="text-slate-700 mb-2 block">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900"
                />
              </div>
              
              <div>
                <label htmlFor="role" className="text-slate-700 mb-2 block">Role</label>
                <select id="role" className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900">
                  <option value="User">User</option>
                  <option value="Analyst">Analyst</option>
                  <option value="Admin">Admin</option>
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
    </div>
  );
}
