import { createStore } from "solid-js/store";
import { SelectLocation, SelectLocationLog } from "~/shared/types.ts";
import { LngLatBounds, Map } from "maplibre-gl";

export const [mapStore, setMapStore] = createStore<
  {
    map: Map | null;
    selectedLocation: SelectLocation | SelectLocationLog | null;
    addedLocation: (SelectLocation & { zoom?: number }) | null;
    bounds: LngLatBounds | null;
  }
>({
  map: null,
  selectedLocation: null,
  addedLocation: null,
  bounds: null,
});
