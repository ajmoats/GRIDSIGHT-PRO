import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server"; // Import this!

export default defineSchema({
  // This spread operator adds the required authAccounts, authSessions, etc.
  ...authTables, 

  // Extension of user structure
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    role: v.union(v.literal("admin"), v.literal("operator")), 
    assignedRegion: v.string(), // Set RTOs/ISOs
  }),

  // Spec 7: Table 2 - Energy Assets
  assets: defineTable({
    name: v.optional(v.string()),
    location: v.optional(v.string()),
    capacity: v.optional(v.number()),
    type: v.union(v.literal("wind"), v.literal("solar")),
    ownerId: v.id("users"), // Reference to the users table for ownership
  }) .index("by_owner", ["ownerId"]) .index("by_type", ["type"]),

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
    region: v.string(),
    timestamp: v.number(),
    price: v.number(),
    wind_pct: v.number(),
    solar_pct: v.number(),
  }).index("by_timestamp", ["timestamp"]) .index("by_region_time", ["region", "timestamp"]),
});