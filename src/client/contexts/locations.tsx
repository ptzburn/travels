import {
  createContext,
  createEffect,
  ParentProps,
  Show,
  useContext,
} from "solid-js";

import { userLocationsQuery } from "../lib/queries/locations.ts";
import { useSession } from "./session-context.tsx";
import { AccessorWithLatest, createAsync, useLocation } from "@solidjs/router";
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

  const location = useLocation();

  createEffect(() => {
    if (locations && !location.pathname.includes("location")) {
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
  const context = useContext(LocationsContext);

  if (!context) {
    throw new Error("useLocations must be used within LocationsProvider");
  }

  return context;
}
