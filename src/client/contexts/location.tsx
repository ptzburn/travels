import {
  createContext,
  createEffect,
  onCleanup,
  ParentProps,
  Show,
  useContext,
} from "solid-js";

import { userLocationQuery } from "../lib/queries/locations.ts";
import { useSession } from "./session-context.tsx";
import {
  AccessorWithLatest,
  createAsync,
  useLocation,
  useParams,
} from "@solidjs/router";
import type { SelectLocation } from "~/shared/types.ts";
import { setMapStore } from "../stores/map.ts";
import { useLocations } from "./locations.tsx";

const LocationContext = createContext<
  AccessorWithLatest<SelectLocation | undefined>
>();

export function LocationProvider(props: ParentProps) {
  const session = useSession();

  return (
    <Show
      when={session()}
      fallback={
        <LocationContext.Provider value={undefined}>
          {props.children}
        </LocationContext.Provider>
      }
    >
      <LocationProviderWithSession>
        {props.children}
      </LocationProviderWithSession>
    </Show>
  );
}

function LocationProviderWithSession(props: ParentProps) {
  const params = useParams<{ slug: string }>();
  const location = createAsync(() => userLocationQuery(params.slug));

  const locations = useLocations();

  const routerLocation = useLocation();

  createEffect(() => {
    const loc = location();
    if (loc && routerLocation.pathname.startsWith("/dashboard/location")) {
      setMapStore("locations", [loc]);
    }
  });

  onCleanup(() => {
    if (locations) {
      const locs = locations();
      setMapStore("locations", locs);
    }
  });

  return (
    <LocationContext.Provider value={location}>
      {props.children}
    </LocationContext.Provider>
  );
}

export function useOneLocation() {
  const context = useContext(LocationContext);

  if (!context) {
    throw new Error("useOneLocation must be used within LocationProvider");
  }

  return context;
}
