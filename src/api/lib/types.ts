import type { RouteConfig, RouteHandler, z } from "@hono/zod-openapi";
import type { PinoLogger } from "hono-pino";
import { Session, User } from "~/shared/types.ts";

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
