import { For } from "solid-js";
import { A } from "@solidjs/router";
import MapPin from "lucide-solid/icons/map-pin";

import { Collapsible } from "~/client/components/ui/collapsible.tsx";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/client/components/ui/sidebar.tsx";
import { Show } from "solid-js";
import { Skeleton } from "~/client/components/ui/skeleton.tsx";
import { useLocations } from "~/client/contexts/locations.tsx";
import { Suspense } from "solid-js";
import { Separator } from "~/client/components/ui/separator.tsx";
import { selectedLocation, setSelectedLocation } from "./map.tsx";

export function NavLocations() {
  const locations = useLocations();

  return (
    <Suspense
      fallback={
        <>
          <Separator />
          <SidebarGroup>
            <SidebarMenu>
              <For each={[0, 1, 2]}>
                {() => (
                  <Collapsible>
                    <SidebarMenuItem>
                      <SidebarMenuButton>
                        <MapPin />
                        <Skeleton height={16} width={200} radius={10} />
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </Collapsible>
                )}
              </For>
            </SidebarMenu>
          </SidebarGroup>
        </>
      }
    >
      <Show when={locations && locations()}>
        {(locs) => (
          <>
            <Show when={locs().length}>
              <Separator />
            </Show>
            <SidebarGroup>
              <SidebarMenu>
                <For each={locs()}>
                  {(location) => (
                    <Collapsible>
                      <A href="#">
                        <SidebarMenuItem
                          class={selectedLocation() === location
                            ? "bg-accent rounded"
                            : undefined}
                          onMouseEnter={() => setSelectedLocation(location)}
                          onMouseLeave={() => setSelectedLocation(null)}
                        >
                          <SidebarMenuButton
                            tooltip={location.name}
                          >
                            <MapPin />
                            <span>{location.name}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </A>
                    </Collapsible>
                  )}
                </For>
              </SidebarMenu>
            </SidebarGroup>
          </>
        )}
      </Show>
    </Suspense>
  );
}
