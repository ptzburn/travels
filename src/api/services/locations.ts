import { Location } from "~/api/db/models/location.model.ts";
import { customAlphabet } from "nanoid";
import { InsertLocation } from "~/shared/types.ts";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 5);

export async function findAllUserLocations(user: string) {
  return await Location.find({
    user,
  });
}

export async function findLocationBySlug(slug: string) {
  return await Location.findOne({
    slug,
  });
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
