import type { AppRouteHandler } from "~/api/lib/types.ts";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  NO_CONTENT,
  NOT_FOUND,
  OK,
  UNPROCESSABLE_ENTITY,
} from "~/shared/http-status.ts";

import { HTTPException } from "hono/http-exception";

import type {
  GetRoute,
  PostRoute,
  PutRoute,
  RemoveRoute,
  UploadImageRoute,
} from "./routes.ts";
import { findLocation, findLocationBySlug } from "~/api/db/queries/location.ts";
import {
  deleteLocationLog,
  findLocationLog,
  insertLocationLog,
  updateLocationLog,
} from "~/api/db/queries/location-log.ts";

import env from "~/env.ts";
import app from "~/api/app.ts";
import { insertLocationLogImage } from "~/api/db/queries/location-log-image.ts";

export const get: AppRouteHandler<GetRoute> = async (c) => {
  const { slug, id } = c.req.valid("param");
  const user = c.get("user");

  const location = await findLocationBySlug(slug);

  if (!location) {
    throw new HTTPException(NOT_FOUND.CODE, {
      message: NOT_FOUND.LOCATION_MESSAGE,
    });
  }

  if (Number(location.userId) !== Number(user.id)) {
    throw new HTTPException(FORBIDDEN.CODE, {
      message: FORBIDDEN.MESSAGE,
    });
  }

  const locationLog = await findLocationLog(Number(id), user.id);

  if (!locationLog) {
    throw new HTTPException(NOT_FOUND.CODE, {
      message: NOT_FOUND.MESSAGE,
    });
  }

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

export const uploadImage: AppRouteHandler<UploadImageRoute> = async (
  c,
) => {
  const user = c.get("user");
  const { slug, id } = c.req.valid("param");
  const { file } = c.req.valid("form");

  await app.request(`/api/locations/${slug}/${id}/`, {
    headers: c.req.raw.headers,
  });

  const client = new S3Client({
    region: env.S3_REGION,
    endpoint: env.S3_ENDPOINT,
    forcePathStyle: true,
    credentials: {
      accessKeyId: env.S3_ACCESS_KEY,
      secretAccessKey: env.S3_ACCESS_SECRET,
    },
  });

  const fileName = crypto.randomUUID();
  const key = `${user.id}/${id}/${fileName}.webp`;

  const buffer = await file.arrayBuffer();

  const command = new PutObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: key,
    Body: new Uint8Array(buffer),
    ContentType: file.type,
  });

  const result = await client.send(command);

  if (result.$metadata.httpStatusCode !== 200) {
    throw new HTTPException(INTERNAL_SERVER_ERROR.CODE, {
      message: INTERNAL_SERVER_ERROR.MESSAGE,
    });
  }

  await insertLocationLogImage(Number(id), key, user.id);

  const url = `${env.S3_ENDPOINT}/${env.S3_BUCKET}/${key}`;

  return c.json({
    fileUrl: url,
  }, OK.CODE);
};
