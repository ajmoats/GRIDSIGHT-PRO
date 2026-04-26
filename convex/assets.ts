import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";
import { paginationOptsValidator } from "convex/server";

// Spec 9: CRUD - Create Asset
export const createAsset = mutation({
  args: {
    name: v.string(),
    location: v.string(),
    capacity: v.number(),
    type: v.union(v.literal("wind"), v.literal("solar")),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");

    return await ctx.db.insert("assets", {
      ...args,
      ownerId: userId, // Spec 16: Recording ownership
    });
  },
});

// Spec 11: Backend Pagination
// This satisfies the requirement to have at least one paginated list.
export const listPaginated = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return { page: [], isDone: true, continueCursor: "" };

    return await ctx.db
      .query("assets")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

// Query for the Asset Detail Page (Spec 14: Auth check)
export const get = query({
  args: { id: v.id("assets") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    const asset = await ctx.db.get(args.id);

    if (!asset || asset.ownerId !== userId) {
      return null; // Authorization enforcement
    }
    return asset;
  },
});

// Simple list for the home dashboard summary
export const listMyAssets = query({
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("assets")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .collect();
  },
});