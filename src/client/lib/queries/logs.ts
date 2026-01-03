import { query } from "@solidjs/router";
import { getRequestEvent, isServer } from "solid-js/web";
import { rpcClient } from "~/shared/rpc-client.ts";

export const userLocationLogQuery = query(async (slug: string, id: string) => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  let cookie: string;

  if (isServer) {
    const event = getRequestEvent();
    if (!event) {
      throw new Error("No request event available");
    }
    cookie = event.request.headers.get("cookie") ?? "";
  } else {
    cookie = document.cookie;
  }

  const response = await rpcClient.locations[":slug"][":id"].$get({
    param: { slug, id },
  }, {
    headers: {
      cookie,
    },
  });

  if (!response.ok) {
    const error = await response.json();

    if ("errors" in error) {
      const errorMessages = error.errors.map((e) => Object.values(e))
        .flat().join(", ");
      throw new Error(errorMessages, { cause: response.status });
    }

    throw new Error(error.message, { cause: response.status });
  }

  return await response.json();
}, "locationLog");
