import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createAsset = mutation({
  args: {
    name: v.string(),
    location: v.string(),
    capacity: v.number(),
    type: v.union(v.literal("wind"), v.literal("solar")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    return await ctx.db.insert("assets", {
      ...args,
      ownerId: identity.subject, // Using the GitHub Auth subject
    });
  },
});

export const listMyAssets = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    return await ctx.db
      .query("assets")
      .withIndex("by_owner", (q) => q.eq("ownerId", identity.subject))
      .collect();
  },
});