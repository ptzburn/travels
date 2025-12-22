import { z } from "zod";
import { UNPROCESSABLE_ENTITY } from "../http-status.ts";

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
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const InsertLocationSchema = SelectLocationSchema.omit({
  _id: true,
  user: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
});
