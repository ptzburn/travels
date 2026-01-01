import { createStore } from "solid-js/store";
import { SelectLocation } from "~/shared/types.ts";
import { LngLatBounds, Map } from "maplibre-gl";

export const [mapStore, setMapStore] = createStore<
  {
    map: Map | null;
    locations?: SelectLocation[];
    selectedLocation: SelectLocation | null;
    addedLocation: SelectLocation | null;
    bounds: LngLatBounds | null;
    isError: boolean;
  }
>({
  map: null,
  selectedLocation: null,
  addedLocation: null,
  bounds: null,
  isError: false,
});
