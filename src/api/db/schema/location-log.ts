import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { location } from "./location.ts";
import { user } from "./auth.ts";
import { relations } from "drizzle-orm";
import {
  locationLogImage,
  SelectLocationLogImage,
} from "./location-log-image.ts";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import {
  DateSchema,
  DescriptionSchema,
  LatSchema,
  LongSchema,
  NameSchema,
} from "~/shared/zod-schemas.ts";
import z from "zod";

export const locationLog = sqliteTable("locationLog", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text(),
  startedAt: int().notNull(),
  endedAt: int().notNull(),
  lat: real().notNull(),
  long: real().notNull(),
  locationId: int().notNull().references(() => location.id, {
    onDelete: "cascade",
  }),
  userId: int().notNull().references(() => user.id, { onDelete: "cascade" }),
  createdAt: int().notNull().$default(() => Date.now()),
  updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() =>
    Date.now()
  ),
});

export const locationLogRelations = relations(locationLog, ({ one, many }) => ({
  location: one(location, {
    fields: [locationLog.locationId],
    references: [location.id],
  }),
  images: many(locationLogImage),
}));

export const SelectLocationLog = createSelectSchema(locationLog);

export const SelectLocationLogWithImages = SelectLocationLog.extend({
  images: z.array(SelectLocationLogImage),
});

export const InsertLocationLog = createInsertSchema(locationLog, {
  name: NameSchema,
  description: DescriptionSchema,
  lat: LatSchema,
  long: LongSchema,
  startedAt: DateSchema,
  endedAt: DateSchema,
}).omit({
  id: true,
  userId: true,
  locationId: true,
  createdAt: true,
  updatedAt: true,
}).superRefine((values, context) => {
  if (values.startedAt > values.endedAt || values.endedAt < values.startedAt) {
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

export const UpdateLocationLog = createUpdateSchema(locationLog, {
  name: NameSchema,
  description: DescriptionSchema,
  lat: LatSchema,
  long: LongSchema,
  startedAt: DateSchema,
  endedAt: DateSchema,
}).omit({
  id: true,
  userId: true,
  locationId: true,
  createdAt: true,
  updatedAt: true,
}).superRefine((values, context) => {
  if (values.startedAt > values.endedAt || values.endedAt < values.startedAt) {
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
