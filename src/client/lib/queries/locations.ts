import { rpcClient } from "~/shared/rpc-client.ts";
import { query } from "@solidjs/router";
import { SearchQuery } from "~/shared/types.ts";

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
  "use server";

  if (!slug) {
    throw new Error("Slug is required");
  }
  const response = await rpcClient.locations[":slug"].$get(
    { param: { slug } },
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
