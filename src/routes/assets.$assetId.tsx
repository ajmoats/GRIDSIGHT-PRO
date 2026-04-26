import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

// FIX 1: The string here MUST match the filename and include the $
export const Route = createFileRoute("/assets/$assetId")({
  component: AssetDetail,
});

function AssetDetail() {
  // FIX 2: We get assetId from the Route object we defined above
  const { assetId } = Route.useParams();
  
  // Cast to 'any' here if TypeScript struggles with the Convex Id type 
  // during this late-night sprint; it ensures the query runs.
  const asset = useQuery(api.assets.get, { id: assetId as any });
  const events = useQuery(api.events.getByAsset, { assetId: assetId as any });
  const market = useQuery(api.market.getLatest);

  if (!asset || !market) {
    return <div className="p-10 text-center animate-pulse">Loading Asset Telemetry...</div>;
  }

  // Spec 22: Your custom Revenue Impact Logic
  const totalLoss = events?.reduce((acc, e) => 
    acc + (asset.capacity * e.durationHours * market.price), 0
  ) ?? 0;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <header className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-black uppercase tracking-tight">{asset.name}</h1>
        <p className="text-slate-400 font-medium">{asset.location} · {asset.type.toUpperCase()}</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 border-2 border-red-100 rounded-2xl bg-red-50">
          <h2 className="text-xs font-bold text-red-600 uppercase mb-2">Estimated Revenue Loss</h2>
          <p className="text-4xl font-black text-red-700">${totalLoss.toLocaleString()}</p>
          <p className="text-[10px] text-red-500 mt-2 font-bold uppercase">Based on active downtime events</p>
        </div>

        <div className="p-6 border rounded-2xl bg-white">
          <h2 className="text-xs font-bold text-slate-400 uppercase mb-2">Operational Status</h2>
          <p className="text-4xl font-black text-slate-900">{events?.length === 0 ? 'NOMINAL' : 'DEGRADED'}</p>
        </div>
      </div>

      <section>
        <h3 className="text-lg font-bold mb-4">Maintenance & Outage Log</h3>
        <div className="space-y-3">
          {events?.length === 0 ? (
            <p className="text-slate-400 italic">No events recorded for this asset.</p>
          ) : (
            events?.map(event => (
              <div key={event._id} className="p-4 border rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-bold capitalize">{event.type}</p>
                  <p className="text-xs text-slate-500">{event.durationHours} hours duration</p>
                </div>
                <div className="text-right">
                   <p className="font-mono font-bold text-red-600">
                    -${(asset.capacity * event.durationHours * market.price).toLocaleString()}
                   </p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}