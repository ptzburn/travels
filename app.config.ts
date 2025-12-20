import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import "./src/env.ts";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  middleware: "./src/client/middleware/index.ts",
  routeDir: "./client/routes",
  server: {
    preset: "deno_server",
    compatibilityDate: "2025-12-12",
  },
});
