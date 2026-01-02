import { z } from "zod";
import { SelectLocationLogSchema } from "./location-log.ts";
import {
  DescriptionSchema,
  IdSchema,
  LatSchema,
  LongSchema,
  NameSchema,
} from "./utils.ts";

export const SelectLocationSchema = z.object({
  _id: IdSchema,
  user: IdSchema,
  name: NameSchema,
  slug: z.string(),
  description: DescriptionSchema,
  lat: LatSchema,
  long: LongSchema,
  logs: z.array(SelectLocationLogSchema).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const InsertLocationSchema = SelectLocationSchema.omit({
  _id: true,
  user: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateLocationSchema = InsertLocationSchema.partial();

export const NominatimResultSchema = z.object({
  place_id: z.number(),
  licence: z.string(),
  osm_type: z.string(),
  osm_id: z.number(),
  lat: z.string(),
  lon: z.string(),
  class: z.string(),
  type: z.string(),
  place_rank: z.number(),
  importance: z.number(),
  addresstype: z.string(),
  name: z.string(),
  display_name: z.string(),
  boundingbox: z.array(z.string()),
});
