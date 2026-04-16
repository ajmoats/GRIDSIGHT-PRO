import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
  }).index("by_token", ["tokenIdentifier"]),

  // Spec 7: Table 2 - Energy Assets
  assets: defineTable({
    name: v.string(),
    location: v.string(), // e.g., "ERCOT-West"
    capacity: v.number(), // MW
    type: v.union(v.literal("wind"), v.literal("solar")),
    ownerId: v.string(), // Subject from GitHub Auth
  }).index("by_owner", ["ownerId"]),

  // Spec 7: Table 3 + Spec 8: One-to-Many
  events: defineTable({
    assetId: v.id("assets"),
    type: v.union(v.literal("outage"), v.literal("maintenance"), v.literal("curtailment")),
    severity: v.number(), // 1 (Low) to 3 (Critical)
    durationHours: v.number(),
    timestamp: v.number(),
  }).index("by_asset", ["assetId"]),

  // Spec 22: External Market Data Storage
  marketData: defineTable({
    timestamp: v.number(),
    price: v.number(), // $/MWh
    wind_pct: v.number(),
    solar_pct: v.number(),
  }).index("by_timestamp", ["timestamp"]),
});