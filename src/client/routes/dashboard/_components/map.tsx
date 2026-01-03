import "maplibre-gl/dist/maplibre-gl.css";
import { Map, MapsProvider, Marker, useMapEffect } from "solid-maplibre";
import { useColorMode } from "@kobalte/core";
import * as maplibre from "maplibre-gl";
import {
  CENTER_OF_FINLAND,
  HELSINKI_LONG_LAT,
  MAIN_PAGES,
} from "~/client/lib/constants.ts";
import { Index, onCleanup, Show, Suspense } from "solid-js";

import { LocationPin } from "./marker.tsx";
import { mapStore, setMapStore } from "~/client/stores/map.ts";
import { DraggableMarker } from "./draggable-marker.tsx";
import { useLocations } from "~/client/contexts/locations.tsx";
import { useLocation, useParams } from "@solidjs/router";
import { hasSlugAndId, hasSlugAndNotId } from "../../../lib/utils.ts";

function MapUpdater() {
  const locations = useLocations();

  useMapEffect((map) => {
    setMapStore("map", map);

    if (locations().length < 1) {
      setMapStore("bounds", null);
      map.flyTo({
        center: CENTER_OF_FINLAND,
        zoom: 2,
      });
      return;
    }

    const firstPoint = locations()[0];

    const bounds = locations().reduce(
      (bounds, point) => {
        return bounds.extend([point.long, point.lat]);
      },
      new maplibre.LngLatBounds([firstPoint.long, firstPoint.lat], [
        firstPoint.long,
        firstPoint.lat,
      ]),
    );

    setMapStore("bounds", bounds);

    map.fitBounds(bounds, { padding: 40, maxZoom: 10 });
  });

  return null;
}

function MapFlyer() {
  useMapEffect((map) => {
    if (mapStore.addedLocation) return;
    if (mapStore.bounds) {
      map.fitBounds(mapStore.bounds, { padding: 40, maxZoom: 10 });
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
          zoom: mapStore.addedLocation.zoom ?? 6,
        });
      } else if (mapStore.bounds) {
        map.fitBounds(mapStore.bounds, { padding: 40, maxZoom: 10 });
      }
    });

    resizeObserver.observe(container);

    onCleanup(() => {
      resizeObserver.disconnect();
    });
  });

  return null;
}

const updateAddedLocation = (coordinates: maplibre.LngLat) => {
  if (mapStore.addedLocation) {
    setMapStore("addedLocation", {
      lat: coordinates.lat,
      long: coordinates.lng,
    });
  }
};

export default function MapComponent() {
  const location = useLocation();
  const params = useParams();

  const { colorMode } = useColorMode();

  const mapStyle = colorMode() === "dark"
    ? "/styles/dark.json"
    : "https://tiles.openfreemap.org/styles/liberty";

  const locations = useLocations();

  const mapLocations = () => {
    if (MAIN_PAGES.has(location.pathname)) return locations();
    if (hasSlugAndNotId(params.slug, params.id)) {
      const logs = () =>
        locations().find((loc) => loc.slug === params.slug)?.logs;
      return logs() ?? [];
    }
    if (hasSlugAndId(params.slug, params.id)) {
      const logs = () =>
        locations().find((loc) => loc.slug === params.slug)?.logs;

      const log = () => {
        const currentLogs = logs();
        if (!currentLogs || currentLogs.length < 1) return;
        return currentLogs.filter((log) => log._id === params.id);
      };
      return log() ?? [];
    }
    return [];
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
          style: mapStyle,
        }}
      >
        <MapUpdater />
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
          <Index
            each={mapLocations()}
          >
            {(location) => (
              <Marker
                position={[location().long, location().lat]}
                element={(
                  <div>
                    <LocationPin
                      location={location()}
                    />
                  </div>
                ) as HTMLElement}
              />
            )}
          </Index>
        </Suspense>
      </Map>
    </MapsProvider>
  );
}
