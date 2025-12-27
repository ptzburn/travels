import "maplibre-gl/dist/maplibre-gl.css";
import { Map, Marker, useMapEffect } from "solid-maplibre";
import { useColorMode } from "@kobalte/core";
import * as maplibre from "maplibre-gl";
import { HELSINKI_LAT_LONG } from "~/client/lib/constants.ts";
import { For, Show, Suspense } from "solid-js";
import MapPin from "lucide-solid/icons/map-pin";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/client/components/ui/tooltip.tsx";
import { useLocations } from "~/client/contexts/locations.tsx";
import { AccessorWithLatest } from "@solidjs/router";
import { SelectLocations } from "~/shared/types.ts";

function MapUpdater(props: {
  style: string;
  locations:
    | AccessorWithLatest<SelectLocations>
    | undefined;
}) {
  useMapEffect((map) => {
    map.setStyle(props.style);

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

    map.fitBounds(bounds, { padding: 40 });
  });

  return null;
}

export default function MapComponent() {
  const { colorMode } = useColorMode();
  const locations = useLocations();

  console.log(typeof maplibre.Map);

  const mapStyle = () =>
    colorMode() === "dark"
      ? "/styles/dark.json"
      : "https://tiles.openfreemap.org/styles/liberty";

  return (
    <Map
      style={{
        width: "100%",
        "aspect-ratio": "calc(16/9)",
        "border-radius": "15px",
      }}
      options={{
        center: HELSINKI_LAT_LONG,
        zoom: 10,
        style: mapStyle(),
      }}
    >
      <MapUpdater style={mapStyle()} locations={locations} />
      <Suspense fallback={null}>
        <Show when={locations && locations()}>
          {(locs) => (
            <For each={locs()}>
              {(location) => (
                <Marker
                  position={[location.long, location.lat]}
                  element={(
                    <div>
                      <Tooltip>
                        <TooltipTrigger>
                          <MapPin
                            size={30}
                            class="fill-primary text-accent hover:cursor-pointer"
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          {location.name}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  ) as HTMLElement}
                />
              )}
            </For>
          )}
        </Show>
      </Suspense>
    </Map>
  );
}
