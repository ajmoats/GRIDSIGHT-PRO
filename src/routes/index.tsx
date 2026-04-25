import { createFileRoute } from "@tanstack/react-router";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { LoginButton } from "../components/ui/LoginButton";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const assets = useQuery(api.assets.listMyAssets);

  return (
    <div className="p-8 max-w-4xl mx-auto font-sans">
      <header className="flex justify-between items-center border-b pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">GridSight Pro</h1>
          <p className="text-slate-500">Energy Asset Management System</p>
        </div>
        <LoginButton />
      </header>

      <main>
        {isLoading ? (
          <div className="flex justify-center p-12">Loading...</div>
        ) : !isAuthenticated ? (
          <div className="text-center p-12 bg-slate-50 border rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Welcome to GridSight</h2>
            <LoginButton />
          </div>
        ) : (
          <section>
             <h2 className="text-2xl font-semibold mb-6">Active Assets</h2>
             {assets === undefined ? (
               <p>Loading assets...</p>
             ) : assets.length === 0 ? (
               <p className="italic text-slate-500">No assets found. Add one in the Convex Dashboard!</p>
             ) : (
               <div className="grid gap-4">
                 {assets.map((asset) => (
                   <div key={asset._id} className="p-4 border rounded-lg bg-white shadow-sm">
                     <h3 className="font-bold">{asset.name}</h3>
                     <p className="text-sm text-slate-600">{asset.location} ({asset.capacity} MW)</p>
                   </div>
                 ))}
               </div>
             )}
          </section>
        )}
      </main>
    </div>
  );
}