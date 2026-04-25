import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";

export function LoginButton() {
  const { signIn, signOut } = useAuthActions();
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) return <button disabled className="opacity-50">Loading...</button>;
 
  if (isAuthenticated) {
    return (
      <button 
        onClick={() => void signOut()}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
      >
        Sign Out
      </button>
    );
  }

  return (
    <button
      onClick={() => void signIn("github")}
      className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-md flex items-center gap-2 transition"
    >
      Sign in with GitHub
    </button>
  );
}