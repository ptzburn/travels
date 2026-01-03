import { InsertLocationLog } from "~/shared/types.ts";
import { LocationLog } from "../db/models/location-log.model.ts";
import { HTTPException } from "hono/http-exception";
import { NOT_FOUND } from "~/shared/http-status.ts";

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

export async function findLocationLogById(id: string) {
  const locationLog = await LocationLog.findById(id);

  if (!locationLog) {
    throw new HTTPException(NOT_FOUND.CODE, {
      message: NOT_FOUND.LOCATION_LOG_MESSAGE,
    });
  }

  return locationLog;
}
