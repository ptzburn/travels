import type { AppRouteHandler } from "~/api/lib/types.ts";
import {
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
import slugify from "slug";
import {
  findLocation,
  findLocations,
  findUniqueSlug,
  insertLocation,
  removeLocationBySlug,
  updateLocationBySlug,
} from "~/api/db/queries/location.ts";

export const get: AppRouteHandler<GetRoute> = async (c) => {
  const user = c.get("user");

  const locations = await findLocations(user.id);

  return c.json(locations, OK.CODE);
};

export const post: AppRouteHandler<PostRoute> = async (c) => {
  const locationData = c.req.valid("json");
  const user = c.get("user");

  const slug = await findUniqueSlug(slugify(locationData.name));

  const newLocation = await insertLocation(locationData, slug, user.id);

  return c.json(newLocation, OK.CODE);
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

  const location = await findLocation(slug, user.id);

  if (!location) {
    throw new HTTPException(NOT_FOUND.CODE, {
      message: NOT_FOUND.MESSAGE,
    });
  }

  const updatedLocation = await updateLocationBySlug(updates, slug, user.id);

  return c.json(updatedLocation, OK.CODE);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const user = c.get("user");
  const { slug } = c.req.valid("param");

  const location = await findLocation(slug, user.id);

  if (!location) {
    throw new HTTPException(NOT_FOUND.CODE, {
      message: NOT_FOUND.MESSAGE,
    });
  }

  return c.json(location, OK.CODE);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { slug } = c.req.valid("param");
  const user = c.get("user");

  const location = await findLocation(slug, user.id);

  if (!location) {
    throw new HTTPException(NOT_FOUND.CODE, {
      message: NOT_FOUND.MESSAGE,
    });
  }

  await removeLocationBySlug(slug, user.id);

  return c.body(null, NO_CONTENT.CODE);
};
