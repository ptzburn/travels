import z from "zod";

import { NominatimResultSchema, SearchSchema } from "./zod-schemas.ts";
import {
  InsertLocation as InsertLocationSchema,
  SelectLocation as SelectLocationSchema,
  UpdateLocation as UpdateLocationSchema,
} from "../api/db/schema/location.ts";
import {
  InsertLocationLog as InsertLocationLogSchema,
  SelectLocationLog as SelectLocationLogSchema,
  UpdateLocationLog as UpdateLocationLogSchema,
} from "../api/db/schema/location-log.ts";
import { session, user } from "../api/db/schema/auth.ts";

export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;

// LOCATIONS

export type SelectLocation = z.infer<typeof SelectLocationSchema> & {
  locationLogs?: SelectLocationLog[];
};
export type InsertLocation = z.infer<typeof InsertLocationSchema>;
export type UpdateLocation = z.infer<typeof UpdateLocationSchema>;

// LOCATION LOGS
export type SelectLocationLog = z.infer<typeof SelectLocationLogSchema>;
export type InsertLocationLog = z.infer<typeof InsertLocationLogSchema>;
export type UpdateLocationLog = z.infer<typeof UpdateLocationLogSchema>;

export type SearchQuery = z.infer<typeof SearchSchema>;

export type NominatimResult = z.infer<typeof NominatimResultSchema>;
// MAP
export type LatLongItem = {
  lat: number;
  long: number;
};

export type MapItem = {
  label: string;
} & LatLongItem;
