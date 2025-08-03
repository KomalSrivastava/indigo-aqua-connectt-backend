import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { History, Search, Filter, Download, Phone, PhoneIncoming, PhoneOutgoing, Clock } from "lucide-react";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

const mockCallHistory = [
  {
    id: "1",
    callerName: "Sarah Johnson",
    callerPhone: "+1 (555) 123-4567",
    type: "incoming",
    duration: 245,
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    outcome: "completed",
    agent: "John Doe",
    notes: "Billing inquiry resolved. Customer satisfied with solution.",
    tags: ["billing", "resolved", "premium"]
  },
  {
    id: "2", 
    callerName: "Mike Chen",
    callerPhone: "+1 (555) 987-6543",
    type: "outgoing",
    duration: 180,
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    outcome: "completed",
    agent: "Jane Smith",
    notes: "Follow-up call for VIP customer. Scheduled next appointment.",
    tags: ["vip", "follow-up", "scheduled"]
  },
  {
    id: "3",
    callerName: "Emily Rodriguez", 
    callerPhone: "+1 (555) 456-7890",
    type: "incoming",
    duration: 0,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    outcome: "missed",
    agent: "System",
    notes: "Missed call - no agents available.",
    tags: ["missed", "callback-required"]
  },
  {
    id: "4",
    callerName: "David Kim",
    callerPhone: "+1 (555) 321-0987", 
    type: "incoming",
    duration: 320,
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    outcome: "transferred",
    agent: "Mike Wilson",
    notes: "Technical issue transferred to specialist team.",
    tags: ["technical", "transferred", "specialist"]
  },
  {
    id: "5",
    callerName: "Lisa Park",
    callerPhone: "+1 (555) 654-3210",
    type: "incoming", 
    duration: 156,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    outcome: "completed",
    agent: "Sarah Lee",
    notes: "Account update completed successfully.",
    tags: ["account", "update", "completed"]
  }
];

export default function CallHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOutcome, setSelectedOutcome] = useState("All");
  const [selectedType, setSelectedType] = useState("All");

  const getCallIcon = (type: string, outcome: string) => {
    if (outcome === "missed") return <Phone className="w-4 h-4 text-error" />;
    if (type === "incoming") return <PhoneIncoming className="w-4 h-4 text-success" />;
    if (type === "outgoing") return <PhoneOutgoing className="w-4 h-4 text-info" />;
    return <Phone className="w-4 h-4 text-muted-foreground" />;
  };

  const getOutcomeBadge = (outcome: string) => {
    const styles = {
      completed: "bg-success/10 text-success border-success/20",
      missed: "bg-error/10 text-error border-error/20", 
      transferred: "bg-info/10 text-info border-info/20"
    };

    return (
      <Badge variant="outline" className={styles[outcome as keyof typeof styles] || ""}>
        {outcome}
      </Badge>
    );
  };

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return "—";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const filteredCalls = mockCallHistory.filter(call => {
    const matchesSearch = call.callerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         call.callerPhone.includes(searchTerm) ||
                         call.agent.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOutcome = selectedOutcome === "All" || call.outcome === selectedOutcome;
    const matchesType = selectedType === "All" || call.type === selectedType;
    return matchesSearch && matchesOutcome && matchesType;
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <History className="w-8 h-8 text-primary" />
              Call History
            </h1>
            <p className="text-muted-foreground mt-1">
              Complete history of all customer calls and interactions
            </p>
          </div>
          
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Calls Today</p>
                  <p className="text-2xl font-bold text-foreground">147</p>
                </div>
                <Phone className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Duration</p>
                  <p className="text-2xl font-bold text-foreground">4:32</p>
                </div>
                <Clock className="w-8 h-8 text-info" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-foreground">134</p>
                </div>
                <PhoneIncoming className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Missed</p>
                  <p className="text-2xl font-bold text-foreground">8</p>
                </div>
                <Phone className="w-8 h-8 text-error" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4 items-center flex-wrap">
              <div className="flex-1 min-w-64 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, phone, or agent..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <label className="text-sm font-medium text-foreground">Type:</label>
                {["All", "incoming", "outgoing"].map((type) => (
                  <Button
                    key={type}
                    variant={selectedType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType(type)}
                  >
                    {type}
                  </Button>
                ))}
              </div>
              
              <div className="flex gap-2">
                <label className="text-sm font-medium text-foreground">Outcome:</label>
                {["All", "completed", "missed", "transferred"].map((outcome) => (
                  <Button
                    key={outcome}
                    variant={selectedOutcome === outcome ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedOutcome(outcome)}
                  >
                    {outcome}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call History List */}
        <div className="space-y-4">
          {filteredCalls.map((call) => (
            <Card key={call.id} className="hover:shadow-soft transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Avatar & Call Icon */}
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-muted text-muted-foreground">
                        {call.callerName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 bg-card border border-border rounded-full p-1">
                      {getCallIcon(call.type, call.outcome)}
                    </div>
                  </div>

                  {/* Call Details */}
                  <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-4">
                    {/* Caller Info */}
                    <div className="lg:col-span-2">
                      <h3 className="font-semibold text-foreground">{call.callerName}</h3>
                      <p className="text-sm text-muted-foreground">{call.callerPhone}</p>
                      <p className="text-sm text-muted-foreground">Agent: {call.agent}</p>
                    </div>
                    
                    {/* Call Details */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {getOutcomeBadge(call.outcome)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Duration: {formatDuration(call.duration)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(call.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                    
                    {/* Notes */}
                    <div className="lg:col-span-2">
                      <p className="text-sm text-foreground mb-2">{call.notes}</p>
                      <div className="flex flex-wrap gap-1">
                        {call.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Call Back
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCalls.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <History className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No calls found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or filters.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}