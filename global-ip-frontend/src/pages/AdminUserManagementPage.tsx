import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { AdminSidebar } from "../components/dashboard/AdminSidebar";
import { UserX, UserPlus, Search, RefreshCw, Activity, Shield, Loader2, ChevronLeft, ChevronRight, BarChart3, TrendingUp, Ban } from "lucide-react";
import { useState } from "react";
import { useSearchUsers, useDashboardCounts, useDeleteUser } from "../hooks/useUsers";
import { useDebounce } from "../hooks/useDebounce";
import { UserActivityModal } from "../components/admin/UserActivityModal";
import { RoleManagementModal } from "../components/admin/RoleManagementModal";
import { CreateUserModal } from "../components/admin/CreateUserModal";
import { BlockUserModal } from "../components/admin/BlockUserModal";
import adminApi from "../services/adminApi";
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
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedUsername, setSelectedUsername] = useState('');
  const [selectedUserRoles, setSelectedUserRoles] = useState<string[]>([]);
  const [selectedUserEmail, setSelectedUserEmail] = useState('');
  const [selectedUserBlocked, setSelectedUserBlocked] = useState(false);
  const [selectedUserBlockReason, setSelectedUserBlockReason] = useState('');
  const [blockUserLoading, setBlockUserLoading] = useState(false);

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

  const getRoleAccessBadge = (role: string) => {
    if (role === "ADMIN") {
      return {
        text: "Full Access",
        description: "Create/change roles, ban users, manage system",
        color: "bg-purple-500 text-white"
      };
    } else if (role === "ANALYST") {
      return {
        text: "Advanced Access",
        description: "Patents, trademarks analysis, reporting",
        color: "bg-blue-500 text-white"
      };
    }
    return {
      text: "Limited Access",
      description: "Search and view basic information",
      color: "bg-slate-500 text-white"
    };
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

  const handleOpenBlockModal = (userId: string, username: string, email: string, isBlocked: boolean = false, blockReason: string = '') => {
    setSelectedUserId(userId);
    setSelectedUsername(username);
    setSelectedUserEmail(email);
    setSelectedUserBlocked(isBlocked);
    setSelectedUserBlockReason(blockReason);
    setBlockModalOpen(true);
  };

  const handleBlockUser = async (reason?: string) => {
    if (!selectedUserId) return;

    setBlockUserLoading(true);
    try {
      if (selectedUserBlocked) {
        // Unblock user
        const response = await adminApi.unblockUser(selectedUserId);
        toast.success('User unblocked successfully');
        console.log('✅ User unblocked:', response);
      } else {
        // Block user
        if (!reason?.trim()) {
          toast.error('Please provide a reason for blocking');
          setBlockUserLoading(false);
          return;
        }
        const response = await adminApi.blockUser(selectedUserId, reason);
        toast.success('User blocked successfully');
        console.log('✅ User blocked:', response);
      }
      
      // Refresh user list
      await refetch();
      setBlockModalOpen(false);
    } catch (error: any) {
      console.error('❌ Error blocking/unblocking user:', error);
      const errorMsg = error.response?.data?.message ?? error.message ?? 'Failed to block/unblock user';
      toast.error(errorMsg);
    } finally {
      setBlockUserLoading(false);
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
                          <th className="text-left py-3 px-4 text-slate-700">Access Level</th>
                          <th className="text-left py-3 px-4 text-slate-700 hidden md:table-cell">Created</th>
                          <th className="text-left py-3 px-4 text-slate-700">Actions</th>
                          <th className="text-left py-3 px-4 text-slate-700">Block</th>
                          <th className="text-left py-3 px-4 text-slate-700">Delete</th>
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
                            <td className="py-3 px-4">
                              {(() => {
                                const primaryRole = user.roles[0] || "USER";
                                const accessBadge = getRoleAccessBadge(primaryRole);
                                return (
                                  <div className="flex flex-col gap-1">
                                    <span className={`px-3 py-1 rounded-lg text-xs font-medium ${accessBadge.color} inline-block w-fit`}>
                                      {accessBadge.text}
                                    </span>
                                    <span className="text-xs text-slate-500" title={accessBadge.description}>
                                      {accessBadge.description}
                                    </span>
                                  </div>
                                );
                              })()}
                            </td>
                            <td className="py-3 px-4 text-slate-700 text-sm hidden md:table-cell">
                              {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2 flex-wrap">
                                {(() => {
                                  const primaryRole = user.roles[0] || "USER";
                                  
                                  // ADMIN - Full management controls
                                  if (primaryRole === "ADMIN") {
                                    return (
                                      <>
                                        <button 
                                          onClick={() => handleOpenActivityModal(user.id)}
                                          className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-all flex items-center gap-1.5 text-xs font-medium"
                                          title="View user activity and search history"
                                        >
                                          <Activity className="w-3.5 h-3.5" />
                                          Activity
                                        </button>
                                        <button 
                                          onClick={() => handleOpenRoleModal(user.id, user.username, user.roles)}
                                          className="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-all flex items-center gap-1.5 text-xs font-medium"
                                          title="Change user roles and permissions"
                                        >
                                          <Shield className="w-3.5 h-3.5" />
                                          Roles
                                        </button>
                                      </>
                                    );
                                  }
                                  
                                  // ANALYST - Analytics and graph access
                                  if (primaryRole === "ANALYST") {
                                    return (
                                      <>
                                        <button 
                                          onClick={() => handleOpenActivityModal(user.id)}
                                          className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-all flex items-center gap-1.5 text-xs font-medium"
                                          title="View analytics and trends"
                                        >
                                          <BarChart3 className="w-3.5 h-3.5" />
                                          Analytics
                                        </button>
                                        <button 
                                          className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-all flex items-center gap-1.5 text-xs font-medium"
                                          title="Access trend analysis"
                                        >
                                          <TrendingUp className="w-3.5 h-3.5" />
                                          Trends
                                        </button>
                                      </>
                                    );
                                  }
                                  
                                  // USER - Basic search only
                                  return (
                                    <button 
                                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all flex items-center gap-1.5 text-xs font-medium"
                                      title="Basic search access"
                                    >
                                      <Search className="w-3.5 h-3.5" />
                                      Search
                                    </button>
                                  );
                                })()}
                              </div>
                            </td>

                            {/* Block Column */}
                            <td className="py-3 px-4">
                              <button 
                                onClick={() => handleOpenBlockModal(user.id, user.username, user.email, false)}
                                className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-all flex items-center gap-1.5 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Block user account"
                                disabled={blockUserLoading}
                              >
                                <Ban className="w-3.5 h-3.5" />
                                Block
                              </button>
                            </td>

                            {/* Delete Column */}
                            <td className="py-3 px-4">
                              <button 
                                onClick={() => handleDeleteUser(user.id, user.username)}
                                className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-all flex items-center gap-1.5 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Delete user permanently"
                                disabled={deleteMutation.isPending}
                              >
                                <UserX className="w-3.5 h-3.5" />
                                Delete
                              </button>
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
      <CreateUserModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        onSuccess={() => refetch()}
      />

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

      {/* Block User Modal */}
      <BlockUserModal
        isOpen={blockModalOpen}
        userId={selectedUserId}
        username={selectedUsername}
        email={selectedUserEmail}
        isBlocked={selectedUserBlocked}
        currentBlockReason={selectedUserBlockReason}
        isLoading={blockUserLoading}
        onConfirm={handleBlockUser}
        onCancel={() => setBlockModalOpen(false)}
      />
    </div>
  );
}
