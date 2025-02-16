
import { useLocation, Link } from "react-router-dom";
import { 
  ClipboardList, 
  FileText, 
  PenTool, 
  Brain, 
  History, 
  Settings,
  Menu,
  ChevronLeft
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
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

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
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <>
      {/* Floating toggle button when sidebar is collapsed */}
      {isCollapsed && (
        <div className="fixed top-4 left-4 z-50 md:hidden">
          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-10 w-10 rounded-full shadow-md"
                  aria-label="Expand navigation"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SidebarTrigger>
            </TooltipTrigger>
            <TooltipContent side="right">
              Expand navigation
            </TooltipContent>
          </Tooltip>
        </div>
      )}
      
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <div className="flex items-center justify-between px-3 py-2">
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8"
                  aria-label={isCollapsed ? "Expand navigation" : "Collapse navigation"}
                >
                  <ChevronLeft className={`h-4 w-4 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} />
                </Button>
              </SidebarTrigger>
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const link = (
                    <Link 
                      to={item.path}
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent/30 transition-colors"
                      aria-current={isActive ? "page" : undefined}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  );

                  return (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton
                        asChild
                        className={isActive ? "bg-accent/50" : ""}
                        tooltip={isCollapsed ? item.label : undefined}
                      >
                        {isCollapsed ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              {link}
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              {item.label}
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          link
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
