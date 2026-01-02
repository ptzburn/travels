import z from "zod";
import { auth } from "./auth.ts";
import {
  InsertLocationSchema,
  NominatimResultSchema,
  SelectLocationSchema,
  UpdateLocationSchema,
} from "./schema/location.ts";
import { SearchQuerySchema } from "./schema/search.ts";
import {
  InsertLocationLogSchema,
  SelectLocationLogSchema,
  UpdateLocationLogSchema,
} from "./schema/location-log.ts";

export type User = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session.session;

// LOCATION LOGS
export type SelectLocationLog =
  & Omit<z.infer<typeof SelectLocationLogSchema>, "createdAt" | "updatedAt">
  & {
    createdAt: string;
    updatedAt: string;
  };
export type InsertLocationLog = z.infer<typeof InsertLocationLogSchema>;
export type UpdateLocationLog = z.infer<typeof UpdateLocationLogSchema>;

// LOCATIONS
export type SelectLocation =
  & Omit<z.infer<typeof SelectLocationSchema>, "createdAt" | "updatedAt">
  & {
    createdAt: string;
    updatedAt: string;
  };
export type InsertLocation = z.infer<typeof InsertLocationSchema>;

export type UpdateLocation = z.infer<typeof UpdateLocationSchema>;

export type SearchQuery = z.infer<typeof SearchQuerySchema>;

export type NominatimResult = z.infer<typeof NominatimResultSchema>;
// MAP
export type LatLongItem = {
  lat: number;
  long: number;
};

export type MapItem = {
  label: string;
} & LatLongItem;
