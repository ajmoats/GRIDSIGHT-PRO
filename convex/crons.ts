import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

// Fetch new market data every hour (Spec 21)
crons.interval(
  "fetch-eia-data",
  { minutes: 60 },
  api.market.fetchEIAData,
);

export default crons;