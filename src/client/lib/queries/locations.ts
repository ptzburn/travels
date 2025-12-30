import { isServer } from "solid-js/web";
import { getRequestEvent } from "solid-js/web";
import { rpcClient } from "~/shared/rpc-client.ts";
import { query } from "@solidjs/router";
import { SearchQuery } from "~/shared/types.ts";

export const userLocationQuery = query(async () => {
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
}, "locations");

export const locationSearchQuery = query(async (query: SearchQuery) => {
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

  const response = await rpcClient.search.$get({ query }, {
    headers: {
      cookie,
    },
  });

  if (!response.ok && response.status !== 422) {
    const json = await response.json();
    if ("message" in json) {
      throw new Error(json.message);
    }
    throw new Error("Unknown error");
  }

  return await response.json();
}, "search");
