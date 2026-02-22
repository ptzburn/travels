import { rpcClient } from "~/shared/rpc-client.ts";
import { query } from "@solidjs/router";
import { SearchQuery } from "~/shared/types.ts";
import { getRequestEvent, isServer } from "solid-js/web";

export const userLocationsQuery = query(async () => {
  "use server";

  const response = await rpcClient.locations.$get({});

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return await response.json();
}, "locations");

export const userLocationQuery = query(async (slug?: string) => {
  if (!slug) {
    throw new Error("Slug is required");
  }

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

  const response = await rpcClient.locations[":slug"].$get(
    { param: { slug } },
    {
      headers: {
        cookie,
      },
    },
  );

  if (!response.ok) {
    const error = await response.json();

    if ("errors" in error) {
      const errorMessages = error.errors.map((e) => Object.values(e))
        .flat().join(", ");
      throw new Error(errorMessages, { cause: response.status });
    }

    throw new Error(error.message, { cause: response.status });
  }

  const json = await response.json();

  return [json];
}, "location");

export const locationSearchQuery = query(async (query: SearchQuery) => {
  "use server";

  const response = await rpcClient.search.$get({ query });

  if (!response.ok && response.status !== 422) {
    const json = await response.json();
    if ("message" in json) {
      throw new Error(json.message);
    }
    throw new Error("Unknown error");
  }

  return await response.json();
}, "search");
