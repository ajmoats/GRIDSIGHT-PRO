import { createFileRoute, Link } from "@tanstack/react-router";
import { usePaginatedQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export const Route = createFileRoute("/assets")({
  component: AssetsPage,
});

function AssetsPage() {
  // Spec 11 & 12: Proper Pagination implementation
  const { results, status, loadMore } = usePaginatedQuery(
    api.assets.listPaginated,
    {},
    { initialNumItems: 5 }
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-baseline border-b pb-4">
        <h1 className="text-3xl font-black text-slate-900">ENERGY ASSETS</h1>
        <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">
          Infrastructure Nodes
        </p>
      </div>

      <div className="grid gap-4">
        {results.map((asset) => (
          <Link
            key={asset._id}
            to="/assets/$assetId"
            params={{ assetId: asset._id }}
            className="group flex items-center justify-between p-6 border rounded-2xl bg-white hover:border-blue-500 hover:shadow-lg transition-all no-underline text-current"
          >
            <div className="flex gap-4 items-center">
              <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg ${asset.type === 'wind' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                {asset.type === 'wind' ? 'W' : 'S'}
              </div>
              <div>
                <h3 className="font-bold text-xl group-hover:text-blue-600 transition-colors">
                  {asset.name}
                </h3>
                <p className="text-sm text-slate-500">{asset.location}</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-2xl font-black">{asset.capacity} <span className="text-xs text-slate-400">MW</span></p>
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-tighter">Total Capacity</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Spec 12: Load More Button */}
      {status === "CanLoadMore" && (
        <button
          onClick={() => loadMore(5)}
          className="w-full py-4 mt-4 border-2 border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all uppercase tracking-widest text-xs"
        >
          Load More Infrastructure
        </button>
      )}

      {status === "LoadingMore" && (
        <div className="text-center p-4 text-slate-400 animate-pulse text-xs font-bold uppercase">
          Querying Grid Nodes...
        </div>
      )}
    </div>
  );
}