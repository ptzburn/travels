import { z } from "zod";
import {
  DescriptionSchema,
  IdSchema,
  LatSchema,
  LongSchema,
  NameSchema,
} from "./utils.ts";

export const SelectLocationLogSchema = z.object({
  _id: IdSchema,
  location: IdSchema,
  name: NameSchema,
  slug: z.string(),
  description: DescriptionSchema,
  startedAt: z.number(),
  endedAt: z.number(),
  lat: LatSchema,
  long: LongSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const InsertLocationLogSchema = SelectLocationLogSchema
  .omit({
    _id: true,
    location: true,
    slug: true,
    createdAt: true,
    updatedAt: true,
  })
  .superRefine((data, context) => {
    if (data.startedAt > data.endedAt) {
      context.addIssue({
        code: "custom",
        message: "Start Date must be before End Date",
        path: ["startedAt"],
      });
      context.addIssue({
        code: "custom",
        message: "End Date must be after Start Date",
        path: ["endedAt"],
      });
    }
  });

export const UpdateLocationLogSchema = InsertLocationLogSchema.partial();
