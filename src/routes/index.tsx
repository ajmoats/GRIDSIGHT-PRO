import { createFileRoute, Link } from "@tanstack/react-router";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { LoginButton } from "../components/ui/LoginButton";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const assets = useQuery(api.assets.listMyAssets);

  if (isLoading) return <div className="p-8 text-center">Loading Grid...</div>;

  return (
    <div className="space-y-8">
      <section className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-4xl font-black tracking-tight mb-2">GRIDSIGHT PRO</h1>
        <p className="text-slate-400 max-w-md">
          Real-time energy asset performance, market pricing, and operational risk modeling.
        </p>
      </section>

      {!isAuthenticated ? (
        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
          <h2 className="text-xl font-bold mb-4">Secure Access Required</h2>
          <LoginButton />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-xl hover:border-blue-500 transition group">
            <h3 className="font-bold text-lg mb-2">Your Assets</h3>
            <p className="text-sm text-slate-500 mb-4">
              {assets?.length ?? 0} active infrastructure nodes monitored.
            </p>
            <Link to="/assets" className="text-blue-600 font-bold text-sm uppercase tracking-wider">
              View Dashboard →
            </Link>
          </div>
          <div className="p-6 border rounded-xl hover:border-blue-500 transition">
            <h3 className="font-bold text-lg mb-2">Market Data</h3>
            <p className="text-sm text-slate-500 mb-4">
              Live fuel mix and nodal pricing from EIA.
            </p>
            <Link to="/market" className="text-blue-600 font-bold text-sm uppercase tracking-wider">
              Analyze Trends →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}