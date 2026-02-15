import { query } from "@solidjs/router";
import { rpcClient } from "~/shared/rpc-client.ts";

export const userLocationLogQuery = query(async (slug: string, id: string) => {
  "use server";

  const response = await rpcClient.locations[":slug"][":id"].$get({
    param: { slug, id },
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
