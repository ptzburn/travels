import { z } from "zod";
import { UNPROCESSABLE_ENTITY } from "../http-status.ts";

export const IdSchema = z.string().regex(
  /^[0-9a-f]{24}$/i,
  UNPROCESSABLE_ENTITY.INVALID_ID_MESSAGE,
);
export const LatSchema = z.number().max(90).min(-90);
export const LongSchema = z.number().max(180).min(-180);
export const NameSchema = z.string().trim().min(2);
export const DescriptionSchema = z.string().trim().max(1000).optional();
