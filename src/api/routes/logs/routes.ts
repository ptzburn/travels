import { createRoute } from "@hono/zod-openapi";
import {
  conflictSchema,
  createErrorSchema,
  forbiddenSchema,
  notFoundSchema,
  serverErrorSchema,
  SlugParamsSchema,
  tooManyRequestsSchema,
  unauthorizedSchema,
} from "~/api/utils/schemas/index.ts";
import { authMiddleware, defaultRateLimiter } from "~/api/middlewares/index.ts";
import jsonContentRequired from "~/api/utils/json-content-required.ts";
import {
  InsertLocationLogSchema,
  SelectLocationLogSchema,
} from "~/shared/schema/location-log.ts";
import * as HttpStatus from "~/shared/http-status.ts";
import jsonContent from "~/api/utils/json-content.ts";
import SlugIdParamsSchema from "~/api/utils/schemas/slug-id-params-schema.ts";

const tags = ["Location Logs"];
const ParamsSchema = SlugParamsSchema("slug", "Location slug");

export const get = createRoute({
  summary:
    "GET endpoint for fetching the selected log for an existing location",
  description:
    "Fetches an existing travel log for an existing location in the DB and then returns it",
  tags,
  method: "get",
  path: "/locations/{slug}/{id}",
  middleware: [authMiddleware, defaultRateLimiter],
  request: {
    params: SlugIdParamsSchema,
  },
  responses: {
    [HttpStatus.OK.CODE]: jsonContent(
      SelectLocationLogSchema,
      "Locaton Log schema",
    ),
    [HttpStatus.UNAUTHORIZED.CODE]: jsonContent(
      unauthorizedSchema,
      "Unauthorized",
    ),
    [HttpStatus.FORBIDDEN.CODE]: jsonContent(
      forbiddenSchema,
      "Forbidden",
    ),
    [HttpStatus.NOT_FOUND.CODE]: jsonContent(
      notFoundSchema,
      "Not found",
    ),
    [HttpStatus.UNPROCESSABLE_ENTITY.CODE]: jsonContent(
      createErrorSchema(ParamsSchema),
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
  },
});

export const post = createRoute({
  summary: "POST endpoint for adding a new log to an existing location",
  description:
    "Adds a new travel log to the selected location in the DB and then returns it",
  tags,
  method: "post",
  path: "/locations/{slug}/add",
  middleware: [authMiddleware, defaultRateLimiter],
  request: {
    params: ParamsSchema,
    body: jsonContentRequired(
      InsertLocationLogSchema,
      "Location log insert fields schema",
    ),
  },
  responses: {
    [HttpStatus.OK.CODE]: jsonContent(
      SelectLocationLogSchema,
      "Locaton Log schema",
    ),
    [HttpStatus.UNAUTHORIZED.CODE]: jsonContent(
      unauthorizedSchema,
      "Unauthorized",
    ),
    [HttpStatus.FORBIDDEN.CODE]: jsonContent(
      forbiddenSchema,
      "Forbidden",
    ),
    [HttpStatus.NOT_FOUND.CODE]: jsonContent(
      notFoundSchema,
      "Not found",
    ),
    [HttpStatus.CONFLICT.CODE]: jsonContent(
      conflictSchema,
      "Location log already exists",
    ),
    [HttpStatus.UNPROCESSABLE_ENTITY.CODE]: jsonContent(
      createErrorSchema(InsertLocationLogSchema).or(ParamsSchema),
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
  },
});

export type GetRoute = typeof get;
export type PostRoute = typeof post;
