import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import TradingDashboard from "@/pages/TradingDashboard";
import RevenueGraphPage from "@/pages/RevenueGraphPage";
import RevenueCalendarPage from "@/pages/RevenueCalendarPage";
import RunHistoryPage from "@/pages/RunHistoryPage";
import LoginPage from "@/pages/LoginPage";

function ProtectedRoute({ component: Component, ...rest }: { component: React.ComponentType; path?: string }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return <Component />;
}

function Router() {
  const { isAuthenticated } = useAuth();
  const [location] = useLocation();

  if (isAuthenticated && location === '/login') {
    return <Redirect to="/" />;
  }

  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/">
        {() => <ProtectedRoute component={TradingDashboard} />}
      </Route>
      <Route path="/run-history">
        {() => <ProtectedRoute component={RunHistoryPage} />}
      </Route>
      <Route path="/reports/revenue-graph">
        {() => <ProtectedRoute component={RevenueGraphPage} />}
      </Route>
      <Route path="/reports/revenue-calendar">
        {() => <ProtectedRoute component={RevenueCalendarPage} />}
      </Route>
    </Switch>
  );
}

function AppLayout() {
  const { isAuthenticated } = useAuth();
  const [location] = useLocation();

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  if (!isAuthenticated || location === '/login') {
    return (
      <>
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        <main className="flex-1 overflow-hidden">
          <Router />
        </main>
      </>
    );
  }

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <header className="flex items-center justify-between gap-2 p-2 border-b" data-testid="header-main">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-hidden">
            <Router />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AppLayout />
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
