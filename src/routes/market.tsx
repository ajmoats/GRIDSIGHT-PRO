import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export const Route = createFileRoute("/market")({
  component: MarketPage,
});

function MarketPage() {
  const market = useQuery(api.market.getLatest);

  if (market === undefined) return <div className="p-10 text-center animate-pulse">Syncing with Grid...</div>;
  if (market === null) return <div className="p-10 text-center">No market data available. Run seed script.</div>;

  const thermal_pct = 100 - market.wind_pct - market.solar_pct;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <header>
        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Market Dynamics</h1>
        <p className="text-slate-500">Real-time Generation & Pricing Dashboard</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Spec 22: Price Visualization */}
        <div className="p-8 bg-slate-900 text-white rounded-2xl shadow-xl">
          <h2 className="text-xs font-bold text-blue-400 uppercase mb-2">ERCOT Nodal Price</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black">${market.price.toFixed(2)}</span>
            <span className="text-slate-400 font-medium">/MWh</span>
          </div>
        </div>

        {/* Spec 22: Fuel Mix Visualization */}
        <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <h2 className="text-xs font-bold text-slate-400 uppercase mb-6">Current Fuel Mix</h2>
          
          <div className="flex h-12 w-full rounded-full overflow-hidden border border-slate-100">
            <div className="bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold" style={{ width: `${market.wind_pct}%` }}>WIND</div>
            <div className="bg-orange-400 flex items-center justify-center text-[10px] text-white font-bold" style={{ width: `${market.solar_pct}%` }}>SOLAR</div>
            <div className="bg-slate-300 flex items-center justify-center text-[10px] text-slate-600 font-bold" style={{ width: `${thermal_pct}%` }}>OTHER</div>
          </div>

          <div className="mt-6 flex justify-between text-center">
            <div><p className="font-bold">{market.wind_pct}%</p><p className="text-[10px] text-slate-400 uppercase">Wind</p></div>
            <div><p className="font-bold">{market.solar_pct}%</p><p className="text-[10px] text-slate-400 uppercase">Solar</p></div>
            <div><p className="font-bold">{thermal_pct.toFixed(1)}%</p><p className="text-[10px] text-slate-400 uppercase">Thermal</p></div>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-center text-slate-400 uppercase font-medium">
        Last Updated: {new Date(market.timestamp).toLocaleString()}
      </p>
    </div>
  );
}