import { useState, useEffect } from 'react';
import { BarChart3, FileText, ChevronDown, TrendingUp, Calendar, History, Moon, Sun, LogOut } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function AppSidebar() {
  const [location] = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const handleThemeToggle = () => {
    document.documentElement.classList.toggle('dark');
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = () => {
    logout();
    setIsUserDialogOpen(false);
  };

  const getUserInitials = (username: string) => {
    return username
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isReportsActive = location.startsWith('/reports');

  return (
    <Sidebar data-testid="sidebar-main">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Treason</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location === '/'}>
                  <Link href="/" data-testid="link-charts">
                    <BarChart3 />
                    <span>Charts</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location === '/run-history'}>
                  <Link href="/run-history" data-testid="link-run-history">
                    <History />
                    <span>Run History</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <Collapsible defaultOpen={true} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton 
                      isActive={isReportsActive}
                      data-testid="button-reports-toggle"
                    >
                      <FileText />
                      <span>Reports</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton 
                          asChild 
                          isActive={location === '/reports/revenue-graph'}
                        >
                          <Link href="/reports/revenue-graph" data-testid="link-revenue-graph">
                            <TrendingUp />
                            <span>Revenue Graph</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton 
                          asChild 
                          isActive={location === '/reports/revenue-calendar'}
                        >
                          <Link href="/reports/revenue-calendar" data-testid="link-revenue-calendar">
                            <Calendar />
                            <span>Revenue Calendar</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          {user && (
            <SidebarMenuItem>
              <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
                <DialogTrigger asChild>
                  <div>
                    <SidebarMenuButton className="hover-elevate w-full" data-testid="button-user-profile">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                        {getUserInitials(user.username)}
                      </div>
                      <span className="truncate">{user.username}</span>
                    </SidebarMenuButton>
                  </div>
                </DialogTrigger>
                <DialogContent data-testid="dialog-user-profile">
                  <DialogHeader>
                    <DialogTitle>User Profile</DialogTitle>
                    <DialogDescription>
                      Your account information
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col gap-4 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-medium">
                        {getUserInitials(user.username)}
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium" data-testid="text-username">{user.username}</p>
                        <p className="text-xs text-muted-foreground">Trader</p>
                      </div>
                    </div>
                    <Separator />
                    <Button 
                      variant="destructive" 
                      onClick={handleLogout} 
                      className="w-full"
                      data-testid="button-logout"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleThemeToggle} data-testid="button-theme-toggle">
              {isDarkMode ? <Sun /> : <Moon />}
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
