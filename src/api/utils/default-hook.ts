import type { Hook } from "@hono/zod-openapi";

import { UNPROCESSABLE_ENTITY } from "~/shared/http-status.ts";

// deno-lint-ignore no-explicit-any
const defaultHook: Hook<any, any, any, any> = (result, c) => {
  if (!result.success) {
    return c.json(
      {
        success: result.success,
        errors: result.error.issues.map((issue) => ({
          [issue.path.join(".")]: issue.message,
        })),
      },
      UNPROCESSABLE_ENTITY.CODE,
    );
  }
};

export default defaultHook;
