import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";
import { paginationOptsValidator } from "convex/server";

// Spec 9: CRUD (Create)
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
      ownerId: userId, // Correctly linking to the User ID (Spec 16)
    });
  },
});

// Used for the high-level summary on the Index page
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

/**
 * Spec 11: Backend Pagination
 * This allows the frontend to load assets in chunks (e.g., 5 at a time).
 */
export const listPaginated = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
       // Return empty pagination result if not logged in
       return { page: [], isDone: true, continueCursor: "" };
    }

    return await ctx.db
      .query("assets")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

/**
 * Used for the Asset Detail page (assets.$assetId.tsx)
 * Fetches a single asset and verifies the user owns it (Spec 14/16).
 */
export const get = query({
  args: { id: v.id("assets") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    const asset = await ctx.db.get(args.id);

    if (!asset || asset.ownerId !== userId) {
      return null; // Authorization check
    }

    return asset;
  },
});