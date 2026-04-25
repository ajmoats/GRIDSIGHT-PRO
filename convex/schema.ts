import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server"; // Import this!

export default defineSchema({
  // This spread operator adds the required authAccounts, authSessions, etc.
  ...authTables, 

  // Spec 7: Table 2 - Energy Assets
  assets: defineTable({
    name: v.string(),
    location: v.string(),
    capacity: v.number(),
    type: v.union(v.literal("wind"), v.literal("solar")),
    ownerId: v.string(), 
  }).index("by_owner", ["ownerId"]),

  // Spec 7: Table 3 + Spec 8: One-to-Many
  events: defineTable({
    assetId: v.id("assets"),
    type: v.union(v.literal("outage"), v.literal("maintenance"), v.literal("curtailment")),
    severity: v.number(),
    durationHours: v.number(),
    timestamp: v.number(),
  }).index("by_asset", ["assetId"]),

  // Spec 22: External Market Data Storage
  marketData: defineTable({
    timestamp: v.number(),
    price: v.number(),
    wind_pct: v.number(),
    solar_pct: v.number(),
  }).index("by_timestamp", ["timestamp"]),
});