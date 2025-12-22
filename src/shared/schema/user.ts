import { z } from "zod";
import { UNPROCESSABLE_ENTITY } from "../http-status.ts";

export const SelectUserSchema = z.object({
  _id: z.string().regex(
    /^[0-9a-f]{24}$/i,
    UNPROCESSABLE_ENTITY.INVALID_ID_MESSAGE,
  ),
  name: z.string(),
  email: z.email(),
  emailVerified: z.boolean(),
  image: z.url().nullable().optional(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});
