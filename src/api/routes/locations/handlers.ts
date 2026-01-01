import type { AppRouteHandler } from "~/api/lib/types.ts";
import { FORBIDDEN, OK } from "~/shared/http-status.ts";
import { HTTPException } from "hono/http-exception";

import type { GetOneRoute, GetRoute, PostRoute } from "./routes.ts";
import { SelectLocationSchema } from "~/shared/schema/location.ts";
import mongoose from "mongoose";
import slugify from "slug";
import z from "zod";
import {
  findAllUserLocations,
  findLocationBySlug,
  findUniqueSlug,
  insertLocation,
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

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const user = c.get("user");
  const { slug } = c.req.valid("param");

  const location = await findLocationBySlug(slug);

  if (location.user.toString() !== user.id) {
    throw new HTTPException(FORBIDDEN.CODE, {
      message: FORBIDDEN.MESSAGE,
    });
  }

  const parsedLocation = SelectLocationSchema.extend({
    _id: z.instanceof(mongoose.Types.ObjectId),
    user: z.instanceof(mongoose.Types.ObjectId),
  }).parse(
    location,
  );

  return c.json(parsedLocation, OK.CODE);
};
