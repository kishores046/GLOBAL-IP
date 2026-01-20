/**
 * WebSocket Service for Real-time Alerts
 * Manages WebSocket connections for patent and competitor events
 */

import { toast } from 'sonner';

const WS_BASE_URL = 'ws://localhost:8080'; // Update with your WebSocket URL

export interface WebSocketEvent {
  type: 'PATENT_EVENT' | 'COMPETITOR_EVENT' | 'LIFECYCLE_EVENT';
  data: any;
  timestamp: string;
}

type EventHandler = (event: WebSocketEvent) => void;

class WebSocketService {
  private patentSocket: WebSocket | null = null;
  private competitorSocket: WebSocket | null = null;
  private patentHandlers: Set<EventHandler> = new Set();
  private competitorHandlers: Set<EventHandler> = new Set();
  private userId: string | null = null;
  private token: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;

  /**
   * Initialize WebSocket connections
   */
  connect(userId: string, token: string): void {
    if (this.patentSocket?.readyState === WebSocket.OPEN && this.competitorSocket?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    this.userId = userId;
    this.token = token;

    // Connect to patent events
    this.connectPatentEvents(userId, token);

    // Connect to competitor events
    this.connectCompetitorEvents(userId, token);
  }

  /**
   * Connect to patent events WebSocket
   */
  private connectPatentEvents(userId: string, token: string): void {
    if (this.patentSocket?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const url = `${WS_BASE_URL}/ws/patent-events?userId=${userId}&token=${token}`;
      this.patentSocket = new WebSocket(url);

      this.patentSocket.onopen = () => {
        console.log('✅ Patent events WebSocket connected');
        this.reconnectAttempts = 0;
      };

      this.patentSocket.onmessage = (event) => {
        try {
          const data: WebSocketEvent = JSON.parse(event.data);
          this.patentHandlers.forEach((handler) => handler(data));
        } catch (error) {
          console.error('Error parsing patent event:', error);
        }
      };

      this.patentSocket.onerror = (error) => {
        console.error('Patent events WebSocket error:', error);
      };

      this.patentSocket.onclose = () => {
        console.log('Patent events WebSocket closed');
        // Attempt to reconnect if not intentional
        if (this.userId && this.token) {
          this.scheduleReconnect('patent');
        }
      };
    } catch (error) {
      console.error('Failed to connect patent events WebSocket:', error);
    }
  }

  /**
   * Connect to competitor events WebSocket
   */
  private connectCompetitorEvents(userId: string, token: string): void {
    if (this.competitorSocket?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const url = `${WS_BASE_URL}/ws/competitor-events?userId=${userId}&token=${token}`;
      this.competitorSocket = new WebSocket(url);

      this.competitorSocket.onopen = () => {
        console.log('✅ Competitor events WebSocket connected');
        this.reconnectAttempts = 0;
      };

      this.competitorSocket.onmessage = (event) => {
        try {
          const data: WebSocketEvent = JSON.parse(event.data);
          this.competitorHandlers.forEach((handler) => handler(data));
        } catch (error) {
          console.error('Error parsing competitor event:', error);
        }
      };

      this.competitorSocket.onerror = (error) => {
        console.error('Competitor events WebSocket error:', error);
      };

      this.competitorSocket.onclose = () => {
        console.log('Competitor events WebSocket closed');
        // Attempt to reconnect if not intentional
        if (this.userId && this.token) {
          this.scheduleReconnect('competitor');
        }
      };
    } catch (error) {
      console.error('Failed to connect competitor events WebSocket:', error);
    }
  }

  /**
   * Schedule reconnection attempt
   */
  private scheduleReconnect(type: 'patent' | 'competitor'): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error(`Max reconnection attempts reached for ${type} WebSocket`);
      return;
    }

    this.reconnectAttempts++;
    setTimeout(() => {
      if (this.userId && this.token) {
        if (type === 'patent') {
          this.connectPatentEvents(this.userId, this.token);
        } else {
          this.connectCompetitorEvents(this.userId, this.token);
        }
      }
    }, this.reconnectDelay * this.reconnectAttempts);
  }

  /**
   * Disconnect all WebSocket connections
   */
  disconnect(): void {
    if (this.patentSocket) {
      this.patentSocket.close();
      this.patentSocket = null;
    }
    if (this.competitorSocket) {
      this.competitorSocket.close();
      this.competitorSocket = null;
    }
    this.userId = null;
    this.token = null;
    this.reconnectAttempts = 0;
  }

  /**
   * Subscribe to patent events
   */
  subscribeToPatentEvents(handler: EventHandler): () => void {
    this.patentHandlers.add(handler);
    return () => {
      this.patentHandlers.delete(handler);
    };
  }

  /**
   * Subscribe to competitor events
   */
  subscribeToCompetitorEvents(handler: EventHandler): () => void {
    this.competitorHandlers.add(handler);
    return () => {
      this.competitorHandlers.delete(handler);
    };
  }

  /**
   * Check if WebSocket is connected
   */
  isConnected(): boolean {
    return (
      this.patentSocket?.readyState === WebSocket.OPEN ||
      this.competitorSocket?.readyState === WebSocket.OPEN
    );
  }
}

// Singleton instance
export const websocketService = new WebSocketService();


