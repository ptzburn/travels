import { z } from "@hono/zod-openapi";

const conflictSchema = z.object({
  success: z.literal(false).openapi({ example: false }),
  message: z.string().openapi({
    example: "A talent with this email already exists",
  }),
});

export default conflictSchema;
