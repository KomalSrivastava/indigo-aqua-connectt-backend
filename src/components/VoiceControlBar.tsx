import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Phone, 
  PhoneOff, 
  Pause, 
  Play,
  Settings,
  Headphones
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";

interface VoiceControlBarProps {
  isCallActive: boolean;
  isMuted: boolean;
  isOnHold: boolean;
  volume: number;
  onMuteToggle: () => void;
  onHoldToggle: () => void;
  onVolumeChange: (volume: number) => void;
  onEndCall: () => void;
  accentModulationActive: boolean;
  micLevel: number;
}

export function VoiceControlBar({
  isCallActive,
  isMuted,
  isOnHold,
  volume,
  onMuteToggle,
  onHoldToggle,
  onVolumeChange,
  onEndCall,
  accentModulationActive,
  micLevel
}: VoiceControlBarProps) {
  const [waveformBars] = useState(Array(8).fill(0));
  const [animatedBars, setAnimatedBars] = useState(Array(8).fill(0));

  // Animate waveform bars
  useEffect(() => {
    if (!isCallActive || isMuted) {
      setAnimatedBars(Array(8).fill(0));
      return;
    }

    const interval = setInterval(() => {
      setAnimatedBars(prev => 
        prev.map(() => Math.random() * 100)
      );
    }, 150);

    return () => clearInterval(interval);
  }, [isCallActive, isMuted]);

  if (!isCallActive) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border shadow-elegant">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Left Section - Waveform & Status */}
          <div className="flex items-center gap-4">
            {/* Waveform Visualization */}
            <div className="flex items-center gap-1 h-8">
              {animatedBars.map((height, index) => (
                <div
                  key={index}
                  className="w-1 bg-accent rounded-full transition-all duration-150"
                  style={{ height: `${Math.max(4, height * 0.3)}px` }}
                />
              ))}
            </div>

            {/* Call Status */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-foreground">
                {isOnHold ? "Call on Hold" : "Active Call"}
              </span>
            </div>

            {/* Accent Modulation Status */}
            {accentModulationActive && (
              <Tooltip>
                <TooltipTrigger>
                  <Badge className="bg-info text-info-foreground">
                    <Headphones className="w-3 h-3 mr-1" />
                    Indian → American (Live)
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Real-time accent modulation active</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* Center Section - Main Controls */}
          <div className="flex items-center gap-2">
            {/* Mute Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isMuted ? "default" : "outline"}
                  size="lg"
                  onClick={onMuteToggle}
                  className={isMuted ? "bg-error text-error-foreground" : ""}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isMuted ? "Unmute (M)" : "Mute (M)"}</p>
              </TooltipContent>
            </Tooltip>

            {/* Hold Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isOnHold ? "default" : "outline"}
                  size="lg"
                  onClick={onHoldToggle}
                  className={isOnHold ? "bg-primary text-primary-foreground" : ""}
                >
                  {isOnHold ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isOnHold ? "Resume Call (H)" : "Hold Call (H)"}</p>
              </TooltipContent>
            </Tooltip>

            {/* End Call Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="default"
                  size="lg"
                  onClick={onEndCall}
                  className="bg-error text-error-foreground hover:bg-error/90 px-6"
                >
                  <PhoneOff className="w-5 h-5 mr-2" />
                  End Call
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>End Call (E)</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Right Section - Volume & Settings */}
          <div className="flex items-center gap-4">
            {/* Volume Control */}
            <div className="flex items-center gap-2 min-w-32">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onVolumeChange(volume > 0 ? 0 : 50)}
              >
                {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              <Slider
                value={[volume]}
                onValueChange={(value) => onVolumeChange(value[0])}
                max={100}
                step={5}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground w-8">
                {volume}%
              </span>
            </div>

            {/* Mic Level Indicator */}
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-muted-foreground" />
              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent transition-all duration-100 rounded-full"
                  style={{ width: `${micLevel}%` }}
                />
              </div>
            </div>

            {/* Settings */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Call Settings</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Keyboard Shortcuts Info */}
        <div className="mt-2 text-xs text-muted-foreground text-center">
          Shortcuts: M (mute) • H (hold) • E (end call) • Space (push to talk)
        </div>
      </div>
    </div>
  );
}