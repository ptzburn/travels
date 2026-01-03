import { Index, Suspense } from "solid-js";
import { A, useLocation, useParams } from "@solidjs/router";
import MapPin from "lucide-solid/icons/map-pin";

import { Collapsible } from "~/client/components/ui/collapsible.tsx";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/client/components/ui/sidebar.tsx";
import { Skeleton } from "~/client/components/ui/skeleton.tsx";
import { useLocations } from "~/client/contexts/locations.tsx";
import { Separator } from "~/client/components/ui/separator.tsx";
import { mapStore, setMapStore } from "~/client/stores/map.ts";
import { MAIN_PAGES } from "~/client/lib/constants.ts";
import {
  getLocationHref,
  hasSlugAndId,
  hasSlugAndNotId,
} from "~/client/lib/utils.ts";

export function NavLocations() {
  const location = useLocation();
  const params = useParams();

  const locations = useLocations();

  const navItems = () => {
    if (MAIN_PAGES.has(location.pathname)) return locations();
    if (hasSlugAndNotId(params.slug, params.id)) {
      const logs = () =>
        locations().find((loc) => loc.slug === params.slug)?.logs;
      return logs() ?? [];
    }
    if (hasSlugAndId(params.slug, params.id)) {
      const logs = () =>
        locations().find((loc) => loc.slug === params.slug)?.logs;

      const log = () => {
        const currentLogs = logs();
        if (!currentLogs || currentLogs.length < 1) return;
        return currentLogs.filter((log) => log._id === params.id);
      };
      return log() ?? [];
    }
    return [];
  };

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
      <Separator />
      <SidebarGroup>
        <SidebarMenu>
          <Index each={navItems()}>
            {(location) => (
              <Collapsible>
                <A href={getLocationHref(location(), params.slug)}>
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
                      <span class="truncate">{location().name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </A>
              </Collapsible>
            )}
          </Index>
        </SidebarMenu>
      </SidebarGroup>
    </Suspense>
  );
}
