import { query } from "./_generated/server";
import { v } from "convex/values";

export const getMyAssets = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    // Filter by ownerId (Spec 7)
    return await ctx.db
      .query("assets")
      .withIndex("by_owner", (q) => q.eq("ownerId", identity.subject))
      .collect();
  },
});