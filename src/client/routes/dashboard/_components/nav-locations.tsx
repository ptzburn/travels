import { Index } from "solid-js";
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
import { mapStore, setMapStore } from "~/client/stores/map.ts";

export function NavLocations() {
  const locations = useLocations();

  return (
    <Suspense
      fallback={
        <>
          <Separator />
          <SidebarGroup>
            <SidebarMenu>
              <Index each={[0, 1, 2]}>
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
              </Index>
            </SidebarMenu>
          </SidebarGroup>
        </>
      }
    >
      <Show when={locations().length > 0}>
        <Separator />
        <SidebarGroup>
          <SidebarMenu>
            <Index each={locations()}>
              {(location) => (
                <Collapsible>
                  <A href={`/dashboard/location/${location().slug}`}>
                    <SidebarMenuItem
                      class={mapStore.selectedLocation?._id ===
                          location()._id
                        ? "bg-accent rounded"
                        : undefined}
                      onMouseEnter={() =>
                        setMapStore("selectedLocation", location())}
                      onMouseLeave={() => setMapStore("selectedLocation", null)}
                    >
                      <SidebarMenuButton
                        tooltip={location().name}
                      >
                        <MapPin />
                        <span>{location().name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </A>
                </Collapsible>
              )}
            </Index>
          </SidebarMenu>
        </SidebarGroup>
      </Show>
    </Suspense>
  );
}
