import type { RouteConfig, RouteHandler, z } from "@hono/zod-openapi";
import type { PinoLogger } from "hono-pino";
import { auth } from "./auth.ts";

// APP BINDINGS
export type User = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session.session;

export type AppBindings = {
  Variables: {
    logger: PinoLogger;
    user: User;
    session: Session;
  };
};

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
  R,
  AppBindings
>;

export type ZodSchema =
  | z.ZodUnion
  | z.ZodObject
  | z.ZodArray<z.ZodObject>
  | z.ZodArray<z.ZodDate>;
