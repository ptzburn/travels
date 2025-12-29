import { createSignal, onCleanup, Show } from "solid-js";
import { SelectLocation } from "~/shared/types.ts";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/client/components/ui/tooltip.tsx";
import MapPin from "lucide-solid/icons/map-pin";
import { mapStore, setMapStore } from "~/client/stores/map.ts";
import { Popup } from "solid-maplibre";

export function LocationPin(props: {
  location: SelectLocation;
}) {
  const [isConnected, setIsConnected] = createSignal(false);
  const [isPopupOpen, setIsPopupOpen] = createSignal(false);

  const isHovered = () => mapStore.selectedLocation?._id === props.location._id;

  return (
    <div
      ref={(el) => {
        let frameId: number;

        const check = () => {
          if (el.isConnected) {
            setIsConnected(true);
          } else {
            frameId = requestAnimationFrame(check);
          }
        };

        check();

        onCleanup(() => cancelAnimationFrame(frameId));
      }}
    >
      <Tooltip
        open={isConnected() && isHovered() && !isPopupOpen()}
      >
        <TooltipTrigger
          as="div"
          class="outline-none"
          onClick={() => {
            console.log("click");
            setIsPopupOpen(!isPopupOpen());
          }}
          onMouseEnter={() => {
            setMapStore("selectedLocation", props.location);
          }}
          onMouseLeave={() => {
            setMapStore("selectedLocation", null);
          }}
        >
          <MapPin
            size={30}
            class={`${
              isHovered() ? "fill-info-foreground" : "fill-primary"
            } text-accent transition-colors hover:cursor-pointer`}
          />
        </TooltipTrigger>
        <TooltipContent>
          {props.location.name}
        </TooltipContent>
      </Tooltip>

      <Show when={isPopupOpen()}>
        <Popup
          offset={12}
          closeOnMove={false}
          closeOnClick={false}
          closeButton={false}
          position={[props.location.long, props.location.lat]}
          content={`
                        <h3 class="text-xl text-primary">
                          ${props.location.name}
                        </h3>
                        <p class="text-primary">
                          ${props.location.description}
                        </p>
                      `}
        />
      </Show>
    </div>
  );
}
