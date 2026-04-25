import { createRootRoute, Outlet } from "@tanstack/react-router";
import { LoginButton } from "../components/ui/LoginButton"; // Adjust path if needed
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/70 bg-background/90 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">GridSight Pro</span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold uppercase text-slate-500 border">v1.0</span>
          </div>
          <LoginButton />
        </div>
      </header>
      
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* THIS IS THE MAGIC LINE: It renders index.tsx here */}
        <Outlet /> 
      </main>

      <TanStackRouterDevtools />
    </div>
  );
}