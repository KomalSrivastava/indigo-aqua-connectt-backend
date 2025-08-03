import { useState, useEffect, useCallback } from 'react';
import { apiClient, Customer, IncomingCall, CreateCallLogRequest } from '@/lib/api';
import { signalRClient, SignalRCallbacks } from '@/lib/signalR';
import { toast } from 'sonner';

export interface CallState {
  isIncoming: boolean;
  currentCall: IncomingCall | null;
  customer: Customer | null;
  callStatus: 'idle' | 'ringing' | 'connected' | 'ended' | 'failed';
  callDuration: number; // in seconds
  agentId: string;
}

export interface UseCallManagerReturn {
  callState: CallState;
  handleIncomingCall: (incomingCall: IncomingCall) => Promise<void>;
  handleCallAnswer: () => void;
  handleCallEnd: (notes?: string) => Promise<void>;
  handleCallReject: () => Promise<void>;
  lookupCustomer: (phone: string) => Promise<Customer | null>;
  logCall: (callData: CreateCallLogRequest) => Promise<void>;
  simulateIncomingCall: (phoneNumber: string) => void;
  isConnected: boolean;
}

export const useCallManager = (agentId: string = 'agent001'): UseCallManagerReturn => {
  const [callState, setCallState] = useState<CallState>({
    isIncoming: false,
    currentCall: null,
    customer: null,
    callStatus: 'idle',
    callDuration: 0,
    agentId
  });

  const [isConnected, setIsConnected] = useState(false);

  // Initialize SignalR connection
  useEffect(() => {
    const callbacks: SignalRCallbacks = {
      onConnected: () => {
        setIsConnected(true);
        signalRClient.registerAgent(agentId);
        toast.success('Connected to call system');
      },
      onDisconnected: () => {
        setIsConnected(false);
        toast.error('Disconnected from call system');
      },
      onIncomingCall: async (incomingCall) => {
        await handleIncomingCall(incomingCall);
      },
      onCallStatusUpdate: (callSid, status) => {
        setCallState(prev => {
          if (prev.currentCall?.callSid === callSid) {
            return { ...prev, callStatus: status as any };
          }
          return prev;
        });
      },
      onError: (error) => {
        toast.error(`Call system error: ${error.message}`);
      }
    };

    signalRClient.connect(callbacks);

    return () => {
      signalRClient.disconnect();
    };
  }, [agentId]);

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (callState.callStatus === 'connected') {
      interval = setInterval(() => {
        setCallState(prev => ({
          ...prev,
          callDuration: prev.callDuration + 1
        }));
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [callState.callStatus]);

  const lookupCustomer = useCallback(async (phone: string): Promise<Customer | null> => {
    try {
      const customer = await apiClient.getCustomerByPhone(phone);
      return customer;
    } catch (error) {
      console.error('Error looking up customer:', error);
      toast.error('Failed to lookup customer');
      return null;
    }
  }, []);

  const logCall = useCallback(async (callData: CreateCallLogRequest): Promise<void> => {
    try {
      await apiClient.logCall(callData);
      toast.success('Call logged successfully');
    } catch (error) {
      console.error('Error logging call:', error);
      toast.error('Failed to log call');
    }
  }, []);

  const handleIncomingCall = useCallback(async (incomingCall: IncomingCall) => {
    try {
      setCallState(prev => ({
        ...prev,
        isIncoming: true,
        currentCall: incomingCall,
        callStatus: 'ringing',
        callDuration: 0
      }));

      // Look up customer information
      const customer = await lookupCustomer(incomingCall.from);
      
      setCallState(prev => ({
        ...prev,
        customer
      }));

      // Show notification
      if (customer) {
        toast.info(`Incoming call from ${customer.name} (${incomingCall.from})`, {
          action: {
            label: 'Answer',
            onClick: () => handleCallAnswer()
          }
        });
      } else {
        toast.info(`Incoming call from ${incomingCall.from}`, {
          action: {
            label: 'Answer',
            onClick: () => handleCallAnswer()
          }
        });
      }

    } catch (error) {
      console.error('Error handling incoming call:', error);
      toast.error('Failed to handle incoming call');
    }
  }, [lookupCustomer]);

  const handleCallAnswer = useCallback(() => {
    setCallState(prev => ({
      ...prev,
      isIncoming: false,
      callStatus: 'connected'
    }));

    toast.success('Call answered');
    
    // TODO: Implement actual call connection logic here
    // This is where you would integrate with Twilio JS SDK
    console.log('Call answered - implement Twilio JS integration here');
  }, []);

  const handleCallEnd = useCallback(async (notes?: string) => {
    if (!callState.currentCall) return;

    try {
      // Log the call
      const callData: CreateCallLogRequest = {
        phone: callState.currentCall.from,
        status: 'completed',
        duration: callState.callDuration.toString(),
        notes,
        agentId: callState.agentId,
        callSid: callState.currentCall.callSid,
        customerId: callState.customer?.id
      };

      await logCall(callData);

      // Reset call state
      setCallState(prev => ({
        ...prev,
        isIncoming: false,
        currentCall: null,
        customer: null,
        callStatus: 'idle',
        callDuration: 0
      }));

      toast.success('Call ended and logged');
    } catch (error) {
      console.error('Error ending call:', error);
      toast.error('Failed to end call properly');
    }
  }, [callState.currentCall, callState.callDuration, callState.agentId, callState.customer, logCall]);

  const handleCallReject = useCallback(async () => {
    if (!callState.currentCall) return;

    try {
      // Log the rejected call
      const callData: CreateCallLogRequest = {
        phone: callState.currentCall.from,
        status: 'rejected',
        agentId: callState.agentId,
        callSid: callState.currentCall.callSid,
        customerId: callState.customer?.id
      };

      await logCall(callData);

      // Reset call state
      setCallState(prev => ({
        ...prev,
        isIncoming: false,
        currentCall: null,
        customer: null,
        callStatus: 'idle',
        callDuration: 0
      }));

      toast.info('Call rejected');
    } catch (error) {
      console.error('Error rejecting call:', error);
      toast.error('Failed to reject call properly');
    }
  }, [callState.currentCall, callState.agentId, callState.customer, logCall]);

  const simulateIncomingCall = useCallback((phoneNumber: string) => {
    signalRClient.simulateIncomingCall(phoneNumber);
  }, []);

  return {
    callState,
    handleIncomingCall,
    handleCallAnswer,
    handleCallEnd,
    handleCallReject,
    lookupCustomer,
    logCall,
    simulateIncomingCall,
    isConnected
  };
}; 