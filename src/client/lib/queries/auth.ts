import { query } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import { auth } from "~/shared/auth.ts";

export const userSessionQuery = query(async () => {
  "use server";
  const event = getRequestEvent();
  if (!event) {
    throw new Error("No request event available");
  }

  const headers = event.request.headers;
  const session = await auth.api.getSession({
    headers,
  });

  return session;
}, "session");
