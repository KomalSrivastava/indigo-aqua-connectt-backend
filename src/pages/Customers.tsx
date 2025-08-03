import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Search, Filter, Plus, Mail, Phone, Star, Calendar } from "lucide-react";
import { useState } from "react";

const mockCustomers = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    tier: "Premium",
    status: "Active",
    lastContact: "2 hours ago",
    totalCalls: 15,
    satisfaction: 4.8,
    avatar: null
  },
  {
    id: "2", 
    name: "Mike Chen",
    email: "mike.chen@email.com",
    phone: "+1 (555) 987-6543",
    tier: "VIP",
    status: "Active",
    lastContact: "1 day ago",
    totalCalls: 32,
    satisfaction: 4.9,
    avatar: null
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.r@email.com", 
    phone: "+1 (555) 456-7890",
    tier: "Standard",
    status: "Inactive",
    lastContact: "1 week ago",
    totalCalls: 8,
    satisfaction: 4.3,
    avatar: null
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.kim@email.com",
    phone: "+1 (555) 321-0987",
    tier: "Premium", 
    status: "Active",
    lastContact: "3 hours ago",
    totalCalls: 21,
    satisfaction: 4.7,
    avatar: null
  }
];

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTier, setSelectedTier] = useState("All");

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "VIP":
        return "bg-accent text-accent-foreground";
      case "Premium":
        return "bg-primary text-primary-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "Active" 
      ? "bg-success/10 text-success border-success/20"
      : "bg-muted text-muted-foreground border-border";
  };

  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesTier = selectedTier === "All" || customer.tier === selectedTier;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              Customer Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage customer profiles and interaction history
            </p>
          </div>
          
          <Button className="bg-primary text-primary-foreground hover:bg-primary-hover">
            <Plus className="w-4 h-4 mr-2" />
            Add Customer
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Customers</p>
                  <p className="text-2xl font-bold text-foreground">1,247</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">VIP Customers</p>
                  <p className="text-2xl font-bold text-foreground">128</p>
                </div>
                <Star className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Today</p>
                  <p className="text-2xl font-bold text-foreground">89</p>
                </div>
                <Phone className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Satisfaction</p>
                  <p className="text-2xl font-bold text-foreground">4.7</p>
                </div>
                <Star className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search customers by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                {["All", "VIP", "Premium", "Standard"].map((tier) => (
                  <Button
                    key={tier}
                    variant={selectedTier === tier ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTier(tier)}
                  >
                    {tier}
                  </Button>
                ))}
              </div>
              
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Customer List */}
        <div className="grid gap-4">
          {filteredCustomers.map((customer) => (
            <Card key={customer.id} className="hover:shadow-soft transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={customer.avatar || ""} alt={customer.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {customer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Customer Info */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{customer.name}</h3>
                        <Badge className={getTierColor(customer.tier)}>
                          {customer.tier}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{customer.email}</p>
                      <p className="text-sm text-muted-foreground">{customer.phone}</p>
                    </div>
                    
                    {/* Status & Activity */}
                    <div>
                      <Badge variant="outline" className={getStatusColor(customer.status)}>
                        {customer.status}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        Last contact: {customer.lastContact}
                      </p>
                    </div>
                    
                    {/* Stats */}
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">{customer.totalCalls}</span>
                        <span className="text-muted-foreground"> total calls</span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">{customer.satisfaction}</span>
                        <span className="text-muted-foreground"> satisfaction</span>
                      </p>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2 justify-end">
                      <Button variant="outline" size="sm">
                        <Phone className="w-3 h-3 mr-1" />
                        Call
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="w-3 h-3 mr-1" />
                        Email
                      </Button>
                      <Button variant="outline" size="sm">
                        <Calendar className="w-3 h-3 mr-1" />
                        Schedule
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No customers found</h3>
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