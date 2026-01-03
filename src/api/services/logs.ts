import { InsertLocationLog } from "~/shared/types.ts";
import { LocationLog } from "../db/models/location-log.model.ts";

export async function insertLocationLog(
  locationLogData: InsertLocationLog,
  userId: string,
  locationId: string,
) {
  return await LocationLog.create({
    ...locationLogData,
    user: userId,
    location: locationId,
  });
}
