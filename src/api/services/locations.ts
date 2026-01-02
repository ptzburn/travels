import { Location } from "~/api/db/models/location.model.ts";
import { customAlphabet } from "nanoid";
import { InsertLocation, UpdateLocation } from "~/shared/types.ts";
import { LocationLogDocument } from "../db/models/location-log.model.ts";
import { Types } from "mongoose";
import { HTTPException } from "hono/http-exception";
import { INTERNAL_SERVER_ERROR, NOT_FOUND } from "~/shared/http-status.ts";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 5);

export async function findAllUserLocations(user: string) {
  return await Location.find({
    user,
  });
}

export async function findLocationBySlug(slug: string) {
  const location = await Location.findOne({
    slug,
  }).populate<{ logs: LocationLogDocument[] }>("logs");

  return location;
}

export async function deleteLocationById(id: Types.ObjectId) {
  const location = await Location.findByIdAndDelete(id);

  if (!location) {
    throw new HTTPException(INTERNAL_SERVER_ERROR.CODE, {
      message: INTERNAL_SERVER_ERROR.MESSAGE,
    });
  }
  return;
}

export async function updateLocationById(
  id: Types.ObjectId,
  updates: UpdateLocation,
) {
  const updatedLocation = await Location.findByIdAndUpdate(id, updates)
    .populate<
      { logs: LocationLogDocument[] }
    >("logs");

  if (!updatedLocation) {
    throw new HTTPException(NOT_FOUND.CODE, {
      message: NOT_FOUND.MESSAGE,
    });
  }

  return updatedLocation;
}

export async function findUniqueSlug(slug: string) {
  let existing = !!(await findLocationBySlug(slug));

  while (existing) {
    const id = nanoid();
    const idSlug = `${slug}-${id}`;
    existing = !!(await findLocationBySlug(idSlug));

    if (!existing) {
      return idSlug;
    }
  }

  return slug;
}

export async function insertLocation(
  locationData: InsertLocation,
  userId: string,
  slug: string,
) {
  return await Location.create({
    ...locationData,
    user: userId,
    slug,
  });
}
