import { query } from "@solidjs/router";
import { isServer } from "solid-js/web";
import { getRequestEvent } from "solid-js/web";
import { rpcClient } from "~/shared/rpc-client.ts";

export const userLocationsQuery = query(async () => {
  "use server";
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const event = getRequestEvent();
  if (!event) {
    throw new Error("No request event available");
  }

  const response = await rpcClient.locations.$get({}, {
    headers: {
      cookie: event.request.headers.get("cookie") ?? "",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return await response.json();
}, "locations");

export async function fetchLocations() {
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

  const response = await rpcClient.locations.$get({}, {
    headers: {
      cookie,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return await response.json();
}
