import { createRoute } from "@hono/zod-openapi";
import {
  conflictSchema,
  createErrorSchema,
  forbiddenSchema,
  ImageFileSchema,
  notFoundSchema,
  serverErrorSchema,
  SlugParamsSchema,
  tooManyRequestsSchema,
  unauthorizedSchema,
} from "~/api/utils/schemas/index.ts";
import { authMiddleware, defaultRateLimiter } from "~/api/middlewares/index.ts";
import jsonContentRequired from "~/api/utils/json-content-required.ts";
import * as HttpStatus from "~/shared/http-status.ts";
import jsonContent from "~/api/utils/json-content.ts";
import SlugIdParamsSchema from "~/api/utils/schemas/slug-id-params-schema.ts";
import {
  InsertLocationLog,
  SelectLocationLog,
  UpdateLocationLog,
} from "~/api/db/schema/location-log.ts";
import multipartContent from "../../utils/multipart-content.ts";
import { z } from "zod";

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
      SelectLocationLog,
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
      InsertLocationLog,
      "Location log insert fields schema",
    ),
  },
  responses: {
    [HttpStatus.OK.CODE]: jsonContent(
      SelectLocationLog,
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
      createErrorSchema(InsertLocationLog).or(ParamsSchema),
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

export const put = createRoute({
  summary: "PUT endpoint for updating an existing location log",
  description:
    "Updates the selected location log in the DB and then returns it",
  tags,
  method: "put",
  path: "/locations/{slug}/{id}",
  middleware: [authMiddleware, defaultRateLimiter],
  request: {
    params: SlugIdParamsSchema,
    body: jsonContentRequired(
      UpdateLocationLog,
      "Location log update schema",
    ),
  },
  responses: {
    [HttpStatus.OK.CODE]: jsonContent(
      SelectLocationLog,
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
      createErrorSchema(UpdateLocationLog).or(SlugIdParamsSchema),
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
  summary: "DELETE endpoint for deleting an existing location log",
  description: "Deletes the selected location log from the DB",
  tags,
  method: "delete",
  path: "/locations/{slug}/{id}",
  middleware: [authMiddleware, defaultRateLimiter],
  request: {
    params: SlugIdParamsSchema,
  },
  responses: {
    [HttpStatus.NO_CONTENT.CODE]: {
      description: "Location log deleted",
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
      createErrorSchema(SlugIdParamsSchema),
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

export const uploadImage = createRoute({
  summary: "uploads an image to a location log",
  description: "Upload an image to a location log",
  tags,
  method: "post",
  path: "/locations/{slug}/{id}/images",
  middleware: [authMiddleware, defaultRateLimiter],
  request: {
    params: SlugIdParamsSchema,
    body: multipartContent(
      ImageFileSchema,
      "Image file to upload",
    ),
  },
  responses: {
    [HttpStatus.OK.CODE]: jsonContent(
      z.object({
        fileUrl: z.string(),
      }),
      "URL of the uploaded image",
    ),
    [HttpStatus.UNAUTHORIZED.CODE]: jsonContent(
      unauthorizedSchema,
      "Unauthorized",
    ),
    [HttpStatus.UNPROCESSABLE_ENTITY.CODE]: jsonContent(
      createErrorSchema(ImageFileSchema).or(SlugIdParamsSchema),
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
export type RemoveRoute = typeof remove;
export type UploadImageRoute = typeof uploadImage;
