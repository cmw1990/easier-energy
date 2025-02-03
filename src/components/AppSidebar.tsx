import { Battery, Coffee, Heart, Moon, Brain, AlarmClock } from "lucide-react";
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
  { title: "Dashboard", icon: Battery, path: "/" },
  { title: "Sleep", icon: Moon, path: "/sleep" },
  { title: "Breathing", icon: Heart, path: "/breathing" },
  { title: "Focus Test", icon: Brain, path: "/focus" },
  { title: "Caffeine", icon: Coffee, path: "/caffeine" },
  { title: "Sleep Track", icon: AlarmClock, path: "/sleep-track" },
];

export function AppSidebar() {
  const location = useLocation();
  const isMobile = useIsMobile();

  return (
    <Sidebar variant={isMobile ? "floating" : "sidebar"}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="hidden md:flex">The Well-Charged</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.path} 
                      className="flex items-center gap-2"
                      data-active={location.pathname === item.path}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
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