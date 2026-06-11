import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

/**
 * Spec 10 & 22: Efficient retrieval of market snapshots.
 * Returns the most recent nodal price and fuel mix.
 */
export const getLatest = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("marketData")
      .withIndex("by_timestamp")
      .order("desc")
      .first();
  },
});

/**
 * Spec 21: Additional Topic (Actions/External Data)
 * This mutation is called by the action below to save new data.
 */
export const saveMarketSnapshot = mutation({
  args: {
    region: v.string(),
    price: v.number(),
    wind_pct: v.number(),
    solar_pct: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("marketData", {
      ...args,
      timestamp: Date.now(),
    });
  },
});

/**
 * Spec 21: Action to simulate an EIA API fetch.
 * This can be triggered by a Cron job or manually from the dashboard.
 */
export const fetchEIAData = action({
  args: {},
  handler: async (ctx) => {
    // Simulating real-world volatility
    const simulatedPrice = 30 + Math.random() * 120;
    const wind = 15 + Math.random() * 30;
    const solar = 10 + Math.random() * 25;

    await ctx.runMutation(api.market.saveMarketSnapshot, {
      region: "ERCOT", // Pass target market region as needed
      price: parseFloat(simulatedPrice.toFixed(2)),
      wind_pct: parseFloat(wind.toFixed(1)),
      solar_pct: parseFloat(solar.toFixed(1)),
    });
  },
});