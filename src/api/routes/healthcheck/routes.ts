import { createRoute, z } from "@hono/zod-openapi";

import jsonContent from "~/api/utils/json-content.ts";
import { serverErrorSchema } from "~/api/utils/schemas/index.ts";
import * as HttpStatus from "~/shared/http-status.ts";

const tags = ["Health"];

const HealthResponseSchema = z.object({
    status: z.string(),
    timestamp: z.string(),
});

export const healthCheck = createRoute({
    summary: "Health check endpoint",
    description: "Returns the health status of the API",
    tags,
    method: "get",
    path: "/health",
    responses: {
        [HttpStatus.OK.CODE]: jsonContent(
            HealthResponseSchema,
            "API health status",
        ),
        [HttpStatus.INTERNAL_SERVER_ERROR.CODE]: jsonContent(
            serverErrorSchema,
            "Internal server error",
        ),
    },
});

export type HealthCheckRoute = typeof healthCheck;
