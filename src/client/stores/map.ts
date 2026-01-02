import { createStore } from "solid-js/store";
import { SelectLocation } from "~/shared/types.ts";
import { LngLatBounds, Map } from "maplibre-gl";

export const [mapStore, setMapStore] = createStore<
  {
    map: Map | null;
    selectedLocation: SelectLocation | null;
    addedLocation: (SelectLocation & { zoom?: number }) | null;
    bounds: LngLatBounds | null;
  }
>({
  map: null,
  selectedLocation: null,
  addedLocation: null,
  bounds: null,
});
