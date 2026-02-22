import { hc } from "hono/client";
import { isServer } from "solid-js/web";
import type { AppType } from "~/api/app.ts";
import { getServerHeaders } from "../client/lib/utils.ts";

export type Client = ReturnType<typeof hc<AppType>>;

export function hcWithType(...args: Parameters<typeof hc>): Client {
  return hc<AppType>(...args);
}

export const rpcClient = hcWithType(`https://travels.hokkanen.io/api`, {
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
