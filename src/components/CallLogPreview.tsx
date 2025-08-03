import { Phone, PhoneIncoming, PhoneOutgoing, Clock, FileText, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";

interface CallLogEntry {
  id: string;
  callerName?: string;
  callerPhone: string;
  avatar?: string;
  type: "incoming" | "outgoing" | "missed";
  duration: number; // in seconds
  timestamp: Date;
  outcome: "completed" | "missed" | "rejected" | "transferred";
  hasNote: boolean;
  tags?: string[];
}

interface CallLogPreviewProps {
  calls: CallLogEntry[];
  onAddNote: (callId: string) => void;
  onReopen: (callId: string) => void;
  onViewDetails: (callId: string) => void;
}

export function CallLogPreview({ calls, onAddNote, onReopen, onViewDetails }: CallLogPreviewProps) {
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
      rejected: "bg-error/10 text-error border-error/20",
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

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Calls
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {calls.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Phone className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No recent calls</p>
            </div>
          ) : (
            calls.map((call) => (
              <div key={call.id} className="group border border-border rounded-lg p-3 hover:shadow-soft transition-shadow">
                <div className="flex items-start gap-3">
                  {/* Caller Avatar & Icon */}
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={call.avatar} alt={call.callerName} />
                      <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                        {call.callerName ? call.callerName.charAt(0).toUpperCase() : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 bg-card border border-border rounded-full p-1">
                      {getCallIcon(call.type, call.outcome)}
                    </div>
                  </div>

                  {/* Call Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-foreground truncate">
                            {call.callerName || "Unknown Caller"}
                          </h4>
                          {call.hasNote && (
                            <FileText className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground truncate">{call.callerPhone}</p>
                        
                        <div className="flex items-center flex-wrap gap-2 mt-2">
                          {getOutcomeBadge(call.outcome)}
                          <span className="text-xs text-muted-foreground">
                            {formatDuration(call.duration)}
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            {formatDistanceToNow(call.timestamp, { addSuffix: true })}
                          </span>
                        </div>

                        {/* Tags */}
                        {call.tags && call.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {call.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {call.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{call.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Actions Menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onViewDetails(call.id)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onAddNote(call.id)}>
                            {call.hasNote ? "Edit Note" : "Add Note"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onReopen(call.id)}>
                            Call Back
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Show More Button */}
        {calls.length > 0 && (
          <div className="mt-4 pt-3 border-t border-border">
            <Button variant="outline" className="w-full" size="sm">
              View All Call History
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}