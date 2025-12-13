import { createRouter } from "~/api/lib/create-app.ts";

import * as handlers from "./handlers.ts";
import * as routes from "./routes.ts";

const healthcheck = createRouter().openapi(
    routes.healthCheck,
    handlers.healthCheck,
); // health check endpoint

export default healthcheck;
