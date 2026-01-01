import {
  createContext,
  createEffect,
  ParentProps,
  Show,
  useContext,
} from "solid-js";

import { userLocationsQuery } from "../lib/queries/locations.ts";
import { useSession } from "./session-context.tsx";
import { AccessorWithLatest, createAsync } from "@solidjs/router";
import type { SelectLocation } from "~/shared/types.ts";
import { setMapStore } from "../stores/map.ts";

const LocationsContext = createContext<
  AccessorWithLatest<SelectLocation[]>
>();

export function LocationsProvider(props: ParentProps) {
  const session = useSession();

  return (
    <Show
      when={session()}
      fallback={
        <LocationsContext.Provider value={undefined}>
          {props.children}
        </LocationsContext.Provider>
      }
    >
      <LocationsProviderWithSession>
        {props.children}
      </LocationsProviderWithSession>
    </Show>
  );
}

function LocationsProviderWithSession(props: ParentProps) {
  const locations = createAsync(() => userLocationsQuery(), {
    initialValue: [],
  });

  createEffect(() => {
    if (locations) {
      setMapStore("locations", locations());
    }
  });

  return (
    <LocationsContext.Provider value={locations}>
      {props.children}
    </LocationsContext.Provider>
  );
}

export function useLocations() {
  return useContext(LocationsContext);
}
