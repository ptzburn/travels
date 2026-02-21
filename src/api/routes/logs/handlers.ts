import type { AppRouteHandler } from "~/api/lib/types.ts";
import {
  FORBIDDEN,
  NO_CONTENT,
  NOT_FOUND,
  OK,
  UNPROCESSABLE_ENTITY,
} from "~/shared/http-status.ts";

import { HTTPException } from "hono/http-exception";

import type { GetRoute, PostRoute, PutRoute, RemoveRoute } from "./routes.ts";
import { findLocation, findLocationBySlug } from "~/api/db/queries/location.ts";
import {
  deleteLocationLog,
  findLocationLog,
  insertLocationLog,
  updateLocationLog,
} from "~/api/db/queries/location-log.ts";

export const get: AppRouteHandler<GetRoute> = async (c) => {
  const { slug, id } = c.req.valid("param");
  const user = c.get("user");

  const location = await findLocationBySlug(slug);

  if (!location) {
    throw new HTTPException(NOT_FOUND.CODE, {
      message: NOT_FOUND.LOCATION_MESSAGE,
    });
  }

  if (location.userId !== user.id) {
    throw new HTTPException(FORBIDDEN.CODE, {
      message: FORBIDDEN.MESSAGE,
    });
  }

  const locationLog = await findLocationLog(Number(id), user.id);

  return c.json(locationLog, OK.CODE);
};

export const post: AppRouteHandler<PostRoute> = async (c) => {
  const locationLogData = c.req.valid("json");
  const { slug } = c.req.valid("param");
  const user = c.get("user");

  const location = await findLocation(slug, user.id);

  if (!location) {
    throw new HTTPException(NOT_FOUND.CODE, {
      message: NOT_FOUND.MESSAGE,
    });
  }

  const newLocationLog = await insertLocationLog(
    location.id,
    locationLogData,
    user.id,
  );

  return c.json(newLocationLog, OK.CODE);
};

export const put: AppRouteHandler<PutRoute> = async (c) => {
  const updates = c.req.valid("json");
  const { id } = c.req.valid("param");
  const user = c.get("user");

  if (Object.keys(updates).length === 0) {
    throw new HTTPException(UNPROCESSABLE_ENTITY.CODE, {
      message: UNPROCESSABLE_ENTITY.EMPTY_OBJECT_MESSAGE,
    });
  }

  const locationLog = await findLocationLog(Number(id), user.id);

  if (!locationLog) {
    throw new HTTPException(NOT_FOUND.CODE, {
      message: NOT_FOUND.MESSAGE,
    });
  }

  const updatedLocationLog = await updateLocationLog(
    Number(id),
    updates,
    user.id,
  );

  return c.json(updatedLocationLog, OK.CODE);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const user = c.get("user");

  const locationLog = await findLocationLog(Number(id), user.id);

  if (!locationLog) {
    throw new HTTPException(NOT_FOUND.CODE, {
      message: NOT_FOUND.MESSAGE,
    });
  }

  await deleteLocationLog(Number(id), user.id);

  return c.body(null, NO_CONTENT.CODE);
};
