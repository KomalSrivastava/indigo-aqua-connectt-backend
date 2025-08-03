import { AlertTriangle, CheckCircle, XCircle, Wifi, WifiOff, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface SystemStatus {
  apiHealth: "healthy" | "degraded" | "down";
  connectionStatus: "connected" | "reconnecting" | "disconnected";
  lastUpdate?: Date;
}

interface SystemStatusBannerProps {
  status: SystemStatus;
  onRetry?: () => void;
}

export function SystemStatusBanner({ status, onRetry }: SystemStatusBannerProps) {
  const { apiHealth, connectionStatus } = status;
  
  // Don't show banner if everything is healthy
  if (apiHealth === "healthy" && connectionStatus === "connected") {
    return null;
  }

  const getStatusIcon = () => {
    if (apiHealth === "down" || connectionStatus === "disconnected") {
      return <XCircle className="w-4 h-4" />;
    }
    if (apiHealth === "degraded" || connectionStatus === "reconnecting") {
      return <AlertTriangle className="w-4 h-4" />;
    }
    return <CheckCircle className="w-4 h-4" />;
  };

  const getStatusMessage = () => {
    if (connectionStatus === "disconnected") {
      return "Connection lost. Please check your internet connection.";
    }
    if (connectionStatus === "reconnecting") {
      return "Reconnecting to server...";
    }
    if (apiHealth === "down") {
      return "Service temporarily unavailable. Our team is working to resolve this.";
    }
    if (apiHealth === "degraded") {
      return "Service experiencing delays. Some features may be slower than usual.";
    }
    return "System status unknown";
  };

  const getStatusVariant = () => {
    if (apiHealth === "down" || connectionStatus === "disconnected") {
      return "destructive";
    }
    return "default";
  };

  const getConnectionIcon = () => {
    if (connectionStatus === "disconnected") {
      return <WifiOff className="w-4 h-4" />;
    }
    if (connectionStatus === "reconnecting") {
      return <RefreshCw className="w-4 h-4 animate-spin" />;
    }
    return <Wifi className="w-4 h-4" />;
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className="max-w-6xl mx-auto">
        <Alert variant={getStatusVariant()} className="shadow-elegant">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            {getConnectionIcon()}
          </div>
          
          <AlertDescription className="flex items-center justify-between">
            <div className="flex-1">
              <span className="font-medium">{getStatusMessage()}</span>
              {status.lastUpdate && (
                <span className="ml-2 text-xs opacity-75">
                  Last update: {status.lastUpdate.toLocaleTimeString()}
                </span>
              )}
            </div>
            
            {onRetry && (connectionStatus === "disconnected" || apiHealth === "down") && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="ml-4 border-current"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Retry
              </Button>
            )}
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}