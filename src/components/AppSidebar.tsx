
import { useLocation, Link } from "react-router-dom";
import { 
  ClipboardList, 
  FileText, 
  PenTool, 
  Brain, 
  History, 
  Settings 
} from "lucide-react";
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

const navigationItems = [
  {
    label: "Manual Entry",
    icon: PenTool,
    path: "/contact/manual",
  },
  {
    label: "Contact Details",
    icon: FileText,
    path: "/contact/view",
  },
  {
    label: "AI Assessment",
    icon: Brain,
    path: "/contact/manual",
  },
  {
    label: "Past Conversations",
    icon: History,
    path: "/past-conversations",
  },
  {
    label: "Admin Settings",
    icon: Settings,
    path: "/admin",
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      className={isActive ? "bg-accent/50" : ""}
                    >
                      <Link 
                        to={item.path}
                        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent/30 transition-colors"
                        aria-current={isActive ? "page" : undefined}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
