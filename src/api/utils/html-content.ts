import { z } from "@hono/zod-openapi";

function htmlContent(description: string) {
  return {
    content: {
      "text/html": {
        schema: z.string(),
      },
    },
    description,
  };
}

export default htmlContent;
