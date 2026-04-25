import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { 
  createRouter, 
  RouterProvider, 
  createHashHistory 
} from "@tanstack/react-router";
import { api } from "../convex/_generated/api";
import { routeTree } from "./routeTree.gen";
import "./index.css";

// 1. Initialize the Convex Client
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

// 2. Create Hash History 
// This bypasses the Vite "Double Pathing" issue by using /#/ instead of /
const hashHistory = createHashHistory();

// 3. Configure the Router
const router = createRouter({
  routeTree,
  history: hashHistory,
  // When using Hash History, the basepath should usually be "/"
  // because the sub-path /hw6-ajmoats/ is handled by the browser/Vite
  basepath: "", // short again, otherwise doubles url-try empty
  context: { api },
});
 
// 4. Register the router for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// 5. Render the App
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConvexAuthProvider client={convex}>
      <RouterProvider router={router} />
    </ConvexAuthProvider>
  </StrictMode>,
);