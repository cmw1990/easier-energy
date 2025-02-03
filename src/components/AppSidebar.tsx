import { Battery, Coffee, Heart, Moon, Brain, Activity, BarChart } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const menuItems = [
  { 
    title: "Dashboard",
    icon: BarChart,
    path: "/",
    description: "Overview of your energy and activities"
  },
  {
    title: "Sleep",
    icon: Moon,
    path: "/sleep",
    description: "Track sleep and set smart alarms"
  },
  {
    title: "Breathing",
    icon: Heart,
    path: "/breathing",
    description: "Guided breathing exercises"
  },
  {
    title: "Focus",
    icon: Brain,
    path: "/focus",
    description: "Test and track your focus"
  },
  {
    title: "Energy",
    icon: Battery,
    path: "/caffeine",
    description: "Track caffeine and energy levels"
  },
  {
    title: "Activity",
    icon: Activity,
    path: "/sleep-track",
    description: "Track daily activities"
  },
];

export function AppSidebar() {
  const location = useLocation();
  const isMobile = useIsMobile();

  return (
    <Sidebar variant={isMobile ? "floating" : "sidebar"}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="hidden md:flex">Energy Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.path} 
                      className="flex items-center gap-2 group relative"
                      data-active={location.pathname === item.path}
                    >
                      <item.icon className="h-5 w-5 transition-colors" />
                      <div>
                        <span className="font-medium">{item.title}</span>
                        {!isMobile && (
                          <p className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}