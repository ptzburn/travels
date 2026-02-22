import { hc } from "hono/client";
import { isServer } from "solid-js/web";
import type { AppType } from "~/api/app.ts";
import { getServerHeaders } from "../client/lib/utils.ts";

export type Client = ReturnType<typeof hc<AppType>>;

export function hcWithType(...args: Parameters<typeof hc>): Client {
  return hc<AppType>(...args);
}

export const rpcClient = hcWithType(`${import.meta.env.VITE_HOST_URL}/api`, {
  init: {
    credentials: "include",
  },
  headers: (): Record<string, string> => {
    if (isServer) {
      return { cookie: getServerHeaders().get("cookie") ?? "" };
    }
    return {};
  },
});
