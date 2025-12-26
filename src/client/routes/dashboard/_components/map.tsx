import "maplibre-gl/dist/maplibre-gl.css";
import { Map, useMapEffect } from "solid-maplibre";
import { useColorMode } from "@kobalte/core";
import * as maplibre from "maplibre-gl";
import { HELSINKI_LAT_LONG } from "~/client/lib/constants.ts";

function MapStyleUpdater(props: { style: string }) {
  useMapEffect((map) => {
    map.setStyle(props.style);
  });

  return null; // Renders nothing
}

export default function MapComponent() {
  const { colorMode } = useColorMode();

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
      <MapStyleUpdater style={mapStyle()} />
    </Map>
  );
}
