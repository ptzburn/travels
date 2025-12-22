import type { AppRouteHandler } from "~/shared/types.ts";
import { OK } from "~/shared/http-status.ts";

import type { HealthCheckRoute } from "./routes.ts";

export const healthCheck: AppRouteHandler<HealthCheckRoute> = (c) => {
  const timestamp = new Date().toISOString();

  return c.json(
    {
      status: "ok",
      timestamp,
    },
    OK.CODE,
  );
};
