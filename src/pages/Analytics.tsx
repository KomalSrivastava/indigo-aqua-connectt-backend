import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, TrendingDown, Phone, Users, Clock, Headphones } from "lucide-react";

export default function Analytics() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-primary" />
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive insights into call performance and customer satisfaction
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline">Last 7 Days</Button>
            <Button variant="outline">Export Report</Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Calls</p>
                  <p className="text-3xl font-bold text-foreground">1,247</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-success" />
                    <span className="text-xs text-success">+12.5%</span>
                  </div>
                </div>
                <Phone className="w-10 h-10 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Duration</p>
                  <p className="text-3xl font-bold text-foreground">4:32</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingDown className="w-3 h-3 text-error" />
                    <span className="text-xs text-error">-2.1%</span>
                  </div>
                </div>
                <Clock className="w-10 h-10 text-info" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Customer Satisfaction</p>
                  <p className="text-3xl font-bold text-foreground">4.8</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-success" />
                    <span className="text-xs text-success">+0.3</span>
                  </div>
                </div>
                <Users className="w-10 h-10 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Resolution Rate</p>
                  <p className="text-3xl font-bold text-foreground">94%</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-success" />
                    <span className="text-xs text-success">+3.2%</span>
                  </div>
                </div>
                <Headphones className="w-10 h-10 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Call Volume Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Call Volume Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">Call volume chart would be here</p>
                  <p className="text-sm text-muted-foreground">Integration with charting library needed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Satisfaction Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Satisfaction Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">Satisfaction trend chart would be here</p>
                  <p className="text-sm text-muted-foreground">Integration with charting library needed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Call Outcomes */}
          <Card>
            <CardHeader>
              <CardTitle>Call Outcomes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Completed</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-muted rounded-full h-2">
                    <div className="bg-success h-2 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                  <span className="text-sm font-medium">87%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Transferred</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-muted rounded-full h-2">
                    <div className="bg-info h-2 rounded-full" style={{ width: '8%' }}></div>
                  </div>
                  <span className="text-sm font-medium">8%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Missed</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-muted rounded-full h-2">
                    <div className="bg-error h-2 rounded-full" style={{ width: '5%' }}></div>
                  </div>
                  <span className="text-sm font-medium">5%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agent Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Top Agents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="text-sm text-muted-foreground">45 calls</p>
                </div>
                <Badge className="bg-success text-success-foreground">4.9 ⭐</Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Mike Wilson</p>
                  <p className="text-sm text-muted-foreground">42 calls</p>
                </div>
                <Badge className="bg-success text-success-foreground">4.8 ⭐</Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Jane Smith</p>
                  <p className="text-sm text-muted-foreground">38 calls</p>
                </div>
                <Badge className="bg-success text-success-foreground">4.7 ⭐</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Accent Modulation Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Accent Modulation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Sessions Used</span>
                <Badge variant="outline">147/200</Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Success Rate</span>
                <Badge className="bg-accent text-accent-foreground">96%</Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Customer Preference</span>
                <Badge className="bg-info text-info-foreground">89%</Badge>
              </div>
              
              <div className="pt-2">
                <p className="text-sm text-muted-foreground">
                  Most customers prefer accent modulation for better communication
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Peak Hours */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Peak Call Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
              {Array.from({ length: 24 }, (_, i) => {
                const hour = i;
                const isPeak = hour >= 9 && hour <= 17;
                const height = isPeak ? Math.random() * 60 + 40 : Math.random() * 30 + 10;
                
                return (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div 
                      className={`w-full rounded-t ${isPeak ? 'bg-primary' : 'bg-muted'} transition-all`}
                      style={{ height: `${height}px` }}
                    ></div>
                    <span className="text-xs text-muted-foreground">
                      {hour.toString().padStart(2, '0')}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Peak hours: 9 AM - 5 PM (business hours)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}