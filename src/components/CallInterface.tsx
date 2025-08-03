import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Phone, PhoneCall, PhoneOff, User, Mail, Clock, MessageSquare } from 'lucide-react';
import { CallState } from '@/hooks/useCallManager';
import { Customer } from '@/lib/api';

interface CallInterfaceProps {
  callState: CallState;
  onAnswer: () => void;
  onEnd: (notes?: string) => void;
  onReject: () => void;
  onSimulateCall: (phoneNumber: string) => void;
  isConnected: boolean;
}

export const CallInterface: React.FC<CallInterfaceProps> = ({
  callState,
  onAnswer,
  onEnd,
  onReject,
  onSimulateCall,
  isConnected
}) => {
  const [simulatePhone, setSimulatePhone] = useState('+1234567890');
  const [callNotes, setCallNotes] = useState('');

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ringing': return 'bg-yellow-500';
      case 'connected': return 'bg-green-500';
      case 'ended': return 'bg-gray-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ringing': return 'Ringing';
      case 'connected': return 'Connected';
      case 'ended': return 'Ended';
      case 'failed': return 'Failed';
      default: return 'Idle';
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Call System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm">
              {isConnected ? 'Connected to call system' : 'Disconnected from call system'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Current Call */}
      {callState.currentCall && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <PhoneCall className="h-5 w-5" />
                Current Call
              </span>
              <Badge className={getStatusColor(callState.callStatus)}>
                {getStatusText(callState.callStatus)}
              </Badge>
            </CardTitle>
            <CardDescription>
              {callState.currentCall.from} → {callState.currentCall.to}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Customer Information */}
            {callState.customer && (
              <div className="space-y-3">
                <h4 className="font-medium">Customer Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{callState.customer.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{callState.customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{callState.customer.email}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Call Duration */}
            {callState.callStatus === 'connected' && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">
                  Duration: {formatDuration(callState.callDuration)}
                </span>
              </div>
            )}

            {/* Call Controls */}
            <div className="flex gap-2">
              {callState.callStatus === 'ringing' && (
                <>
                  <Button onClick={onAnswer} className="flex-1 bg-green-600 hover:bg-green-700">
                    <PhoneCall className="h-4 w-4 mr-2" />
                    Answer
                  </Button>
                  <Button onClick={onReject} variant="destructive" className="flex-1">
                    <PhoneOff className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </>
              )}
              
              {callState.callStatus === 'connected' && (
                <Button onClick={() => onEnd(callNotes)} variant="destructive" className="flex-1">
                  <PhoneOff className="h-4 w-4 mr-2" />
                  End Call
                </Button>
              )}
            </div>

            {/* Call Notes */}
            {callState.callStatus === 'connected' && (
              <div className="space-y-2">
                <Label htmlFor="callNotes" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Call Notes
                </Label>
                <Textarea
                  id="callNotes"
                  placeholder="Add notes about the call..."
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  rows={3}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Simulate Call (Development Only) */}
      <Card>
        <CardHeader>
          <CardTitle>Simulate Incoming Call</CardTitle>
          <CardDescription>
            Test the call system by simulating an incoming call
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="simulatePhone">Phone Number</Label>
            <div className="flex gap-2">
              <Input
                id="simulatePhone"
                value={simulatePhone}
                onChange={(e) => setSimulatePhone(e.target.value)}
                placeholder="+1234567890"
              />
              <Button 
                onClick={() => onSimulateCall(simulatePhone)}
                disabled={!isConnected}
              >
                Simulate Call
              </Button>
            </div>
          </div>
          
          {/* Quick test buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onSimulateCall('+1234567890')}
              disabled={!isConnected}
            >
              Test John Doe
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onSimulateCall('+1987654321')}
              disabled={!isConnected}
            >
              Test Jane Smith
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onSimulateCall('+1555123456')}
              disabled={!isConnected}
            >
              Test Bob Johnson
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onSimulateCall('+9999999999')}
              disabled={!isConnected}
            >
              Test Unknown
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Idle State */}
      {!callState.currentCall && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center space-y-2">
              <Phone className="h-12 w-12 text-gray-400 mx-auto" />
              <p className="text-gray-500">No active calls</p>
              <p className="text-sm text-gray-400">
                Waiting for incoming calls...
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 