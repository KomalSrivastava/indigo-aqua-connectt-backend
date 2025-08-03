// SignalR client for real-time communication with the ASP.NET Core backend

import { IncomingCall } from './api';

export interface SignalRCallbacks {
  onIncomingCall?: (incomingCall: IncomingCall) => void;
  onCallStatusUpdate?: (callSid: string, status: string) => void;
  onAgentRegistered?: (agentId: string) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
  onError?: (error: Error) => void;
}

class SignalRClient {
  private connection: any;
  private callbacks: SignalRCallbacks = {};
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second

  constructor() {
    // Initialize SignalR connection
    this.initializeConnection();
  }

  private initializeConnection() {
    // Note: In a real implementation, you would use the SignalR client library
    // For now, we'll create a mock implementation that simulates WebSocket behavior
    
    console.log('Initializing SignalR connection...');
    
    // Simulate connection establishment
    setTimeout(() => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000;
      
      console.log('SignalR connected successfully');
      this.callbacks.onConnected?.();
    }, 1000);
  }

  public connect(callbacks: SignalRCallbacks): void {
    this.callbacks = callbacks;
    
    if (this.isConnected) {
      this.callbacks.onConnected?.();
    }
  }

  public disconnect(): void {
    this.isConnected = false;
    console.log('SignalR disconnected');
    this.callbacks.onDisconnected?.();
  }

  public registerAgent(agentId: string): void {
    if (!this.isConnected) {
      console.warn('Cannot register agent: SignalR not connected');
      return;
    }

    console.log(`Registering agent: ${agentId}`);
    
    // Simulate agent registration
    setTimeout(() => {
      this.callbacks.onAgentRegistered?.(agentId);
    }, 500);
  }

  // Mock method to simulate incoming call (for testing)
  public simulateIncomingCall(phoneNumber: string): void {
    if (!this.isConnected) {
      console.warn('Cannot simulate incoming call: SignalR not connected');
      return;
    }

    const mockIncomingCall: IncomingCall = {
      from: phoneNumber,
      to: '+1234567890',
      callSid: `mock_${Date.now()}`,
      direction: 'inbound',
      timestamp: new Date().toISOString()
    };

    console.log('Simulating incoming call:', mockIncomingCall);
    this.callbacks.onIncomingCall?.(mockIncomingCall);
  }

  // Mock method to simulate call status update
  public simulateCallStatusUpdate(callSid: string, status: string): void {
    if (!this.isConnected) {
      console.warn('Cannot simulate call status update: SignalR not connected');
      return;
    }

    console.log(`Simulating call status update: ${callSid} -> ${status}`);
    this.callbacks.onCallStatusUpdate?.(callSid, status);
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

// Export singleton instance
export const signalRClient = new SignalRClient(); 