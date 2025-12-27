import { createContext, useContext } from "solid-js";

import { userLocationQuery } from "../lib/queries/locations.ts";
import { ParentProps } from "solid-js";
import { useSession } from "./session-context.tsx";
import { AccessorWithLatest, createAsync } from "@solidjs/router";

const LocationsContext = createContext<
  AccessorWithLatest<{
    _id: string;
    user: string;
    name: string;
    slug: string;
    lat: number;
    long: number;
    createdAt: string;
    updatedAt: string;
    description?: string | undefined;
  }[]>
>();

export function LocationsProvider(props: ParentProps) {
  const session = useSession();

  if (!session()) {
    return (
      <LocationsContext.Provider
        value={undefined}
      >
        {props.children}
      </LocationsContext.Provider>
    );
  }

  const locations = createAsync(() => userLocationQuery(), {
    initialValue: [],
  });

  return (
    <LocationsContext.Provider
      value={locations}
    >
      {props.children}
    </LocationsContext.Provider>
  );
}

export function useLocations() {
  return useContext(LocationsContext);
}
