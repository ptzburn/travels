import configureOpenAPI from "~/api/lib/configure-open-api.ts";
import createApp from "~/api/lib/create-app.ts";
import healthcheck from "~/api/routes/healthcheck/index.ts";
import locations from "./routes/locations/index.ts";
import search from "./routes/search/index.ts";

const app = createApp().basePath("/api");

configureOpenAPI(app);

const routes = [
  healthcheck,
  locations,
  search,
] as const;

routes.forEach((route) => {
  app.route("/", route);
});

export type AppType = typeof routes[number];

export default app;
