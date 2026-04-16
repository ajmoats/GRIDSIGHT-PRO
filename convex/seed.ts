import { mutation } from "./_generated/server";

export const seed = mutation({
  handler: async (ctx) => {
    // Check if a real user is logged in (for dashboard runs)
    const identity = await ctx.auth.getUserIdentity();
    
    /** * Spec 16: Ownership
     * If running from terminal, 'identity' is null. We use a placeholder 
     * string so the database doesn't crash on missing required fields.
     */
    const ownerId = identity?.subject ?? "terminal-seed-user";

    // 1. Seed Assets (Spec 7 - Table 2)
    const assetId = await ctx.db.insert("assets", {
      name: "West Texas Wind Farm A",
      location: "ERCOT-West",
      capacity: 150, // 150 MW
      type: "wind",
      ownerId: ownerId as any, 
    });

    console.log("Seeded Asset ID:", assetId);

    // 2. Seed Events (Spec 7 - Table 3 & Spec 8 - One-to-Many)
    // This creates a 'Critical' outage linked to the farm above.
    await ctx.db.insert("events", {
      assetId,
      type: "outage",
      severity: 3, 
      durationHours: 4,
      timestamp: Date.now() - 3600000, // 1 hour ago
    });

    // 3. Seed Market Data (Spec 22 - External Data Simulation)
    // This provides the $/MWh price for your Revenue Impact logic.
    await ctx.db.insert("marketData", {
      timestamp: Date.now(),
      price: 128.50, // High price spike simulated from EIA patterns
      wind_pct: 14.2,
      solar_pct: 38.5,
    });

    console.log("Database seeded successfully!");
  },
});