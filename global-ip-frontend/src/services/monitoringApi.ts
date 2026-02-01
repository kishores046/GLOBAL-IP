import api from './api';

// Use the centralized axios instance which is already configured with:
// - Base URL from environment variables
// - JWT interceptor
// - Error handling

export interface MonitoringAsset {
  id: string;
  ipAddress: string;
  addedDate: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface MonitoringApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

class MonitoringApi {
  private readonly BASE_URL = '/monitoring';

  /**
   * Add an IP address to monitoring
   * @param ip - IP address to monitor
   * @returns Success message
   */
  async addMonitoringIp(ip: string): Promise<string> {
    const response = await api.post(`${this.BASE_URL}/add`, null, {
      params: { ip }
    });
    return response.data;
  }

  /**
   * Get list of all monitored IPs for the current user
   * @returns Array of monitoring assets
   */
  async getMonitoringIps(): Promise<MonitoringAsset[]> {
    const response = await api.get(`${this.BASE_URL}/list`);
    return response.data;
  }

  /**
   * Remove an IP address from monitoring
   * @param ip - IP address to remove
   * @returns Success message
   */
  async removeMonitoringIp(ip: string): Promise<string> {
    const response = await api.delete(`${this.BASE_URL}/remove`, {
      params: { ip }
    });
    return response.data;
  }
}

export const monitoringApi = new MonitoringApi();
