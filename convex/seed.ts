import { mutation } from "./_generated/server";
import { auth } from "./auth";

export const seed = mutation({
  handler: async (ctx) => {
    // 1. Get the real User ID (Spec 16)
    // Using the auth helper ensures the ID matches the v.id("users") type
    let userId = await auth.getUserId(ctx);

    // fallback for terminal seeding: find the first user in the DB
    if (!userId) {
      const firstUser = await ctx.db.query("users").first();
      if (firstUser) {
        userId = firstUser._id;
      } else {
        throw new Error("No users found. Log into the app once to create a user before seeding.");
      }
    }

    // 2. Clear existing data (Optional, keeps dev environment clean)
    // This helps avoid duplicate "West Texas Wind Farm A" entries
    const existingAssets = await ctx.db.query("assets").collect();
    for (const asset of existingAssets) { await ctx.db.delete(asset._id); }

    // 3. Seed Assets (Spec 7)
    const assetId = await ctx.db.insert("assets", {
      name: "West Texas Wind Farm A",
      location: "ERCOT-West",
      capacity: 150,
      type: "wind",
      ownerId: userId,
    });

    const solarId = await ctx.db.insert("assets", {
      name: "Permian Basin Solar Hub",
      location: "ERCOT-North",
      capacity: 250,
      type: "solar",
      ownerId: userId,
    });

    // 4. Seed Events (Spec 8 - One-to-Many)
    // Linking events to our new assets
    await ctx.db.insert("events", {
      assetId,
      type: "outage",
      severity: 3, 
      durationHours: 12,
      timestamp: Date.now() - 86400000, // 1 day ago
    });

    await ctx.db.insert("events", {
      assetId: solarId,
      type: "curtailment",
      severity: 1, 
      durationHours: 2,
      timestamp: Date.now(),
    });

    // 5. Seed Market Data (Spec 22)
    await ctx.db.insert("marketData", {
      timestamp: Date.now(),
      price: 45.20, // $/MWh
      wind_pct: 22.5,
      solar_pct: 15.0,
    });

    console.log("GridSight Pro: Database seeded successfully for user", userId);
  },
});