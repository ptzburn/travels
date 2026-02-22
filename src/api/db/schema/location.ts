import { int, real, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { user } from "./auth.ts";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import {
  DescriptionSchema,
  LatSchema,
  LongSchema,
  NameSchema,
} from "~/shared/zod-schemas.ts";
import { locationLog, SelectLocationLogWithImages } from "./location-log.ts";
import { z } from "zod";

export const location = sqliteTable("location", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text(),
  lat: real().notNull(),
  long: real().notNull(),
  userId: int().notNull().references(() => user.id, { onDelete: "cascade" }),
  createdAt: int().notNull().$default(() => Date.now()),
  updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() =>
    Date.now()
  ),
}, (table) => [
  unique().on(table.name, table.userId),
]);

export const locationRelations = relations(location, ({ many }) => ({
  locationLogs: many(locationLog),
}));

export const SelectLocation = createSelectSchema(location);
export const SelectLocationWithLogsSchema = SelectLocation.extend({
  locationLogs: z.array(SelectLocationLogWithImages),
});
export const InsertLocation = createInsertSchema(location, {
  name: NameSchema,
  description: DescriptionSchema,
  lat: LatSchema,
  long: LongSchema,
}).omit({
  id: true,
  slug: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});
export const UpdateLocation = InsertLocation.partial();
