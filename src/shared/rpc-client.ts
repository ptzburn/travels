import { hc } from "hono/client";

import type { AppType } from "~/api/app.ts";

export type Client = ReturnType<typeof hc<AppType>>;

export function hcWithType(...args: Parameters<typeof hc>): Client {
  return hc<AppType>(...args);
}

export const rpcClient = hcWithType(`${import.meta.env.VITE_APP_URL}/api`, {
  init: {
    credentials: "include",
  },
});
