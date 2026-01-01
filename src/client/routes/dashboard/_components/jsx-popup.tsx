import { useMapEffect } from "solid-maplibre";
import * as maplibre from "maplibre-gl";
import { createEffect, JSX, onCleanup, splitProps } from "solid-js";
import { render } from "solid-js/web";

export type JsxPopupProps = Partial<maplibre.PopupOptions> & {
  position?: maplibre.LngLatLike;
  children?: JSX.Element;
};

export function JsxPopup(initial: JsxPopupProps) {
  const [props, options] = splitProps(initial, ["position", "children"]);

  let popup: maplibre.Popup | undefined;
  let container: HTMLDivElement | undefined;
  let dispose: (() => void) | undefined;

  useMapEffect((map) => {
    if (!popup) {
      popup = new maplibre.Popup(options);
    }

    if (props.position && props.children) {
      // Create a container for SolidJS to render into
      container = document.createElement("div");

      // Use SolidJS render to mount the children into the container
      dispose = render(() => props.children, container);

      popup.setLngLat(props.position).setDOMContent(container).addTo(map);
    } else {
      popup.remove();
    }
  });

  // Update position reactively
  createEffect(() => {
    if (popup && props.position) {
      popup.setLngLat(props.position);
    }
  });

  onCleanup(() => {
    dispose?.();
    popup?.remove();
  });

  return <div></div>;
}
