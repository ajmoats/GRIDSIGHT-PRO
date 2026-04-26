import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Route = createFileRoute("/market" as any)({
  component: MarketPage,
});

// Spec 20: Performance Data using favorite numbers
const volatilityData = [
  { time: '08:00', risk: 21 },
  { time: '10:00', risk: 42 },
  { time: '12:00', risk: 67 },
  { time: '14:00', risk: 22 },
  { time: '16:00', risk: 2586 }, // Peak Demand Spike
];

function MarketPage() {
  const market = useQuery(api.market.getLatest);

  if (market === undefined) return <div className="p-10 text-center animate-pulse">Syncing with Grid...</div>;
  if (market === null) return <div className="p-10 text-center">No market data available. Run seed script.</div>;

  const thermal_pct = 100 - market.wind_pct - market.solar_pct;

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6">
      <header>
        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic">Market Dynamics</h1>
        <p className="text-slate-500 font-medium">Real-time Generation & Pricing Dashboard</p>
      </header>

      {/* Spec 20: Grid Performance Chart (Volatility Index) */}
      <section className="p-6 bg-white border-2 border-slate-100 rounded-3xl shadow-sm">
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Market Volatility Index (Risk Modeling)</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={volatilityData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="risk" 
                stroke="#6366f1" 
                strokeWidth={4} 
                dot={{ r: 6, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Spec 22: Price Visualization */}
        <div className="p-8 bg-slate-900 text-white rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">ERCOT Nodal Price</h2>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black italic">${market.price.toFixed(2)}</span>
              <span className="text-slate-400 font-medium">/MWh</span>
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 h-24 w-24 bg-blue-500 opacity-10 rounded-full" />
        </div>

        {/* Spec 21: Fuel Mix Visualization */}
        <div className="p-8 bg-white border-2 border-slate-100 rounded-3xl shadow-sm">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Live Generation Mix</h2>
          
          <div className="flex h-14 w-full rounded-2xl overflow-hidden border-4 border-slate-50">
            <div className="bg-blue-500 transition-all duration-1000" style={{ width: `${market.wind_pct}%` }} />
            <div className="bg-orange-400 transition-all duration-1000" style={{ width: `${market.solar_pct}%` }} />
            <div className="bg-slate-200 transition-all duration-1000" style={{ width: `${thermal_pct}%` }} />
          </div>

          <div className="mt-6 flex justify-between px-2">
            <div className="text-center">
                <p className="text-xl font-black text-slate-900">{market.wind_pct}%</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Wind</p>
            </div>
            <div className="text-center border-x border-slate-100 px-8">
                <p className="text-xl font-black text-slate-900">{market.solar_pct}%</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Solar</p>
            </div>
            <div className="text-center">
                <p className="text-xl font-black text-slate-900">{thermal_pct.toFixed(0)}%</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Other</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="pt-8 border-t border-slate-100">
        <p className="text-[10px] text-center text-slate-400 uppercase font-black tracking-[0.2em]">
          Telemetry Timestamp: {new Date(market.timestamp).toLocaleString()}
        </p>
      </footer>
    </div>
  );
}