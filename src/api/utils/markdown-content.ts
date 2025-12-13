import { z } from "@hono/zod-openapi";

function markdownContent(description: string) {
  return {
    content: {
      "text/markdown": {
        schema: z.string(),
      },
    },
    description,
  };
}

export default markdownContent;
