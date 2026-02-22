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

export const deleteLocationLogAction = action(
  async (slug: string, id: string) => {
    const response = await rpcClient.locations[":slug"][":id"].$delete({
      param: { slug, id },
    });

    if (!response.ok) {
      const error = await response.json();
      if ("message" in error) {
        throw new Error(error.message, { cause: response.status });
      }
      if ("errors" in error) {
        const errorMessages = error.errors.map((e) => Object.values(e))
          .flat().join(", ");
        throw new Error(errorMessages, { cause: response.status });
      }
      throw new Error("Unknown error");
    }

    return;
  },
  "deleteLocationLog",
);

export const uploadLocationLogImageAction = action(
  async (slug: string, id: string, file: Blob) => {
    const response = await rpcClient.locations[":slug"][":id"].images.$post({
      param: { slug, id },
      form: { file },
    });

    if (!response.ok) {
      const error = await response.json();
      if ("message" in error) {
        throw new Error(error.message, { cause: response.status });
      }
      throw new Error("Unknown error");
    }

    return await response.json();
  },
  "uploadLocationLogImage",
);
