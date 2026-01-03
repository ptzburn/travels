import type { AppRouteHandler } from "~/api/lib/types.ts";
import {
  FORBIDDEN,
  NO_CONTENT,
  NOT_FOUND,
  OK,
  UNPROCESSABLE_ENTITY,
} from "~/shared/http-status.ts";
import { HTTPException } from "hono/http-exception";

import type {
  GetOneRoute,
  GetRoute,
  PostRoute,
  PutRoute,
  RemoveRoute,
} from "./routes.ts";
import { SelectLocationSchema } from "~/shared/schema/location.ts";
import { SelectLocationLogSchema } from "~/shared/schema/location-log.ts";
import mongoose from "mongoose";
import slugify from "slug";
import z from "zod";
import {
  deleteLocationById,
  findAllUserLocations,
  findLocationBySlug,
  findUniqueSlug,
  insertLocation,
  updateLocationById,
} from "~/api/services/locations.ts";

export const get: AppRouteHandler<GetRoute> = async (c) => {
  const user = c.get("user");

  const locations = await findAllUserLocations(user.id);

  const parsedLocations = z.array(SelectLocationSchema.extend({
    _id: z.instanceof(mongoose.Types.ObjectId),
    user: z.instanceof(mongoose.Types.ObjectId),
  })).parse(
    locations,
  );

  return c.json(parsedLocations, OK.CODE);
};

export const post: AppRouteHandler<PostRoute> = async (c) => {
  const locationData = c.req.valid("json");
  const user = c.get("user");

  const slug = await findUniqueSlug(slugify(locationData.name));

  const newLocation = await insertLocation(locationData, user.id, slug);

  const parsedLocation = SelectLocationSchema.extend({
    _id: z.instanceof(mongoose.Types.ObjectId),
    user: z.instanceof(mongoose.Types.ObjectId),
  }).parse(
    newLocation,
  );

  return c.json(parsedLocation, OK.CODE);
};

export const put: AppRouteHandler<PutRoute> = async (c) => {
  const updates = c.req.valid("json");
  const { slug } = c.req.valid("param");
  const user = c.get("user");

  if (Object.keys(updates).length === 0) {
    throw new HTTPException(UNPROCESSABLE_ENTITY.CODE, {
      message: UNPROCESSABLE_ENTITY.EMPTY_OBJECT_MESSAGE,
    });
  }

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

  const updatedLocation = await updateLocationById(location._id, updates);

  const parsedLocation = SelectLocationSchema.extend({
    _id: z.instanceof(mongoose.Types.ObjectId),
    user: z.instanceof(mongoose.Types.ObjectId),
    logs: z.array(SelectLocationLogSchema.extend({
      _id: z.instanceof(mongoose.Types.ObjectId),
      user: z.instanceof(mongoose.Types.ObjectId),
      location: z.instanceof(mongoose.Types.ObjectId),
    })).optional(),
  }).parse(
    updatedLocation,
  );

  return c.json(parsedLocation, OK.CODE);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const user = c.get("user");
  const { slug } = c.req.valid("param");

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

  const parsedLocation = SelectLocationSchema.extend({
    _id: z.instanceof(mongoose.Types.ObjectId),
    user: z.instanceof(mongoose.Types.ObjectId),
    logs: z.array(SelectLocationLogSchema.extend({
      _id: z.instanceof(mongoose.Types.ObjectId),
      user: z.instanceof(mongoose.Types.ObjectId),
      location: z.instanceof(mongoose.Types.ObjectId),
    })).optional(),
  }).parse(
    location,
  );

  return c.json(parsedLocation, OK.CODE);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
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

  await deleteLocationById(location._id);

  return c.body(null, NO_CONTENT.CODE);
};
