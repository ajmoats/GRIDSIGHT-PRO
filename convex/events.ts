import { query } from "./_generated/server";
import { v } from "convex/values";

export const getByAsset = query({
  args: { assetId: v.id("assets") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("events")
      .withIndex("by_asset", (q) => q.eq("assetId", args.assetId))
      .collect();
  },
});