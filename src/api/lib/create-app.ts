import { OpenAPIHono } from "@hono/zod-openapi";
import { contextStorage } from "hono/context-storage";
import { poweredBy } from "hono/powered-by";
import { requestId } from "hono/request-id";
import { csrf } from "hono/csrf";
import { cors } from "hono/cors";

import type { AppBindings } from "~/api/lib/types.ts";

import { notFound, onError, pinoLogger } from "~/api/middlewares/index.ts";
import defaultHook from "~/api/utils/default-hook.ts";
import { auth } from "~/shared/auth.ts";

export function createRouter(): OpenAPIHono<AppBindings> {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook,
  });
}

export default function createApp(): OpenAPIHono<AppBindings> {
  const app = createRouter();
  app
    .use("/api/*", cors())
    .use(csrf())
    .use(contextStorage())
    .use(requestId())
    .use(poweredBy())
    .use(pinoLogger());

  app.notFound(notFound);
  app.onError(onError);
  // deno-lint-ignore require-await
  app.on(["POST", "GET"], "/api/auth/**", async (c) => {
    // Check if this is the error route
    if (c.req.path === "/api/auth/error") {
      const error = c.req.query("error");
      const redirectUrl = error ? `/auth/error?error=${error}` : "/auth/error";
      return c.redirect(redirectUrl);
    }
    // Otherwise, let better-auth handle it
    return auth.handler(c.req.raw);
  });
  return app;
}
