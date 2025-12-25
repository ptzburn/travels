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
export type InsertLocation = z.infer<typeof InsertLocationSchema>;
