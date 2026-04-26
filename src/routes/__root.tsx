import { createRootRoute, Outlet, Link } from "@tanstack/react-router";
import { LoginButton } from "../components/ui/LoginButton";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useConvexAuth } from "convex/react";

export const Route = createRootRoute({
  component: RootLayout,
  
  // Spec 23: Global Error Boundary (Robustness Requirement)
  errorComponent: ({ error }) => {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] gap-6 p-10 text-center">
        <div className="p-4 bg-red-50 rounded-full">
          <div className="h-12 w-12 text-red-600 border-4 border-red-600 rounded-lg flex items-center justify-center font-black text-2xl">!</div>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900 uppercase italic">Telemetry Lost</h1>
          <p className="text-slate-500 font-medium max-w-md">
            A critical synchronization error occurred: <span className="text-red-500 font-mono">{error.message}</span>
          </p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold shadow-lg hover:bg-slate-800 transition-all"
        >
          RE-ESTABLISH CONNECTION
        </button>
      </div>
    );
  },

  // Spec 17: Handle unknown routes (404)
  notFoundComponent: () => {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-6 text-center">
        <h1 className="text-8xl font-black text-slate-100 absolute -z-10">404</h1>
        <div className="space-y-2 relative">
          <h2 className="text-3xl font-black text-slate-900 uppercase">Node Not Found</h2>
          <p className="text-slate-500 font-medium">The requested infrastructure node does not exist in the grid map.</p>
        </div>
        <Link 
          to="/" 
          className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold no-underline hover:bg-blue-700 transition-all"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  },
});

function RootLayout() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  // Authentication Loading State
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-900 border-t-transparent" />
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 animate-pulse">Syncing with Grid...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 text-current no-underline group">
              <span className="text-xl font-black tracking-tighter uppercase italic group-hover:text-blue-600 transition-colors">
                GridSight <span className="text-blue-600">Pro</span>
              </span>
            </Link>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-black uppercase text-slate-500 border border-slate-200">
              v1.0.4
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Spec 6 & 15: Navigation only shows if authenticated */}
            {isAuthenticated && (
              <nav className="hidden md:flex gap-8 text-[11px] font-black uppercase tracking-widest">
                <Link 
                  to={"/assets" as any}
                  className="text-slate-400 hover:text-slate-900 transition-all no-underline [&.active]:text-blue-600 [&.active]:border-b-2 [&.active]:border-blue-600 pb-1"
                >
                  Assets
                </Link>
                <Link 
                  to={"/market" as any}
                  className="text-slate-400 hover:text-slate-900 transition-all no-underline [&.active]:text-orange-600 [&.active]:border-b-2 [&.active]:border-orange-600 pb-1"
                >
                  Market
                </Link>
              </nav>
            )}
            <div className="pl-4 border-l border-slate-200">
              <LoginButton />
            </div>
          </div>
        </div>
      </header>
      
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Outlet /> 
      </main>

      {/* Development Tooling */}
      {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
    </div>
  );
}