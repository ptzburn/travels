import "maplibre-gl/dist/maplibre-gl.css";
import { Map, Marker, Popup, useMapEffect } from "solid-maplibre";
import { useColorMode } from "@kobalte/core";
import * as maplibre from "maplibre-gl";
import { HELSINKI_LAT_LONG } from "~/client/lib/constants.ts";
import { createSignal, For, Show, Suspense } from "solid-js";
import MapPin from "lucide-solid/icons/map-pin";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/client/components/ui/tooltip.tsx";
import { useLocations } from "~/client/contexts/locations.tsx";
import { AccessorWithLatest } from "@solidjs/router";
import { SelectLocation } from "~/shared/types.ts";

const [bounds, setBounds] = createSignal<
  maplibre.LngLatBounds | null
>(
  null,
);

function MapUpdater(props: {
  style: string;
  locations:
    | AccessorWithLatest<SelectLocation[]>
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

    setBounds(bounds);

    map.fitBounds(bounds, { padding: 40 });
  });

  return null;
}

function MapFlyer(props: {
  selectedLocation: SelectLocation | null;
}) {
  useMapEffect((map) => {
    if (props.selectedLocation) {
      map.flyTo({
        center: [props.selectedLocation.long, props.selectedLocation.lat],
        speed: 0.8,
      });
    } else if (bounds()) {
      map.fitBounds(bounds()!);
    }
  });

  return null;
}

export const [selectedLocation, setSelectedLocation] = createSignal<
  SelectLocation | null
>(
  null,
);

export default function MapComponent() {
  const { colorMode } = useColorMode();
  const locations = useLocations();
  const [clickedLocation, setClickedLocation] = createSignal<
    SelectLocation | null
  >(
    null,
  );

  console.log(typeof maplibre.Map);

  const mapStyle = () =>
    colorMode() === "dark"
      ? "/styles/dark.json"
      : "https://tiles.openfreemap.org/styles/liberty";

  return (
    <Map
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
      options={{
        center: HELSINKI_LAT_LONG,
        style: mapStyle(),
      }}
    >
      <MapUpdater style={mapStyle()} locations={locations} />
      <MapFlyer selectedLocation={selectedLocation()} />
      <Suspense fallback={null}>
        <Show when={locations && locations()}>
          {(locs) => (
            <For each={locs()}>
              {(location) => (
                <>
                  <Marker
                    position={[location.long, location.lat]}
                    element={(
                      <div
                        onClick={() => {
                          if (clickedLocation() === location) {
                            setClickedLocation(null);
                            setTimeout(() => setClickedLocation(location), 0);
                          } else {
                            setClickedLocation(location);
                          }
                        }}
                        onMouseEnter={() => setSelectedLocation(location)}
                        onMouseLeave={() => setSelectedLocation(null)}
                      >
                        <Tooltip>
                          <TooltipTrigger>
                            <MapPin
                              size={30}
                              class={`${
                                selectedLocation() === location
                                  ? "fill-info-foreground"
                                  : "fill-primary"
                              } text-accent hover:cursor-pointer`}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            {location.name}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    ) as HTMLElement}
                  />

                  <Show when={clickedLocation() === location}>
                    <Popup
                      offset={12}
                      closeOnMove
                      closeOnClick
                      closeButton={false}
                      position={[location.long, location.lat]}
                      content={`
                        <h3 class="text-xl text-primary">
                          ${location.name}
                        </h3>
                        <p class="text-primary">
                          ${location.description}
                        </p>
                      `}
                    />
                  </Show>
                </>
              )}
            </For>
          )}
        </Show>
      </Suspense>
    </Map>
  );
}
