import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Ensure the route is defined correctly for TanStack Router's latest version
export const Route = createFileRoute('/')({
  component: Dashboard,
})

function Dashboard() {
  // These will resolve once 'npx convex dev' updates your generated files
  const assets = useQuery(api.assets.listMyAssets);
  const market = useQuery(api.market.getLatestStats);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header>
        <h1 className="text-4xl font-extrabold tracking-tight">GridSight Pro</h1>
        <p className="text-muted-foreground">Real-time wind energy asset monitoring.</p>
      </header>
      
      {/* Market Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Market Price</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {market?.price ? `$${market.price.toFixed(2)}` : "--"} /MWh
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Wind Gen %</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{market?.wind_pct ?? "--"}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Asset Grid */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Your Fleet</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Explicitly typing 'asset' as any until types regenerate */}
          {assets?.map((asset: any) => (
            <Card key={asset._id} className="hover:border-primary cursor-pointer transition-colors">
              <CardHeader>
                <CardTitle>{asset.name}</CardTitle>
                <p className="text-xs text-muted-foreground">{asset.type}</p>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-semibold">{asset.capacity} MW</p>
                <p className="text-sm text-muted-foreground">{asset.location}</p>
              </CardContent>
            </Card>
          ))}
          {assets?.length === 0 && <p>No assets found. Try seeding your database!</p>}
        </div>
      </section>
    </div>
  );
}