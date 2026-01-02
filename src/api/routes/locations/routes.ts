import { createRoute, z } from "@hono/zod-openapi";

import jsonContent from "~/api/utils/json-content.ts";
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
import * as HttpStatus from "~/shared/http-status.ts";
import {
  InsertLocationSchema,
  SelectLocationSchema,
  UpdateLocationSchema,
} from "~/shared/schema/location.ts";
import jsonContentRequired from "~/api/utils/json-content-required.ts";
import { authMiddleware, defaultRateLimiter } from "~/api/middlewares/index.ts";

const tags = ["Locations"];
const ParamsSchema = SlugParamsSchema("slug", "Location slug");

export const get = createRoute({
  summary: "GET endpoint for fetching locations",
  description: "Fetches all the location that the user has previously added",
  tags,
  method: "get",
  path: "/locations",
  middleware: [authMiddleware, defaultRateLimiter],
  responses: {
    [HttpStatus.OK.CODE]: jsonContent(
      z.array(SelectLocationSchema),
      "Schema of location array",
    ),
    [HttpStatus.UNAUTHORIZED.CODE]: jsonContent(
      unauthorizedSchema,
      "Unauthorized",
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

export const put = createRoute({
  summary: "PUT endpoint for updating an existing location",
  description: "Updates the selected location in the DB and then returns it",
  tags,
  method: "put",
  path: "/locations/{slug}",
  middleware: [authMiddleware, defaultRateLimiter],
  request: {
    params: ParamsSchema,
    body: jsonContentRequired(
      UpdateLocationSchema,
      "Location update schema",
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
      "Location already exists",
    ),
    [HttpStatus.UNPROCESSABLE_ENTITY.CODE]: jsonContent(
      createErrorSchema(UpdateLocationSchema).or(ParamsSchema),
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

export const getOne = createRoute({
  summary: "GET endpoint for fetching a location",
  description: "Fetches the location that the user has previously added",
  tags,
  method: "get",
  path: "/locations/{slug}",
  middleware: [authMiddleware, defaultRateLimiter],
  request: {
    params: ParamsSchema,
  },
  responses: {
    [HttpStatus.OK.CODE]: jsonContent(
      SelectLocationSchema,
      "Location schema",
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

export const remove = createRoute({
  summary: "DELETE endpoint for deleting an existing location",
  description: "Deletes the selected location from the DB",
  tags,
  method: "delete",
  path: "/locations/{slug}",
  middleware: [authMiddleware, defaultRateLimiter],
  request: {
    params: ParamsSchema,
  },
  responses: {
    [HttpStatus.NO_CONTENT.CODE]: {
      description: "Location deleted",
    },
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

export type GetRoute = typeof get;
export type PostRoute = typeof post;
export type PutRoute = typeof put;
export type GetOneRoute = typeof getOne;
export type RemoveRoute = typeof remove;
