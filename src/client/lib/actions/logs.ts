import { action } from "@solidjs/router";
import { InsertLocationLog, UpdateLocationLog } from "~/shared/types.ts";
import { rpcClient } from "~/shared/rpc-client.ts";

export const addLocationLogAction = action(
  async (locationLogData: InsertLocationLog, slug: string) => {
    const response = await rpcClient.locations[":slug"].add.$post({
      param: { slug },
      json: locationLogData,
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
  "addLocationLog",
);

export const updateLocationLogAction = action(
  async (slug: string, id: string, updates: UpdateLocationLog) => {
    const response = await rpcClient.locations[":slug"][":id"].$put({
      param: { slug, id },
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
  "updateLocationLog",
);
