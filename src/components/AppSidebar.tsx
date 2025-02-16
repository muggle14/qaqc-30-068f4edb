
import { useLocation, Link } from "react-router-dom";
import { 
  PenTool,
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
  /* Temporarily disabled navigation items
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
  */
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
          <Button 
            variant="outline" 
            size="icon"
            className="h-10 w-10 rounded-full shadow-md"
            aria-label="Expand navigation"
            asChild
          >
            <SidebarTrigger>
              <Menu className="h-4 w-4" />
            </SidebarTrigger>
          </Button>
        </div>
      )}
      
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <div className="flex items-center justify-between px-3 py-2">
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8"
                aria-label={isCollapsed ? "Expand navigation" : "Collapse navigation"}
                asChild
              >
                <SidebarTrigger>
                  <ChevronLeft className={`h-4 w-4 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} />
                </SidebarTrigger>
              </Button>
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => {
                  const isActive = location.pathname === item.path;

                  return (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton asChild>
                        {isCollapsed ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link 
                                to={item.path}
                                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent/30 transition-colors"
                                aria-current={isActive ? "page" : undefined}
                              >
                                <item.icon className="h-5 w-5" />
                                <span>{item.label}</span>
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              {item.label}
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <Link 
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent/30 transition-colors ${isActive ? "bg-accent/50" : ""}`}
                            aria-current={isActive ? "page" : undefined}
                          >
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                          </Link>
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
