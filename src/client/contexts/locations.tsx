import {
  createContext,
  createEffect,
  createResource,
  Resource,
  useContext,
} from "solid-js";

import MapPin from "lucide-solid/icons/map-pin";
import { fetchLocations } from "../lib/queries/locations.ts";
import { setSidebarStore } from "../stores/sidebar.ts";
import { ParentProps } from "solid-js";
import { useSession } from "./session-context.tsx";

const LocationsContext = createContext<{
  data: Resource<
    {
      _id: string;
      user: string;
      name: string;
      slug: string;
      lat: number;
      long: number;
      createdAt: string;
      updatedAt: string;
      description?: string | undefined;
    }[] | undefined
  >;
  refetch: (info?: unknown) =>
    | {
      _id: string;
      user: string;
      name: string;
      slug: string;
      lat: number;
      long: number;
      createdAt: string;
      updatedAt: string;
      description?: string | undefined;
    }[]
    | Promise<
      {
        _id: string;
        user: string;
        name: string;
        slug: string;
        lat: number;
        long: number;
        createdAt: string;
        updatedAt: string;
        description?: string | undefined;
      }[] | undefined
    >
    | null
    | undefined;
}>();

export function LocationsProvider(props: ParentProps) {
  const { session } = useSession();

  if (!session()) {
    return (
      <LocationsContext.Provider
        value={undefined}
      >
        {props.children}
      </LocationsContext.Provider>
    );
  }

  const [locations, { refetch }] = createResource(fetchLocations);

  createEffect(() => {
    const items = locations()?.map((location) => ({
      title: location.name,
      description: location.description,
      url: "#",
      icon: MapPin,
    }));

    if (items) {
      setSidebarStore("sidebarItems", items);
    }

    setSidebarStore("isLoading", locations.loading);
  });

  return (
    <LocationsContext.Provider
      value={{ data: locations, refetch }}
    >
      {props.children}
    </LocationsContext.Provider>
  );
}

export function useLocations() {
  return useContext(LocationsContext);
}
