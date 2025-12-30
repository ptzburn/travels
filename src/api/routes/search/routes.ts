import { createRoute, z } from "@hono/zod-openapi";

import jsonContent from "~/api/utils/json-content.ts";
import {
  createErrorSchema,
  serverErrorSchema,
  tooManyRequestsSchema,
  unauthorizedSchema,
} from "~/api/utils/schemas/index.ts";
import * as HttpStatus from "~/shared/http-status.ts";
import { cache } from "hono/cache";
import { authMiddleware, defaultRateLimiter } from "~/api/middlewares/index.ts";
import { SearchQuerySchema } from "~/shared/schema/search.ts";
import { NominatimResultSchema } from "~/shared/schema/location.ts";

const tags = ["Search"];

export const get = createRoute({
  summary: "GET endpoint for fetching points of interest on the map",
  description: "Fetches points of interest on the map by query",
  tags,
  method: "get",
  path: "/search",
  middleware: [
    authMiddleware,
    defaultRateLimiter,
    cache({
      cacheName: "search-nominatim",
      cacheControl: "max-age=3600",
      wait: true,
    }),
  ],
  request: {
    query: SearchQuerySchema,
  },
  responses: {
    [HttpStatus.OK.CODE]: jsonContent(
      z.array(NominatimResultSchema),
      "Schema of the nominatim location results",
    ),
    [HttpStatus.UNAUTHORIZED.CODE]: jsonContent(
      unauthorizedSchema,
      "Unauthorized",
    ),
    [HttpStatus.UNPROCESSABLE_ENTITY.CODE]: jsonContent(
      createErrorSchema(SearchQuerySchema),
      "Validation error(s)",
    ),
    [HttpStatus.TOO_MANY_REQUESTS.CODE]: jsonContent(
      tooManyRequestsSchema,
      "Rate limit exceeded",
    ),
    [HttpStatus.INTERNAL_SERVER_ERROR.CODE]: jsonContent(
      serverErrorSchema,
      "Internal server error",
    ),
    [HttpStatus.GATEWAY_TIMEOUT.CODE]: jsonContent(
      serverErrorSchema,
      "Internal server error",
    ),
  },
});

export type GetRoute = typeof get;
