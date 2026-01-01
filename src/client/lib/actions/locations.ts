import { action } from "@solidjs/router";
import { rpcClient } from "~/shared/rpc-client.ts";
import { InsertLocation, UpdateLocation } from "~/shared/types.ts";

export const addLocationAction = action(
  async (locationData: InsertLocation) => {
    const response = await rpcClient.locations.$post({ json: locationData });

    if (!response.ok && response.status !== 422) {
      const json = await response.json();
      if ("message" in json) {
        throw new Error(json.message);
      }
      throw new Error("Unknown error");
    }

    return await response.json();
  },
  "addLocation",
);

export const updateLocationAction = action(
  async (slug: string, updates: UpdateLocation) => {
    const response = await rpcClient.locations[":slug"].$put({
      param: { slug },
      json: updates,
    });

    if (!response.ok && response.status !== 422) {
      const json = await response.json();
      if ("message" in json) {
        throw new Error(json.message);
      }
      throw new Error("Unknown error");
    }

    return await response.json();
  },
  "addLocation",
);
