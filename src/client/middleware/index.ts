import { createMiddleware } from "@solidjs/start/middleware";
import { redirect } from "@solidjs/router";
import { auth } from "../../shared/auth.ts";

export default createMiddleware({
  onRequest: async (event) => {
    const { pathname } = new URL(event.request.url);
    if (pathname.startsWith("/dashboard")) {
      const session = await auth.api.getSession({
        headers: event.request.headers,
      });

      if (!session) {
        return redirect("/", 302);
      }
    }
  },
});
