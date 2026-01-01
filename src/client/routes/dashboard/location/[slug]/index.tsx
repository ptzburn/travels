import { Show } from "solid-js";
import { useOneLocation } from "~/client/contexts/location.tsx";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/client/components/ui/empty.tsx";
import { Button } from "~/client/components/ui/button.tsx";
import { A } from "@solidjs/router";

import ScrollText from "lucide-solid/icons/scroll-text";
import MapPinPlus from "lucide-solid/icons/map-pin-plus";

function LocationPage() {
  const location = useOneLocation();
  return (
    <Show when={location?.()}>
      {(location) => (
        <div>
          <h2 class="text-xl">{location().name}</h2>
          <p class="text-sm">{location().description}</p>
          <Show when={location().logs}>
            {(logs) => (
              <Show
                when={logs().length}
                fallback={
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <ScrollText />
                      </EmptyMedia>
                      <EmptyTitle>
                        No logs found
                      </EmptyTitle>
                      <EmptyDescription>
                        Add a location log to get started.
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <div class="flex flex-col justify-center gap-4 sm:flex-row sm:gap-6">
                        <Button as={A} href="/dashboard/add">
                          Add Location Log
                          <MapPinPlus size={24} />
                        </Button>
                      </div>
                    </EmptyContent>
                  </Empty>
                }
              >
                <p>{logs().length}</p>
              </Show>
            )}
          </Show>
        </div>
      )}
    </Show>
  );
}

export default LocationPage;
