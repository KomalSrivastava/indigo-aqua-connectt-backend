import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings, Bell, Mic, Phone, Users, Shield, Palette } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Settings className="w-8 h-8 text-primary" />
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure your customer support dashboard preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Doe" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="john.doe@company.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="extension">Phone Extension</Label>
                <Input id="extension" defaultValue="1234" />
              </div>
              
              <Button>Save Profile</Button>
            </CardContent>
          </Card>

          {/* Call Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Call Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Auto-Answer Incoming Calls</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically answer calls after 3 rings
                  </p>
                </div>
                <Switch />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Call Recording</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically record all calls for quality assurance
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="maxCallDuration">Maximum Call Duration (minutes)</Label>
                <Input id="maxCallDuration" type="number" defaultValue="30" className="w-32" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="callTimeout">Call Timeout (seconds)</Label>
                <Input id="callTimeout" type="number" defaultValue="60" className="w-32" />
              </div>
            </CardContent>
          </Card>

          {/* Voice Modulation Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="w-5 h-5" />
                Voice Modulation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Enable Accent Modulation</Label>
                  <p className="text-sm text-muted-foreground">
                    Transform Indian accent to American accent in real-time
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Voice Quality</Label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Standard</Button>
                  <Button size="sm">High Quality</Button>
                  <Button variant="outline" size="sm">Ultra High</Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="modulationStrength">Modulation Strength</Label>
                <Input 
                  id="modulationStrength" 
                  type="range" 
                  min="1" 
                  max="10" 
                  defaultValue="7" 
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Subtle</span>
                  <span>Natural</span>
                  <span>Strong</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Desktop Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Show desktop notifications for incoming calls
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Sound Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Play sound when receiving calls or messages
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive daily summary reports via email
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="flex gap-2">
                  <Button size="sm">Light</Button>
                  <Button variant="outline" size="sm">Dark</Button>
                  <Button variant="outline" size="sm">Auto</Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Dashboard Layout</Label>
                <div className="flex gap-2">
                  <Button size="sm">Compact</Button>
                  <Button variant="outline" size="sm">Comfortable</Button>
                  <Button variant="outline" size="sm">Spacious</Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Animations</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable smooth transitions and animations
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Session Timeout</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically log out after inactivity
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Input type="number" defaultValue="60" className="w-20" />
                  <span className="text-sm text-muted-foreground">minutes</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Data Retention</Label>
                  <p className="text-sm text-muted-foreground">
                    How long to keep call recordings and logs
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">30 days</Button>
                  <Button size="sm">90 days</Button>
                  <Button variant="outline" size="sm">1 year</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <Button>Save All Settings</Button>
            <Button variant="outline">Reset to Defaults</Button>
            <Button variant="outline">Export Settings</Button>
          </div>
        </div>
      </div>
    </div>
  );
}