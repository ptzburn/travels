import type { AppRouteHandler } from "~/api/lib/types.ts";
import { GATEWAY_TIMEOUT, OK } from "~/shared/http-status.ts";
import { HTTPException } from "hono/http-exception";

import type { GetRoute } from "./routes.ts";
import env from "~/env.ts";
import { NominatimResult } from "~/shared/types.ts";

export const get: AppRouteHandler<GetRoute> = async (c) => {
  const { q } = c.req.valid("query");

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${q}&format=json`,
    {
      signal: AbortSignal.timeout(5000),
      headers: {
        "User-Agent": `Solid Travels | ${env.CONTACT_EMAIL}`,
      },
    },
  );

  if (!response.ok) {
    throw new HTTPException(GATEWAY_TIMEOUT.CODE, {
      message: GATEWAY_TIMEOUT.MESSAGE,
    });
  }

  const json = await response.json() as NominatimResult[];

  return c.json(json, OK.CODE);
};
