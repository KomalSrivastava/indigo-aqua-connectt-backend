import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { CustomerSidebar } from "./CustomerSidebar";
import { IncomingCallBanner } from "./IncomingCallBanner";
import { CustomerInfoPanel } from "./CustomerInfoPanel";
import { VoiceControlBar } from "./VoiceControlBar";
import { CallLogPreview } from "./CallLogPreview";
import { SystemStatusBanner } from "./SystemStatusBanner";
import { useCallState } from "@/hooks/useCallState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Phone, Users, Headphones } from "lucide-react";

export function Dashboard() {
  const {
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
  } = useCallState();

  const handleAddNote = (callId: string) => {
    console.log('Adding note for call:', callId);
  };

  const handleReopen = (callId: string) => {
    console.log('Reopening call:', callId);
  };

  const handleViewDetails = (callId: string) => {
    console.log('Viewing details for call:', callId);
  };

  const retryConnection = () => {
    console.log('Retrying connection...');
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        {/* Sidebar */}
        <CustomerSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-xl font-semibold text-foreground">Customer Support Dashboard</h1>
                <p className="text-sm text-muted-foreground">Real-time call management with accent modulation</p>
              </div>
            </div>

            {/* Header Stats */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-foreground">Agent Online</span>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">2</span>
                  <span className="text-muted-foreground">Active</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">24</span>
                  <span className="text-muted-foreground">Today</span>
                </div>
              </div>
            </div>
          </header>

          {/* System Status Banner */}
          <SystemStatusBanner status={systemStatus} onRetry={retryConnection} />

          {/* Main Dashboard Content */}
          <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 pb-24">
            {/* Left Column - Customer Info */}
            <div className="lg:col-span-1">
              <CustomerInfoPanel
                customer={currentCustomer}
                isLoading={isLoadingCustomer}
                onCustomerUpdate={setCurrentCustomer}
                onManualLookup={lookupCustomer}
              />
            </div>

            {/* Middle Column - Call Log */}
            <div className="lg:col-span-1">
              <CallLogPreview
                calls={callLog}
                onAddNote={handleAddNote}
                onReopen={handleReopen}
                onViewDetails={handleViewDetails}
              />
            </div>

            {/* Right Column - Analytics */}
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Phone className="w-4 h-4 text-success" />
                        <span className="text-sm font-medium">Calls Today</span>
                      </div>
                      <p className="text-2xl font-bold text-foreground">24</p>
                      <p className="text-xs text-success">+12% from yesterday</p>
                    </div>
                    
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Headphones className="w-4 h-4 text-info" />
                        <span className="text-sm font-medium">Avg Duration</span>
                      </div>
                      <p className="text-2xl font-bold text-foreground">4:32</p>
                      <p className="text-xs text-info">Optimal range</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Customer Satisfaction</span>
                        <span className="text-sm text-success">94%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-success h-2 rounded-full" style={{ width: '94%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Resolution Rate</span>
                        <span className="text-sm text-accent">87%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-accent h-2 rounded-full" style={{ width: '87%' }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Accent Modulation Stats */}
                  <div className="pt-4 border-t border-border">
                    <h4 className="text-sm font-medium mb-3">Accent Modulation</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Sessions Used</span>
                        <Badge variant="outline">18/25</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Success Rate</span>
                        <Badge className="bg-accent text-accent-foreground">96%</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>

          {/* Voice Control Bar */}
          <VoiceControlBar
            isCallActive={isCallActive}
            isMuted={isMuted}
            isOnHold={isOnHold}
            volume={volume}
            onMuteToggle={toggleMute}
            onHoldToggle={toggleHold}
            onVolumeChange={setVolume}
            onEndCall={endCall}
            accentModulationActive={accentModulationActive}
            micLevel={micLevel}
          />
        </div>

        {/* Incoming Call Banner */}
        {incomingCall && (
          <IncomingCallBanner
            caller={incomingCall}
            onAccept={acceptCall}
            onReject={rejectCall}
            isVisible={!!incomingCall}
          />
        )}
      </div>
    </SidebarProvider>
  );
}