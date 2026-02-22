import db from "../index.ts";
import { locationLogImage } from "../schema/index.ts";

export async function insertLocationLogImage(
  locationLogId: number,
  key: string,
  userId: number,
) {
  const [inserted] = await db.insert(locationLogImage).values({
    locationLogId,
    key,
    userId,
  }).returning();

  return inserted;
}
