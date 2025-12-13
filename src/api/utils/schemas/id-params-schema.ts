import { z } from "@hono/zod-openapi";

import { UNPROCESSABLE_ENTITY } from "~/shared/http-status.ts";

function IdParamsSchema(name: string, description: string) {
  return z.object({
    [name]: z.string().regex(
      /^[0-9a-f]{24}$/i,
      UNPROCESSABLE_ENTITY.INVALID_ID_MESSAGE,
    ).openapi({
      param: {
        name,
        in: "path",
      },
      description,
      example: "507f1f77bcf86cd799439011",
    }),
  });
}

export default IdParamsSchema;
