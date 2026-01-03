import { For, Index, Suspense } from "solid-js";
import { A, useLocation, useParams } from "@solidjs/router";

import { Collapsible } from "~/client/components/ui/collapsible.tsx";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/client/components/ui/sidebar.tsx";
import { Skeleton } from "~/client/components/ui/skeleton.tsx";

import MapPinPen from "lucide-solid/icons/map-pin-pen";
import Map from "lucide-solid/icons/map";
import CirclePlus from "lucide-solid/icons/circle-plus";
import ArrowLeft from "lucide-solid/icons/arrow-left";
import { hasSlugAndId, hasSlugAndNotId } from "~/client/lib/utils.ts";
import { MAIN_PAGES } from "~/client/lib/constants.ts";
import { useLocations } from "~/client/contexts/locations.tsx";

const navMain = [
  {
    title: "Locations",
    url: "/dashboard",
    icon: Map,
  },
  {
    title: "Add Location",
    url: "/dashboard/add",
    icon: CirclePlus,
  },
];

const navLogs = (slug: string) => [{
  title: "Back to Location",
  url: `/dashboard/location/${slug}`,
  icon: ArrowLeft,
}];

const navLocation = (slug: string, title: string) => [
  {
    title: "Back to Locations",
    url: "/dashboard",
    icon: ArrowLeft,
  },
  {
    title,
    url: `/dashboard/location/${slug}`,
    icon: Map,
  },
  {
    title: "Edit Location",
    url: `/dashboard/location/${slug}/edit`,
    icon: MapPinPen,
  },
  {
    title: "Add Location Log",
    url: `/dashboard/location/${slug}/add`,
    icon: CirclePlus,
  },
];

export function NavMain() {
  const location = useLocation();
  const params = useParams();

  const locations = useLocations();

  const navItems = () => {
    if (MAIN_PAGES.has(location.pathname)) return navMain;

    if (hasSlugAndNotId(params.slug, params.id)) {
      const currentLocation = () =>
        locations().find((loc) => loc.slug === params.slug);
      const title = currentLocation()?.name ?? "Location";
      return navLocation(params.slug!, title);
    }

    if (hasSlugAndId(params.slug, params.id)) return navLogs(params.slug!);

    return [];
  };

  return (
    <Suspense
      fallback={
        <SidebarGroup>
          <SidebarMenu>
            <Index each={[0, 1, 2]}>
              {() => (
                <Collapsible>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Skeleton height={20} width={20} radius={5} />
                      <Skeleton height={16} width={200} radius={10} />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </Collapsible>
              )}
            </Index>
          </SidebarMenu>
        </SidebarGroup>
      }
    >
      <SidebarGroup>
        <SidebarMenu>
          <For each={navItems()}>
            {(item) => (
              <Collapsible>
                <A href={item.url}>
                  <SidebarMenuItem
                    class={item.url === location.pathname
                      ? "bg-accent rounded"
                      : ""}
                  >
                    <SidebarMenuButton tooltip={item.title}>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </A>
              </Collapsible>
            )}
          </For>
        </SidebarMenu>
      </SidebarGroup>
    </Suspense>
  );
}
