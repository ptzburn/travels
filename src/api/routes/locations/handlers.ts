import type { AppRouteHandler } from "~/api/lib/types.ts";
import { OK } from "~/shared/http-status.ts";

import type { GetRoute, PostRoute } from "./routes.ts";
import { SelectLocationSchema } from "~/shared/schema/location.ts";
import mongoose from "mongoose";
import slugify from "slug";
import z from "zod";
import {
  findAllUserLocations,
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
