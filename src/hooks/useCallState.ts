import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';

interface Caller {
  name: string;
  phone: string;
  avatar?: string;
  isVip?: boolean;
}

interface CustomerInfo {
  id?: string;
  name?: string;
  email?: string;
  phone: string;
  avatar?: string;
  tier?: "Standard" | "Premium" | "VIP";
  isVip?: boolean;
  recentInteractions?: {
    date: string;
    type: "call" | "email" | "chat";
    outcome: string;
  }[];
  notes?: string[];
  tags?: string[];
}

interface CallLogEntry {
  id: string;
  callerName?: string;
  callerPhone: string;
  avatar?: string;
  type: "incoming" | "outgoing" | "missed";
  duration: number;
  timestamp: Date;
  outcome: "completed" | "missed" | "rejected" | "transferred";
  hasNote: boolean;
  tags?: string[];
}

interface SystemStatus {
  apiHealth: "healthy" | "degraded" | "down";
  connectionStatus: "connected" | "reconnecting" | "disconnected";
  lastUpdate?: Date;
}

export function useCallState() {
  const { toast } = useToast();
  
  // Call state
  const [isCallActive, setIsCallActive] = useState(false);
  const [incomingCall, setIncomingCall] = useState<Caller | null>(null);
  const [currentCustomer, setCurrentCustomer] = useState<CustomerInfo | null>(null);
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(false);
  
  // Voice controls
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const [volume, setVolume] = useState(75);
  const [micLevel, setMicLevel] = useState(0);
  const [accentModulationActive, setAccentModulationActive] = useState(false);
  
  // Call log
  const [callLog, setCallLog] = useState<CallLogEntry[]>([
    {
      id: '1',
      callerName: 'Sarah Johnson',
      callerPhone: '+1 (555) 123-4567',
      type: 'incoming',
      duration: 245,
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      outcome: 'completed',
      hasNote: true,
      tags: ['billing', 'resolved']
    },
    {
      id: '2',
      callerName: 'Mike Chen',
      callerPhone: '+1 (555) 987-6543',
      type: 'outgoing',
      duration: 0,
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      outcome: 'missed',
      hasNote: false,
      tags: ['follow-up']
    },
    {
      id: '3',
      callerPhone: '+1 (555) 456-7890',
      type: 'incoming',
      duration: 120,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      outcome: 'completed',
      hasNote: false
    }
  ]);
  
  // System status
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    apiHealth: 'healthy',
    connectionStatus: 'connected',
    lastUpdate: new Date()
  });

  // Mock customer database
  const mockCustomers: Record<string, CustomerInfo> = {
    '+1 (555) 123-4567': {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      tier: 'Premium',
      recentInteractions: [
        {
          date: '2 days ago',
          type: 'call',
          outcome: 'Billing inquiry resolved'
        },
        {
          date: '1 week ago',
          type: 'email',
          outcome: 'Account update confirmation'
        }
      ],
      notes: ['Prefers email communication', 'Premium customer since 2020'],
      tags: ['premium', 'billing', 'loyal-customer']
    },
    '+1 (555) 987-6543': {
      id: '2',
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      phone: '+1 (555) 987-6543',
      tier: 'VIP',
      isVip: true,
      recentInteractions: [
        {
          date: '1 hour ago',
          type: 'chat',
          outcome: 'Technical support - ongoing'
        }
      ],
      notes: ['VIP customer - priority handling'],
      tags: ['vip', 'technical', 'enterprise']
    }
  };

  // Simulate incoming calls
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isCallActive && !incomingCall && Math.random() < 0.1) {
        const callers = [
          { name: 'Sarah Johnson', phone: '+1 (555) 123-4567', isVip: false },
          { name: 'Mike Chen', phone: '+1 (555) 987-6543', isVip: true },
          { name: 'Unknown Caller', phone: '+1 (555) 999-8888', isVip: false }
        ];
        
        const caller = callers[Math.floor(Math.random() * callers.length)];
        setIncomingCall(caller);
        
        toast({
          title: "Incoming Call",
          description: `${caller.name} is calling...`,
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isCallActive, incomingCall, toast]);

  // Simulate mic level
  useEffect(() => {
    if (!isCallActive || isMuted) {
      setMicLevel(0);
      return;
    }

    const interval = setInterval(() => {
      setMicLevel(Math.random() * 100);
    }, 100);

    return () => clearInterval(interval);
  }, [isCallActive, isMuted]);

  // Customer lookup
  const lookupCustomer = useCallback(async (phone: string) => {
    setIsLoadingCustomer(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const customer = mockCustomers[phone];
    if (customer) {
      setCurrentCustomer(customer);
      setAccentModulationActive(true);
      toast({
        title: "Customer Found",
        description: `Loaded profile for ${customer.name}`,
      });
    } else {
      setCurrentCustomer({ phone });
      toast({
        title: "Customer Not Found",
        description: "Manual lookup required",
        variant: "destructive"
      });
    }
    
    setIsLoadingCustomer(false);
  }, [toast]);

  // Call actions
  const acceptCall = useCallback(async () => {
    if (!incomingCall) return;
    
    setIsCallActive(true);
    setIncomingCall(null);
    
    toast({
      title: "Call Accepted",
      description: `Connected to ${incomingCall.name}`,
    });
    
    // Lookup customer info
    await lookupCustomer(incomingCall.phone);
  }, [incomingCall, lookupCustomer, toast]);

  const rejectCall = useCallback(() => {
    if (!incomingCall) return;
    
    const newLogEntry: CallLogEntry = {
      id: Date.now().toString(),
      callerName: incomingCall.name,
      callerPhone: incomingCall.phone,
      type: 'incoming',
      duration: 0,
      timestamp: new Date(),
      outcome: 'rejected',
      hasNote: false
    };
    
    setCallLog(prev => [newLogEntry, ...prev]);
    setIncomingCall(null);
    
    toast({
      title: "Call Rejected",
      description: `Declined call from ${incomingCall.name}`,
    });
  }, [incomingCall, toast]);

  const endCall = useCallback(() => {
    if (!isCallActive) return;
    
    const duration = Math.floor(Math.random() * 300) + 60; // 1-5 minutes
    
    const newLogEntry: CallLogEntry = {
      id: Date.now().toString(),
      callerName: currentCustomer?.name,
      callerPhone: currentCustomer?.phone || '',
      type: 'incoming',
      duration,
      timestamp: new Date(),
      outcome: 'completed',
      hasNote: false
    };
    
    setCallLog(prev => [newLogEntry, ...prev]);
    setIsCallActive(false);
    setCurrentCustomer(null);
    setIsMuted(false);
    setIsOnHold(false);
    setAccentModulationActive(false);
    
    toast({
      title: "Call Ended",
      description: `Call duration: ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`,
    });
  }, [isCallActive, currentCustomer, toast]);

  // Voice controls
  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
    toast({
      title: isMuted ? "Microphone On" : "Microphone Muted",
      description: isMuted ? "You can now speak" : "Your microphone is muted",
    });
  }, [isMuted, toast]);

  const toggleHold = useCallback(() => {
    setIsOnHold(prev => !prev);
    toast({
      title: isOnHold ? "Call Resumed" : "Call on Hold",
      description: isOnHold ? "Call has been resumed" : "Call has been placed on hold",
    });
  }, [isOnHold, toast]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      switch (e.key.toLowerCase()) {
        case 'm':
          if (isCallActive) toggleMute();
          break;
        case 'h':
          if (isCallActive) toggleHold();
          break;
        case 'e':
          if (isCallActive) endCall();
          break;
        case ' ':
          e.preventDefault();
          if (isCallActive && isMuted) {
            setIsMuted(false);
          }
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ' && isCallActive) {
        setIsMuted(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isCallActive, isMuted, toggleMute, toggleHold, endCall]);

  return {
    // Call state
    isCallActive,
    incomingCall,
    currentCustomer,
    isLoadingCustomer,
    
    // Voice controls
    isMuted,
    isOnHold,
    volume,
    micLevel,
    accentModulationActive,
    
    // Data
    callLog,
    systemStatus,
    
    // Actions
    acceptCall,
    rejectCall,
    endCall,
    toggleMute,
    toggleHold,
    setVolume,
    lookupCustomer,
    setCurrentCustomer
  };
}