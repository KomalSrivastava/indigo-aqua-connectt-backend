import { Phone, Users, History, Settings, BarChart3, Headphones } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Active Calls", url: "/", icon: Phone, badge: "2" },
  { title: "Customers", url: "/customers", icon: Users },
  { title: "Call History", url: "/history", icon: History },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Agent Status", url: "/status", icon: Headphones },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function CustomerSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary text-primary-foreground font-medium shadow-soft" 
      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-smooth";

  return (
    <Sidebar className="border-sidebar-border bg-sidebar">
      <SidebarContent className="p-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Headphones className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="text-lg font-semibold text-sidebar-foreground">SupportDesk</h2>
                <p className="text-xs text-muted-foreground">Customer Care</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-3">
            {!collapsed ? "Navigation" : ""}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <NavLink 
                      to={item.url} 
                      end 
                      className="flex items-center gap-3 w-full"
                      aria-label={item.title}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium text-sm">{item.title}</span>
                      {item.badge && (
                        <span className="ml-auto bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full font-medium">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Agent Status at bottom */}
        {!collapsed && (
          <div className="mt-auto pt-6 border-t border-sidebar-border">
            <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <div className="text-sm">
                <p className="font-medium text-sidebar-foreground">Agent Online</p>
                <p className="text-xs text-muted-foreground">Ready for calls</p>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}