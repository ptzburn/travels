import type { AppRouteHandler } from "~/api/lib/types.ts";
import { FORBIDDEN, NOT_FOUND, OK } from "~/shared/http-status.ts";

import { HTTPException } from "hono/http-exception";

import type { GetRoute, PostRoute } from "./routes.ts";
import mongoose from "mongoose";
import z from "zod";
import { findLocationBySlug } from "~/api/services/locations.ts";
import { SelectLocationLogSchema } from "~/shared/schema/location-log.ts";
import { findLocationLogById, insertLocationLog } from "~/api/services/logs.ts";

export const get: AppRouteHandler<GetRoute> = async (c) => {
  const { slug, id } = c.req.valid("param");
  const user = c.get("user");

  const location = await findLocationBySlug(slug);

  if (!location) {
    throw new HTTPException(NOT_FOUND.CODE, {
      message: NOT_FOUND.LOCATION_MESSAGE,
    });
  }

  if (location.user.toString() !== user.id) {
    throw new HTTPException(FORBIDDEN.CODE, {
      message: FORBIDDEN.MESSAGE,
    });
  }

  const locationLog = await findLocationLogById(id);

  const parsedLocationLog = SelectLocationLogSchema.extend({
    _id: z.instanceof(mongoose.Types.ObjectId),
    location: z.instanceof(mongoose.Types.ObjectId),
    user: z.instanceof(mongoose.Types.ObjectId),
  }).parse(
    locationLog,
  );

  return c.json(parsedLocationLog, OK.CODE);
};

export const post: AppRouteHandler<PostRoute> = async (c) => {
  const locationLogData = c.req.valid("json");
  const { slug } = c.req.valid("param");
  const user = c.get("user");

  const location = await findLocationBySlug(slug);

  if (!location) {
    throw new HTTPException(NOT_FOUND.CODE, {
      message: NOT_FOUND.MESSAGE,
    });
  }

  if (location.user.toString() !== user.id) {
    throw new HTTPException(FORBIDDEN.CODE, {
      message: FORBIDDEN.MESSAGE,
    });
  }

  const newLocationLog = await insertLocationLog(
    locationLogData,
    user.id,
    location._id.toString(),
  );

  const parsedLocationLog = SelectLocationLogSchema.extend({
    _id: z.instanceof(mongoose.Types.ObjectId),
    location: z.instanceof(mongoose.Types.ObjectId),
    user: z.instanceof(mongoose.Types.ObjectId),
  }).parse(
    newLocationLog,
  );

  return c.json(parsedLocationLog, OK.CODE);
};
