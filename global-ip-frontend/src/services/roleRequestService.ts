import api from './api';

export interface RoleRequest {
  id: string;
  userId: string;
  requestedRole: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'WAITLISTED';
  requestedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface RoleRequestAdminView {
  requestId: number;
  userId: number;
  username: string;
  email: string;
  requestedRole: string;
  requestedAt: string;
}

export interface ApiResponse {
  message: string;
}

class RoleRequestService {
  /**
   * USER: Request admin role
   */
  async requestAdminRole(): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/role-requests/admin');
    return response.data;
  }

  /**
   * ADMIN: Get all pending role requests
   */
  async getPendingRequests(): Promise<RoleRequestAdminView[]> {
    const response = await api.get<RoleRequestAdminView[]>('/role-requests/pending');
    return response.data;
  }

  /**
   * ADMIN: Approve a role request
   */
  async approveRequest(requestId: number): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(`/role-requests/adminOnly/${requestId}/approve`);
    return response.data;
  }

  /**
   * ADMIN: Reject a role request
   */
  async rejectRequest(requestId: number): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(`/role-requests/adminOnly/${requestId}/reject`);
    return response.data;
  }

  /**
   * ADMIN: Waitlist a role request
   */
  async waitlistRequest(requestId: number): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(`/role-requests/adminOnly/${requestId}/waitlist`);
    return response.data;
  }
}

export default new RoleRequestService();
