import { createSignal, onCleanup } from "solid-js";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/client/components/ui/tooltip.tsx";
import MapPin from "lucide-solid/icons/map-pin";

export function DraggableMarker() {
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
        open={isConnected()}
      >
        <TooltipTrigger
          as="div"
          class="outline-none"
        >
          <MapPin
            size={30}
            class="fill-success-foreground text-accent transition-colors hover:cursor-pointer"
          />
        </TooltipTrigger>
        <TooltipContent>
          Drag to your desired location
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
