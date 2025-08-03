import { Phone, PhoneOff, Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface IncomingCallBannerProps {
  caller: {
    name: string;
    phone: string;
    avatar?: string;
    isVip?: boolean;
  };
  onAccept: () => void;
  onReject: () => void;
  isVisible: boolean;
}

export function IncomingCallBanner({ caller, onAccept, onReject, isVisible }: IncomingCallBannerProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top-2 duration-300">
      <div className="bg-card border border-border rounded-xl shadow-elegant p-6 min-w-80 max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Incoming Call</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">Live</span>
          </div>
        </div>

        {/* Caller Info */}
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="w-12 h-12">
            <AvatarImage src={caller.avatar} alt={caller.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {caller.name ? caller.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-foreground">{caller.name || "Unknown Caller"}</h4>
              {caller.isVip && (
                <Badge variant="secondary" className="bg-accent text-accent-foreground">
                  <Star className="w-3 h-3 mr-1" />
                  VIP
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{caller.phone}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={onReject}
            variant="outline"
            className="flex-1 bg-error/10 border-error/20 text-error hover:bg-error hover:text-error-foreground"
            size="lg"
          >
            <PhoneOff className="w-4 h-4 mr-2" />
            Decline
          </Button>
          
          <Button
            onClick={onAccept}
            className="flex-1 bg-success text-success-foreground hover:bg-success/90"
            size="lg"
          >
            <Phone className="w-4 h-4 mr-2" />
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}