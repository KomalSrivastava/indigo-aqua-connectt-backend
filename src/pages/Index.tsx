import { useCallManager } from "@/hooks/useCallManager";
import { CallInterface } from "@/components/CallInterface";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Users, Clock, Activity } from "lucide-react";

const Index = () => {
  const {
    callState,
    handleCallAnswer,
    handleCallEnd,
    handleCallReject,
    simulateIncomingCall,
    isConnected
  } = useCallManager('agent001');

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customer Support Dashboard</h1>
          <p className="text-gray-600">Manage incoming calls and customer interactions</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm font-medium">
            {isConnected ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Call Status</p>
                <p className="text-2xl font-bold capitalize">{callState.callStatus}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Agent ID</p>
                <p className="text-2xl font-bold">{callState.agentId}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Call Duration</p>
                <p className="text-2xl font-bold">
                  {Math.floor(callState.callDuration / 60)}:{(callState.callDuration % 60).toString().padStart(2, '0')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">System Status</p>
                <Badge variant={isConnected ? "default" : "destructive"}>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Call Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <CallInterface
            callState={callState}
            onAnswer={handleCallAnswer}
            onEnd={handleCallEnd}
            onReject={handleCallReject}
            onSimulateCall={simulateIncomingCall}
            isConnected={isConnected}
          />
        </div>

        {/* Customer Information Panel */}
        <div className="space-y-6">
          {callState.customer ? (
            <Card>
              <CardHeader>
                <CardTitle>Current Customer</CardTitle>
                <CardDescription>
                  Information for the current caller
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-lg font-semibold">{callState.customer.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-lg font-semibold">{callState.customer.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-lg font-semibold">{callState.customer.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Customer Since</label>
                    <p className="text-lg font-semibold">
                      {new Date(callState.customer.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center space-y-2">
                  <Users className="h-12 w-12 text-gray-400 mx-auto" />
                  <p className="text-gray-500">No customer information</p>
                  <p className="text-sm text-gray-400">
                    Customer details will appear here when a call comes in
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Voice Conversion Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Voice Conversion</CardTitle>
              <CardDescription>
                Future accent conversion feature (Indian to American)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  This feature will allow real-time accent conversion during calls.
                </p>
                <Badge variant="secondary">Coming Soon</Badge>
                <div className="text-xs text-gray-500">
                  <p>• Indian accent to American accent conversion</p>
                  <p>• Real-time audio processing</p>
                  <p>• Improved customer communication</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
