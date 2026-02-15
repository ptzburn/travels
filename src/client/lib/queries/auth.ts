import { query } from "@solidjs/router";
import { getServerHeaders } from "../utils.ts";
import { auth } from "~/shared/auth.ts";
import type { Session, User } from "~/shared/types.ts";

export const userSessionQuery = query(async () => {
  "use server";
  const headers = getServerHeaders();
  const session = await auth.api.getSession({
    headers,
  });

  return session as { session: Session; user: User } | null;
}, "session");
