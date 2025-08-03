import { User, Mail, Phone, Clock, Tag, Plus, Edit3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface CustomerInfo {
  id?: string;
  name?: string;
  email?: string;
  phone: string;
  avatar?: string;
  tier?: "Standard" | "Premium" | "VIP";
  recentInteractions?: {
    date: string;
    type: "call" | "email" | "chat";
    outcome: string;
  }[];
  notes?: string[];
  tags?: string[];
}

interface CustomerInfoPanelProps {
  customer: CustomerInfo | null;
  isLoading: boolean;
  onCustomerUpdate?: (customer: CustomerInfo) => void;
  onManualLookup?: (phone: string) => void;
}

export function CustomerInfoPanel({ 
  customer, 
  isLoading, 
  onCustomerUpdate,
  onManualLookup 
}: CustomerInfoPanelProps) {
  const [manualPhone, setManualPhone] = useState("");
  const [newNote, setNewNote] = useState("");

  const getTierColor = (tier?: string) => {
    switch (tier) {
      case "VIP":
        return "bg-accent text-accent-foreground";
      case "Premium":
        return "bg-primary text-primary-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const addNote = () => {
    if (newNote.trim() && customer && onCustomerUpdate) {
      const updatedCustomer = {
        ...customer,
        notes: [...(customer.notes || []), newNote.trim()]
      };
      onCustomerUpdate(updatedCustomer);
      setNewNote("");
    }
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
          <Separator />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!customer) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Customer Lookup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            No customer data found. Enter phone number for manual lookup:
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="Phone number"
              value={manualPhone}
              onChange={(e) => setManualPhone(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={() => onManualLookup?.(manualPhone)}
              disabled={!manualPhone.trim()}
            >
              Lookup
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Customer Information
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Customer Basic Info */}
        <div className="flex items-start gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={customer.avatar} alt={customer.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {customer.name ? customer.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">
                {customer.name || "Unknown Customer"}
              </h3>
              {customer.tier && (
                <Badge className={getTierColor(customer.tier)}>
                  {customer.tier}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Phone className="w-3 h-3" />
              {customer.phone}
            </div>
            
            {customer.email && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Mail className="w-3 h-3" />
                {customer.email}
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Recent Interactions */}
        {customer.recentInteractions && customer.recentInteractions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Recent Interactions
            </h4>
            <div className="space-y-2">
              {customer.recentInteractions.slice(0, 3).map((interaction, index) => (
                <div key={index} className="text-xs bg-muted p-2 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="font-medium capitalize">{interaction.type}</span>
                    <span className="text-muted-foreground">{interaction.date}</span>
                  </div>
                  <p className="text-muted-foreground mt-1">{interaction.outcome}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {customer.tags && customer.tags.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Tags
            </h4>
            <div className="flex flex-wrap gap-1">
              {customer.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Edit3 className="w-4 h-4" />
            Notes
          </h4>
          
          {customer.notes && customer.notes.length > 0 && (
            <div className="space-y-1 mb-3">
              {customer.notes.map((note, index) => (
                <div key={index} className="text-xs bg-muted p-2 rounded-md">
                  {note}
                </div>
              ))}
            </div>
          )}
          
          <div className="flex gap-2">
            <Input
              placeholder="Add a note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="flex-1 text-sm"
              onKeyPress={(e) => e.key === 'Enter' && addNote()}
            />
            <Button 
              size="sm" 
              onClick={addNote}
              disabled={!newNote.trim()}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-2">
          <h4 className="text-sm font-medium mb-2">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              View History
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              Update Info
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}