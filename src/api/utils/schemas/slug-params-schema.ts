import { z } from "@hono/zod-openapi";

function SlugParamsSchema(name: string, description: string) {
  return z.object({
    [name]: z.string().openapi({
      param: {
        name,
        in: "path",
      },
      description,
      example: "new-york-a5wr1",
    }),
  });
}

export default SlugParamsSchema;
