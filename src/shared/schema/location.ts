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
    name: z.string(),
    slug: z.string(),
    description: z.string(),
    lat: z.number(),
    lang: z.number(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
});
