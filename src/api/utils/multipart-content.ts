import type { ZodSchema } from "~/api/lib/types.ts";

function multipartContent<
  T extends ZodSchema,
>(schema: T, description: string) {
  return {
    content: {
      "multipart/form-data": {
        schema,
      },
    },
    description,
  };
}

export default multipartContent;
