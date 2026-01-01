import type { LucideIcon } from "lucide-solid";
import { For, Index, Match, Show, Switch } from "solid-js";
import { A, useLocation } from "@solidjs/router";

import { Collapsible } from "~/client/components/ui/collapsible.tsx";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/client/components/ui/sidebar.tsx";
import { useSession } from "~/client/contexts/session-context.tsx";
import { Skeleton } from "~/client/components/ui/skeleton.tsx";

import MapPinPen from "lucide-solid/icons/map-pin-pen";
import Map from "lucide-solid/icons/map";
import CirclePlus from "lucide-solid/icons/circle-plus";
import { SelectLocation } from "~/shared/types.ts";
import { mapStore } from "~/client/stores/map.ts";

type NavMainProps = {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
};

export function NavMain(props: NavMainProps) {
  const session = useSession();

  const location = useLocation();

  const navItems = (currentLocation: SelectLocation) => [
    {
      title: currentLocation.name,
      url: `/dashboard/location/${currentLocation.slug}`,
      icon: Map,
    },
    {
      title: "Edit Location",
      url: `/dashboard/location/${currentLocation.slug}/edit`,
      icon: MapPinPen,
    },
    {
      title: "Add Location Log",
      url: `/dashboard/location/${currentLocation.slug}/add`,
      icon: CirclePlus,
    },
  ];

  return (
    <Show when={session()?.user} fallback={null}>
      <SidebarGroup>
        <SidebarMenu>
          <For each={props.items}>
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
          <Switch>
            <Match
              when={props.items.length === 1 &&
                location.pathname.startsWith("/dashboard/location") &&
                mapStore.locations?.length === 1 && mapStore.locations}
            >
              {(loc) => (
                <For each={navItems(loc()[0])}>
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
              )}
            </Match>
            <Match
              when={!mapStore.isError &&
                location.pathname.startsWith("/dashboard/location") &&
                (!mapStore.locations || mapStore.locations?.length > 1)}
            >
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
            </Match>
          </Switch>
        </SidebarMenu>
      </SidebarGroup>
    </Show>
  );
}
