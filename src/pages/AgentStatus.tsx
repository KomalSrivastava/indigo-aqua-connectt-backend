import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Headphones, Wifi, WifiOff, Phone, Clock, Users, CheckCircle, AlertCircle } from "lucide-react";

export default function AgentStatus() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Headphones className="w-8 h-8 text-primary" />
              Agent Status
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitor agent availability and performance in real-time
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">System Online</span>
            </div>
            <Button>Refresh Status</Button>
          </div>
        </div>

        {/* Current Agent Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    JD
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">John Doe</h3>
                  <p className="text-muted-foreground">Senior Support Agent</p>
                  <Badge className="bg-success text-success-foreground mt-1">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Available
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">8</p>
                  <p className="text-sm text-muted-foreground">Calls Today</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">32m</p>
                  <p className="text-sm text-muted-foreground">Online Time</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">4.9</p>
                  <p className="text-sm text-muted-foreground">Rating</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Switch defaultChecked />
                  <span className="text-sm">Available for Calls</span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch defaultChecked />
                  <span className="text-sm">Accent Modulation</span>
                </div>
                <Button variant="outline" size="sm">
                  Take Break
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Agents</p>
                  <p className="text-2xl font-bold text-foreground">24</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Available</p>
                  <p className="text-2xl font-bold text-success">18</p>
                </div>
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">On Call</p>
                  <p className="text-2xl font-bold text-info">4</p>
                </div>
                <Phone className="w-8 h-8 text-info" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">On Break</p>
                  <p className="text-2xl font-bold text-error">2</p>
                </div>
                <Clock className="w-8 h-8 text-error" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agent List */}
        <Card>
          <CardHeader>
            <CardTitle>All Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Sarah Johnson", status: "available", calls: 12, rating: 4.9, online: "2h 15m" },
                { name: "Mike Wilson", status: "on-call", calls: 8, rating: 4.8, online: "1h 45m" },
                { name: "Jane Smith", status: "available", calls: 15, rating: 4.7, online: "3h 22m" },
                { name: "David Kim", status: "on-call", calls: 6, rating: 4.9, online: "1h 12m" },
                { name: "Emily Rodriguez", status: "break", calls: 9, rating: 4.6, online: "2h 8m" },
                { name: "Lisa Park", status: "available", calls: 11, rating: 4.8, online: "2h 55m" },
                { name: "Tom Brown", status: "on-call", calls: 7, rating: 4.5, online: "1h 33m" },
                { name: "Anna Chen", status: "available", calls: 13, rating: 4.9, online: "3h 1m" }
              ].map((agent, index) => {
                const getStatusBadge = (status: string) => {
                  switch (status) {
                    case "available":
                      return <Badge className="bg-success text-success-foreground">Available</Badge>;
                    case "on-call":
                      return <Badge className="bg-info text-info-foreground">On Call</Badge>;
                    case "break":
                      return <Badge className="bg-error text-error-foreground">On Break</Badge>;
                    default:
                      return <Badge variant="outline">Offline</Badge>;
                  }
                };
                
                const getStatusIcon = (status: string) => {
                  switch (status) {
                    case "available":
                      return <Wifi className="w-4 h-4 text-success" />;
                    case "on-call":
                      return <Phone className="w-4 h-4 text-info" />;
                    case "break":
                      return <Clock className="w-4 h-4 text-error" />;
                    default:
                      return <WifiOff className="w-4 h-4 text-muted-foreground" />;
                  }
                };

                return (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-soft transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-muted text-muted-foreground">
                            {agent.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 bg-card border border-border rounded-full p-1">
                          {getStatusIcon(agent.status)}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-foreground">{agent.name}</h3>
                        <p className="text-sm text-muted-foreground">Online: {agent.online}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="font-medium text-foreground">{agent.calls}</p>
                        <p className="text-xs text-muted-foreground">Calls</p>
                      </div>
                      
                      <div className="text-center">
                        <p className="font-medium text-foreground">{agent.rating}</p>
                        <p className="text-xs text-muted-foreground">Rating</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {getStatusBadge(agent.status)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-success" />
                <div>
                  <p className="font-medium">Call Server</p>
                  <p className="text-sm text-success">Operational</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-success" />
                <div>
                  <p className="font-medium">Voice Modulation</p>
                  <p className="text-sm text-success">Online</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <AlertCircle className="w-8 h-8 text-accent" />
                <div>
                  <p className="font-medium">Analytics Service</p>
                  <p className="text-sm text-accent">Limited</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}