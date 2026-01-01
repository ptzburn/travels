import { z } from "zod";
import { UNPROCESSABLE_ENTITY } from "../http-status.ts";
import { SelectLocationLogSchema } from "./location-log.ts";

export const SelectLocationSchema = z.object({
  _id: z.string().regex(
    /^[0-9a-f]{24}$/i,
    UNPROCESSABLE_ENTITY.INVALID_ID_MESSAGE,
  ),
  user: z.string().regex(
    /^[0-9a-f]{24}$/i,
    UNPROCESSABLE_ENTITY.INVALID_ID_MESSAGE,
  ),
  name: z.string().trim().min(2),
  slug: z.string(),
  description: z.string().trim().max(1000).optional(),
  lat: z.number().max(90).min(-90),
  long: z.number().max(180).min(-180),
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
