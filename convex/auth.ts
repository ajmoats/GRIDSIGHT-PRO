// convex/auth.ts
import GitHub from "@auth/core/providers/github";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [GitHub],
  callbacks: {
    async redirect({ redirectTo }) {
      // Ensure the redirect includes the /#/ for TanStack Hash History
      // If it's just the base URL, append #/
      return redirectTo.includes("#") 
        ? redirectTo 
        : `${redirectTo.replace(/\/$/, "")}/#/`;
    },
  },
});