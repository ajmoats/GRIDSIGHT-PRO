import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// Note the lowercase 'tanstackRouter' here
import { tanstackRouter } from "@tanstack/router-plugin/vite";

export default defineConfig({
  base: "/hw6-ajmoats/", // yes trailing slash
  plugins: [
    // Use the lowercase version here as well
    tanstackRouter({
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts",
      basepath: "/hw6-ajmoats", // no trailing slash
    }), 
    react(), 
    tailwindcss()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});