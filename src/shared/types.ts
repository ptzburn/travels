import z from "zod";
import { auth } from "./auth.ts";
import {
  InsertLocationSchema,
  SelectLocationSchema,
} from "./schema/location.ts";

export type User = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session.session;

// LOCATIONS
export type SelectLocation = z.infer<typeof SelectLocationSchema>;
export type SelectLocations = {
  _id: string;
  user: string;
  name: string;
  slug: string;
  lat: number;
  long: number;
  createdAt: string;
  updatedAt: string;
  description?: string | undefined;
}[];
export type InsertLocation = z.infer<typeof InsertLocationSchema>;

// MAP
export type LatLongItem = {
  lat: number;
  long: number;
};

export type MapItem = {
  label: string;
} & LatLongItem;
