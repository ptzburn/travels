import { createRouter } from "~/api/lib/create-app.ts";

import * as handlers from "./handlers.ts";
import * as routes from "./routes.ts";

const locations = createRouter()
  .openapi(
    routes.get,
    handlers.get,
  )
  .openapi(
    routes.post,
    handlers.post,
  );

export default locations;
