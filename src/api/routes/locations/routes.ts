import { createRoute } from "@hono/zod-openapi";

import jsonContent from "~/api/utils/json-content.ts";
import {
  conflictSchema,
  createErrorSchema,
  serverErrorSchema,
  tooManyRequestsSchema,
  unauthorizedSchema,
} from "~/api/utils/schemas/index.ts";
import * as HttpStatus from "~/shared/http-status.ts";
import {
  InsertLocationSchema,
  SelectLocationSchema,
} from "~/shared/schema/location.ts";
import jsonContentRequired from "~/api/utils/json-content-required.ts";
import { authMiddleware, defaultRateLimiter } from "~/api/middlewares/index.ts";

const tags = ["Locations"];

export const post = createRoute({
  summary: "POST endpoint for adding locations",
  description: "Adds a new location to the DB and then returns it",
  tags,
  method: "post",
  path: "/locations",
  middleware: [authMiddleware, defaultRateLimiter],
  request: {
    body: jsonContentRequired(
      InsertLocationSchema,
      "Basic info for the new location",
    ),
  },
  responses: {
    [HttpStatus.OK.CODE]: jsonContent(
      SelectLocationSchema,
      "Locaton schema",
    ),
    [HttpStatus.UNAUTHORIZED.CODE]: jsonContent(
      unauthorizedSchema,
      "Unauthorized",
    ),
    [HttpStatus.UNPROCESSABLE_ENTITY.CODE]: jsonContent(
      createErrorSchema(InsertLocationSchema),
      "Validation error(s)",
    ),
    [HttpStatus.CONFLICT.CODE]: jsonContent(
      conflictSchema,
      "Location already exists",
    ),
    [HttpStatus.TOO_MANY_REQUESTS.CODE]: jsonContent(
      tooManyRequestsSchema,
      "Rate limit exceeded",
    ),
    [HttpStatus.INTERNAL_SERVER_ERROR.CODE]: jsonContent(
      serverErrorSchema,
      "Internal server error",
    ),
  },
});

export type PostRoute = typeof post;
