import { query } from "./_generated/server";

export const getLatestStats = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("marketData")
      .order("desc")
      .first();
  },
});