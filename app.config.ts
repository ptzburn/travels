import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    vite: {
        plugins: [tailwindcss()],
    },
    routeDir: "./client/routes",
    server: {
        preset: "deno_server",
        compatibilityDate: "2025-12-12",
    },
});
