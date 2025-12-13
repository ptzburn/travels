import { z } from "@hono/zod-openapi";

export const tooManyRequestsSchema = z.object({
  success: z.literal(false).openapi({
    example: false,
  }),
  message: z.string().openapi({
    example: "Too many requests, please try again later.",
  }),
  retryAfter: z.string().openapi({
    example: "900",
    description: "Number of seconds until the rate limit resets",
  }),
});

export default tooManyRequestsSchema;
