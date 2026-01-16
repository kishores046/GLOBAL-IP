import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { AdminSidebar } from "../components/dashboard/AdminSidebar";
import { UserX, UserPlus, Search, RefreshCw, Activity, Shield, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useSearchUsers, useDashboardCounts, useDeleteUser } from "../hooks/useUsers";
import { useDebounce } from "../hooks/useDebounce";
import { UserActivityModal } from "../components/admin/UserActivityModal";
import { RoleManagementModal } from "../components/admin/RoleManagementModal";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

export function AdminUserManagementPage() {
  const [showUserModal, setShowUserModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  
  // Modal states
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedUsername, setSelectedUsername] = useState('');
  const [selectedUserRoles, setSelectedUserRoles] = useState<string[]>([]);

  // Debounce search query
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Fetch data
  const { data: usersData, isLoading, error, refetch } = useSearchUsers({
    query: debouncedSearch,
    role: selectedRole,
    page: currentPage,
    size: pageSize,
  });

  const { data: dashboardCounts } = useDashboardCounts();
  const deleteMutation = useDeleteUser();

  // Extract users and pagination
  const users = usersData?.content || [];
  const totalPages = usersData?.totalPages || 0;
  const totalElements = usersData?.totalElements || 0;

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
    if (role === "ADMIN") {
      return "bg-purple-100 text-purple-700";
    } else if (role === "ANALYST") {
      return "bg-blue-100 text-blue-700";
    }
    return "bg-slate-100 text-slate-700";
  };

  const handleOpenActivityModal = (userId: string) => {
    setSelectedUserId(userId);
    setActivityModalOpen(true);
  };

  const handleOpenRoleModal = (userId: string, username: string, roles: string[]) => {
    setSelectedUserId(userId);
    setSelectedUsername(username);
    setSelectedUserRoles(roles);
    setRoleModalOpen(true);
  };

  const handleDeleteUser = async (userId: string, username: string) => {
    if (window.confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
      try {
        await deleteMutation.mutateAsync(userId);
        toast.success('User deleted successfully');
      } catch (error) {
        toast.error('Failed to delete user');
        console.error('Error deleting user:', error);
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleRoleFilterChange = (role: string) => {
    setSelectedRole(role);
    setCurrentPage(0); // Reset to first page
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(0); // Reset to first page
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

            {/* Dashboard Stats */}
            {dashboardCounts && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <UserPlus className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-slate-600 text-sm">Total Users</p>
                      <p className="text-3xl font-bold text-blue-900">{dashboardCounts.totalUsers}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-green-200/50 hover:border-green-300/50 transition-all shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Activity className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-slate-600 text-sm">Active Users</p>
                      <p className="text-3xl font-bold text-green-900">{dashboardCounts.activeUsers}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-yellow-200/50 hover:border-yellow-300/50 transition-all shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <UserX className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-slate-600 text-sm">Inactive Users</p>
                      <p className="text-3xl font-bold text-yellow-900">{dashboardCounts.inactiveUsers}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Search and Filters */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by username or email..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900"
                  />
                </div>

                {/* Role Filter */}
                <select
                  value={selectedRole}
                  onChange={(e) => handleRoleFilterChange(e.target.value)}
                  className="px-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900"
                >
                  <option value="">All Roles</option>
                  <option value="USER">User</option>
                  <option value="ANALYST">Analyst</option>
                  <option value="ADMIN">Admin</option>
                </select>

                {/* Refresh Button */}
                <button
                  onClick={() => refetch()}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>

              {/* Results Count */}
              <div className="mt-4 text-sm text-slate-600">
                Showing {users.length} of {totalElements} users
              </div>
            </div>

            {/* User Table */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                  <p className="text-slate-600">Loading users...</p>
                </div>
              )}
              
              {!isLoading && error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                  Failed to load users. Please try again.
                </div>
              )}
              
              {!isLoading && !error && users.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-slate-600">No users found</p>
                </div>
              )}
              
              {!isLoading && !error && users.length > 0 && (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-blue-200">
                          <th className="text-left py-3 px-4 text-slate-700">Username</th>
                          <th className="text-left py-3 px-4 text-slate-700">Email</th>
                          <th className="text-left py-3 px-4 text-slate-700">Roles</th>
                          <th className="text-left py-3 px-4 text-slate-700 hidden md:table-cell">Created</th>
                          <th className="text-left py-3 px-4 text-slate-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr
                            key={user.id}
                            className="border-b border-blue-100 hover:bg-blue-50/50 transition-all"
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                                  {user.username[0].toUpperCase()}
                                </div>
                                <span className="font-medium text-slate-900">{user.username}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-slate-700">{user.email}</td>
                            <td className="py-3 px-4">
                              <div className="flex gap-1 flex-wrap">
                                {user.roles.map(role => (
                                  <span 
                                    key={role}
                                    className={`px-3 py-1 rounded-lg text-xs ${getRoleBadgeColor(role)}`}
                                  >
                                    {role}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-slate-700 text-sm hidden md:table-cell">
                              {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handleOpenActivityModal(user.id)}
                                  className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-all"
                                  title="View Activity"
                                >
                                  <Activity className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleOpenRoleModal(user.id, user.username, user.roles)}
                                  className="p-2 hover:bg-green-100 text-green-600 rounded-lg transition-all"
                                  title="Manage Roles"
                                >
                                  <Shield className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteUser(user.id, user.username)}
                                  className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-all"
                                  title="Delete User"
                                  disabled={deleteMutation.isPending}
                                >
                                  <UserX className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-between">
                      <p className="text-sm text-slate-600">
                        Page {currentPage + 1} of {totalPages}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 0}
                          className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Previous
                        </button>
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage >= totalPages - 1}
                          className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                        >
                          Next
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
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

      {/* User Activity Modal */}
      <UserActivityModal
        userId={selectedUserId}
        isOpen={activityModalOpen}
        onClose={() => setActivityModalOpen(false)}
      />

      {/* Role Management Modal */}
      <RoleManagementModal
        userId={selectedUserId}
        username={selectedUsername}
        currentRoles={selectedUserRoles}
        isOpen={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
