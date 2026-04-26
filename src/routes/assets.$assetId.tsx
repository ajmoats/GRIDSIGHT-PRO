import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export const Route = createFileRoute("/assets/$assetId" as any)({
  component: AssetDetail,
});

function AssetDetail() {
  const { assetId } = Route.useParams();
  
  // Data Fetching
  const asset = useQuery(api.assets.get, { id: assetId as any });
  const events = useQuery(api.events.getByAsset, { assetId: assetId as any });
  const market = useQuery(api.market.getLatest);

  if (!asset || !market) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Interrogating Node: {assetId}</p>
      </div>
    );
  }

  // Spec 22: Revenue Impact Logic
  const totalLoss = events?.reduce((acc, e) => 
    acc + (asset.capacity * e.durationHours * market.price), 0
  ) ?? 0;

  const isDegraded = events && events.length > 0;

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header: Industrial Theme */}
      <header className="bg-slate-900 text-white p-10 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
                <span className={`h-3 w-3 rounded-full animate-pulse ${isDegraded ? 'bg-red-500' : 'bg-green-500'}`} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                    {isDegraded ? 'Node Status: Degraded' : 'Node Status: Nominal'}
                </span>
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic">{asset.name}</h1>
            <p className="text-slate-400 font-medium tracking-wide">
                {asset.location} <span className="mx-2 text-slate-700">|</span> {asset.type.toUpperCase()} CONFIGURATION
            </p>
        </div>
        {/* Abstract background element */}
        <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
      </header>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-8 border-2 border-slate-100 rounded-3xl bg-white shadow-sm">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Nameplate Capacity</h2>
          <p className="text-4xl font-black text-slate-900 italic">{asset.capacity}<span className="text-sm not-italic ml-1 text-slate-400">MW</span></p>
        </div>

        <div className="p-8 border-2 border-slate-100 rounded-3xl bg-white shadow-sm">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Operational State</h2>
          <p className={`text-4xl font-black italic ${isDegraded ? 'text-orange-600' : 'text-green-600'}`}>
            {isDegraded ? 'DEGRADED' : 'NOMINAL'}
          </p>
        </div>

        <div className={`p-8 rounded-3xl shadow-xl transition-colors duration-500 ${isDegraded ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-400 opacity-50'}`}>
          <h2 className={`text-[10px] font-black uppercase tracking-widest mb-4 ${isDegraded ? 'text-red-200' : 'text-slate-400'}`}>Revenue Leakage</h2>
          <p className="text-4xl font-black italic">${totalLoss.toLocaleString()}</p>
        </div>
      </div>

      {/* Event Log */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4">
            <h3 className="text-xl font-black uppercase tracking-tight italic">Maintenance & Outage Log</h3>
            <span className="bg-slate-900 text-white px-3 py-1 rounded-lg text-[10px] font-black">{events?.length ?? 0} EVENTS</span>
        </div>

        <div className="space-y-4">
          {events?.length === 0 ? (
            <div className="p-12 border-2 border-dashed border-slate-200 rounded-3xl text-center">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Zero anomalous events detected in current window.</p>
            </div>
          ) : (
            events?.map(event => (
              <div key={event._id} className="p-6 border-2 border-slate-100 rounded-2xl flex justify-between items-center bg-white hover:border-slate-300 transition-all group">
                <div>
                  <p className="font-black text-lg uppercase italic text-slate-800">{event.type}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duration: {event.durationHours} Hours</p>
                </div>
                <div className="text-right">
                   <p className="text-xl font-black text-red-600 italic">
                    -${(asset.capacity * event.durationHours * market.price).toLocaleString()}
                   </p>
                   <p className="text-[10px] font-black text-slate-400 uppercase">Impact at ${market.price}/MWh</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <footer className="pt-10">
        <p className="text-[10px] text-center text-slate-300 font-black uppercase tracking-[0.3em]">
            System Node: {(assetId as string).slice(0, 12)}... [SECURE ENCRYPTED FEED]
        </p>
      </footer>
    </div>
  );
}