import { z } from "@hono/zod-openapi";

const notFoundSchema = z.object({
  success: z.boolean().openapi({
    example: false,
  }),
  message: z.string().openapi({
    example: "Not Found",
  }),
});

export default notFoundSchema;
