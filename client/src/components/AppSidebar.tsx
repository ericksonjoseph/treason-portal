import { BarChart3, FileText, ChevronDown, TrendingUp, Calendar } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import {
  Sidebar,
  SidebarContent,
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

export function AppSidebar() {
  const [location] = useLocation();

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

              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton 
                      isActive={isReportsActive}
                      data-testid="button-reports-toggle"
                    >
                      <FileText />
                      <span>Reports</span>
                      <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
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
    </Sidebar>
  );
}
