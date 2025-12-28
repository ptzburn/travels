import { createSignal, onCleanup } from "solid-js";
import { SelectLocation } from "~/shared/types.ts";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/client/components/ui/tooltip.tsx";
import MapPin from "lucide-solid/icons/map-pin";
import {
  clickedLocation,
  selectedLocation,
  setClickedLocation,
} from "./map.tsx";

export function LocationPin(props: {
  location: SelectLocation;
  onHoverEnter: () => void;
  onHoverLeave: () => void;
}) {
  const [isConnected, setIsConnected] = createSignal(false);

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
        open={isConnected() && props.location === selectedLocation() &&
          props.location !== clickedLocation()}
      >
        <TooltipTrigger
          as="div"
          class="outline-none"
          onClick={(e) => {
            e.stopPropagation();
            {
              if (clickedLocation() === props.location) {
                setClickedLocation(null);
                setTimeout(() => setClickedLocation(props.location), 0);
              } else {
                setClickedLocation(props.location);
              }
            }
          }}
          onMouseEnter={() => {
            props.onHoverEnter();
          }}
          onMouseLeave={() => {
            props.onHoverLeave();
          }}
        >
          <MapPin
            size={30}
            class={`${
              props.location === selectedLocation()
                ? "fill-info-foreground"
                : "fill-primary"
            } text-accent hover:cursor-pointer transition-colors`}
          />
        </TooltipTrigger>
        <TooltipContent>
          {props.location.name}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
