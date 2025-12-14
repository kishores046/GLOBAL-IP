import { useState, useEffect, useMemo } from 'react';
import { Shield, CheckCircle, XCircle, Clock, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import roleRequestService, { RoleRequestAdminView } from '../services/roleRequestService';
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { AdminSidebar } from "../components/dashboard/AdminSidebar";

export function AdminRoleRequestsPage() {
  const [requests, setRequests] = useState<RoleRequestAdminView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchPendingRequests = async () => {
    setIsLoading(true);
    try {
      const data = await roleRequestService.getPendingRequests();
      setRequests(data);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message ?? 'Failed to load pending requests';
      if (err.response?.status === 403) {
        toast.error('Unauthorized: Admin access required');
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const handleApprove = async (requestId: number) => {
    setActionLoading(requestId);
    try {
      const response = await roleRequestService.approveRequest(requestId);
      toast.success(response.message || 'Request approved successfully');
      // Remove from list
      setRequests(prev => prev.filter(req => req.requestId !== requestId));
    } catch (err: any) {
      const errorMsg = err.response?.data?.message ?? 'Failed to approve request';
      if (err.response?.status === 403) {
        toast.error('Unauthorized: Admin access required');
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (requestId: number) => {
    setActionLoading(requestId);
    try {
      const response = await roleRequestService.rejectRequest(requestId);
      toast.success(response.message || 'Request rejected');
      // Remove from list
      setRequests(prev => prev.filter(req => req.requestId !== requestId));
    } catch (err: any) {
      const errorMsg = err.response?.data?.message ?? 'Failed to reject request';
      if (err.response?.status === 403) {
        toast.error('Unauthorized: Admin access required');
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleWaitlist = async (requestId: number) => {
    setActionLoading(requestId);
    try {
      const response = await roleRequestService.waitlistRequest(requestId);
      toast.success(response.message || 'Request added to waitlist');
      // Remove from list
      setRequests(prev => prev.filter(req => req.requestId !== requestId));
    } catch (err: any) {
      const errorMsg = err.response?.data?.message ?? 'Failed to waitlist request';
      if (err.response?.status === 403) {
        toast.error('Unauthorized: Admin access required');
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const contentDisplay = useMemo(() => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Loading pending requests...</p>
          </div>
        </div>
      );
    }

    if (requests.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-6">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">No Pending Requests</h3>
          <p className="text-slate-500 text-center max-w-md">
            There are currently no pending role requests to review. New requests will appear here automatically.
          </p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Request ID</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Username</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Email</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Requested Role</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Requested At</th>
              <th className="text-center py-4 px-6 text-sm font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {requests.map((request) => (
              <tr key={request.requestId} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6">
                  <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700 font-mono">
                    #{request.requestId}
                  </code>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-700 font-semibold text-sm">
                        {request.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium text-slate-900">{request.username}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-slate-700">{request.email}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                    <Shield className="w-3.5 h-3.5" />
                    {request.requestedRole.replace('ROLE_', '')}
                  </span>
                </td>
                <td className="py-4 px-6 text-sm text-slate-600">
                  {formatDate(request.requestedAt)}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleApprove(request.requestId)}
                      disabled={actionLoading === request.requestId}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      title="Approve"
                    >
                      {actionLoading === request.requestId ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(request.requestId)}
                      disabled={actionLoading === request.requestId}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      title="Reject"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleWaitlist(request.requestId)}
                      disabled={actionLoading === request.requestId}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      title="Waitlist"
                    >
                      <Clock className="w-4 h-4" />
                      Waitlist
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }, [isLoading, requests, actionLoading]);

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
                  <h1 className="text-4xl text-blue-900 mb-2">Role-Based Access Control</h1>
                  <p className="text-slate-600">Review and manage pending admin access requests</p>
                </div>
                <button
                  onClick={fetchPendingRequests}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg flex items-center gap-2 transition-all shadow-lg disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-blue-900">Role Requests</h1>
                <p className="text-slate-600 mt-1">Review and manage pending admin access requests</p>
              </div>
            </div>
            <button
              onClick={fetchPendingRequests}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
          {contentDisplay}
        </div>

            {/* Info Box */}
            {requests.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-slate-700">
                  <strong>Note:</strong> Approving a request will grant the user admin privileges immediately. 
                  Rejected requests will be removed from this list. Waitlisted requests can be reviewed later.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
