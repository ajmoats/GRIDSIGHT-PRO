import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Spec 15: Protected Resource Fetching
 * Securely retrieves all energy assets owned by the currently logged-in user.
 */
export const getMyAssets = query({
  args: {},
  handler: async (ctx) => {
    // 1. Fetch the authenticated user's ID from @convex-dev/auth
    const userId = await getAuthUserId(ctx);
    
    // If no user is logged in, return an empty array gracefully to prevent UI crashes
    if (!userId) {
      return [];
    }

    // 2. Query assets using the type-safe 'by_owner' index match
    const userAssets = await ctx.db
      .query("assets")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .collect();

    return userAssets;
  },
});

/**
 * Spec 16: Parameterized Asset Creation
 * Allows authenticated operators to register a new wind or solar asset.
 */
export const createAsset = mutation({
  args: {
    name: v.string(),
    location: v.string(),
    capacity: v.number(),
    type: v.union(v.literal("wind"), v.literal("solar")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized: You must be logged in to provision assets.");
    }

    // Insert the asset directly tied to the correct Convex ID structure
    const assetId = await ctx.db.insert("assets", {
      name: args.name,
      location: args.location,
      capacity: args.capacity,
      type: args.type,
      ownerId: userId, // Binds as v.id("users") matching your schema
    });

    return assetId;
  },
});