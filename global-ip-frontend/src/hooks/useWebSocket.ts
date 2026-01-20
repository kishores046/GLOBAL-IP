/**
 * WebSocket Hook
 * React hook for WebSocket subscriptions
 */

import { useSubscription } from '../context/SubscriptionContext';
import { websocketService } from '../services/websocketService';

export function useWebSocket() {
  const { isActive, tierLimits } = useSubscription();

  const shouldConnect = isActive && tierLimits?.realTimeAlerts === true;

  return {
    shouldConnect,
    isConnected: websocketService.isConnected(),
    subscribeToPatentEvents: websocketService.subscribeToPatentEvents.bind(websocketService),
    subscribeToCompetitorEvents: websocketService.subscribeToCompetitorEvents.bind(websocketService),
    connect: websocketService.connect.bind(websocketService),
    disconnect: websocketService.disconnect.bind(websocketService),
  };
}

