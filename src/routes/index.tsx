import { createFileRoute, Link } from "@tanstack/react-router";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { LoginButton } from "../components/ui/LoginButton";

export const Route = createFileRoute("/" as any)({
  component: Index,
});

function Index() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const assets = useQuery(api.assets.listMyAssets);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Hero Header */}
      <header className="bg-slate-900 text-white p-10 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-black tracking-tighter mb-2 italic">GRIDSIGHT PRO</h1>
          <p className="text-slate-400 max-w-md font-medium">
            Next-gen energy asset monitoring and real-time market risk analysis.
          </p>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-10">
           <div className="h-32 w-32 rounded-full border-8 border-white" />
        </div>
      </header>

      <main>
        {isLoading ? (
          <div className="flex justify-center p-20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
          </div>
        ) : !isAuthenticated ? (
          <div className="text-center p-16 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 text-balance">
              Secure Telemetry Connection Required
            </h2>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">
              Please sign in with your engineering credentials to access the grid dashboard.
            </p>
            <LoginButton />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Asset Control Card */}
            <div className="group p-8 border-2 border-slate-100 rounded-3xl bg-white hover:border-blue-500 hover:shadow-xl transition-all">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Infrastructure</h2>
              <div className="mb-6">
                <span className="text-5xl font-black text-slate-900">{assets?.length ?? 0}</span>
                <p className="text-slate-500 font-medium">Active Nodes Monitored</p>
              </div>
              <Link 
                to={"/assets" as any}
                className="inline-flex items-center text-blue-600 font-bold no-underline hover:gap-2 transition-all"
              >
                GO TO ASSETS <span className="ml-1">→</span>
              </Link>
            </div>

            {/* Market Risk Card */}
            <div className="group p-8 border-2 border-slate-100 rounded-3xl bg-white hover:border-orange-500 hover:shadow-xl transition-all">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Market Insight</h2>
              <div className="mb-6">
                <span className="text-5xl font-black text-slate-900">EIA</span>
                <p className="text-slate-500 font-medium">Real-Time Fuel Mix & Pricing</p>
              </div>
              <Link 
                to={"/market" as any}
                className="inline-flex items-center text-orange-600 font-bold no-underline hover:gap-2 transition-all"
              >
                VIEW MARKET <span className="ml-1">→</span>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}