import { createRootRoute, Outlet, Link } from "@tanstack/react-router"; // 1. Added Link
import { LoginButton } from "../components/ui/LoginButton";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useConvexAuth } from "convex/react";

export const Route = createRootRoute({
  component: RootLayout,
  // Spec 17: Handle unknown routes
  notFoundComponent: () => {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <h1 className="text-4xl font-bold text-slate-900">404</h1>
        <p className="text-muted-foreground">This grid node does not exist.</p>
        {/* Use Link here for the 404 return */}
        <Link to="/" className="text-blue-500 hover:underline font-medium">
          Return to Dashboard
        </Link>
      </div>
    );
  },
});

function RootLayout() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  // CRITICAL: If auth is loading, we wait. 
  // This prevents the router from thinking we are unauthenticated 
  // during the split-second GitHub redirect.
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-900 border-t-transparent" />
          <p className="text-sm font-medium animate-pulse">Syncing with Grid...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/70 bg-background/90 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 text-current no-underline">
              <span className="text-xl font-bold tracking-tight text-slate-900">GridSight Pro</span>
            </Link>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold uppercase text-slate-500 border">
              v1.0
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Spec 15: Navigation only shows if authenticated */}
            {isAuthenticated && (
              <nav className="hidden md:flex gap-6 text-sm font-medium mr-4">
                {/* 2. Swapped <a> for <Link> for instant navigation */}
                <Link 
                  to="/assets" 
                  className="hover:text-primary transition [&.active]:font-bold [&.active]:text-blue-600"
                >
                  Assets
                </Link>
                <Link 
                  to="/market" 
                  className="hover:text-primary transition [&.active]:font-bold [&.active]:text-blue-600"
                >
                  Market
                </Link>
              </nav>
            )}
            <LoginButton />
          </div>
        </div>
      </header>
      
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet /> 
      </main>

      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </div>
  );
}