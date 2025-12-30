import "maplibre-gl/dist/maplibre-gl.css";
import { Map, MapsProvider, Marker, useMapEffect } from "solid-maplibre";
import { useColorMode } from "@kobalte/core";
import * as maplibre from "maplibre-gl";
import {
  CENTER_OF_FINLAND,
  HELSINKI_LONG_LAT,
} from "~/client/lib/constants.ts";
import { For, onCleanup, Show, Suspense } from "solid-js";

import { useLocations } from "~/client/contexts/locations.tsx";
import { AccessorWithLatest } from "@solidjs/router";
import { SelectLocation } from "~/shared/types.ts";
import { LocationPin } from "./marker.tsx";
import { mapStore, setMapStore } from "~/client/stores/map.ts";
import { DraggableMarker } from "./draggable-marker.tsx";

function MapUpdater(props: {
  locations:
    | AccessorWithLatest<SelectLocation[]>
    | undefined;
}) {
  useMapEffect((map) => {
    const { colorMode } = useColorMode();

    const mapStyle = colorMode() === "dark"
      ? "/styles/dark.json"
      : "https://tiles.openfreemap.org/styles/liberty";

    map.setStyle(mapStyle);
    setMapStore("map", map);

    if (!props.locations) return;

    const firstPoint = props.locations()[0];
    if (!firstPoint) return;

    const bounds = props.locations().reduce(
      (bounds, point) => {
        return bounds.extend([point.long, point.lat]);
      },
      new maplibre.LngLatBounds([firstPoint.long, firstPoint.lat], [
        firstPoint.long,
        firstPoint.lat,
      ]),
    );

    setMapStore("bounds", bounds);

    map.fitBounds(bounds, { padding: 40 });
  });

  return null;
}

function MapFlyer() {
  useMapEffect((map) => {
    if (mapStore.addedLocation) return;
    if (mapStore.bounds) {
      map.fitBounds(mapStore.bounds, { padding: 40 });
    }
  });

  return null;
}

function MapResizer() {
  useMapEffect((map) => {
    const container = map.getContainer();
    const resizeObserver = new ResizeObserver(() => {
      map.resize();

      if (mapStore.addedLocation) {
        map.flyTo({
          center: [mapStore.addedLocation.long, mapStore.addedLocation.lat],
          speed: 0.8,
          zoom: 6,
        });
      } else if (mapStore.bounds) {
        map.fitBounds(mapStore.bounds, { padding: 40 });
      }
    });

    resizeObserver.observe(container);

    onCleanup(() => {
      resizeObserver.disconnect();
    });
  });

  return null;
}

export default function MapComponent() {
  const locations = useLocations();

  const updateAddedLocation = (coordinates: maplibre.LngLat) => {
    if (mapStore.addedLocation) {
      setMapStore("addedLocation", {
        lat: coordinates.lat,
        long: coordinates.lng,
      });
    }
  };

  return (
    <MapsProvider>
      <Map
        ondblclick={(e) => updateAddedLocation(e.lngLat)}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        options={{
          doubleClickZoom: false,
          center: HELSINKI_LONG_LAT,
        }}
      >
        <MapUpdater locations={locations} />
        <MapFlyer />
        <MapResizer />
        <Show when={mapStore.addedLocation?._id}>
          <Marker
            position={mapStore.addedLocation
              ? [mapStore.addedLocation.long, mapStore.addedLocation.lat]
              : CENTER_OF_FINLAND}
            draggable
            ondrag={(e) => updateAddedLocation(e.target._lngLat)}
            className="z-50"
            element={(
              <div>
                <DraggableMarker />
              </div>
            ) as HTMLElement}
          />
        </Show>
        <Suspense fallback={null}>
          <Show when={locations && locations()}>
            {(locs) => (
              <For each={locs()}>
                {(location) => (
                  <Marker
                    position={[location.long, location.lat]}
                    element={(
                      <div>
                        <LocationPin
                          location={location}
                        />
                      </div>
                    ) as HTMLElement}
                  />
                )}
              </For>
            )}
          </Show>
        </Suspense>
      </Map>
    </MapsProvider>
  );
}
