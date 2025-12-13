import type { ZodSchema } from "~/shared/types.ts";

import jsonContent from "./json-content.ts";

function jsonContentRequired<
  T extends ZodSchema,
>(schema: T, description: string) {
  return {
    ...jsonContent(schema, description),
    required: true,
  };
}

export default jsonContentRequired;
