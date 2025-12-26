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
import { sidebarStore } from "~/client/stores/sidebar.ts";
import { Show } from "solid-js";
import { Skeleton } from "~/client/components/ui/skeleton.tsx";

export function NavLocations() {
  return (
    <SidebarGroup>
      <SidebarMenu>
        <Show
          when={!sidebarStore.isLoading}
          fallback={
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
          }
        >
          <For each={sidebarStore.sidebarItems}>
            {(item) => (
              <Collapsible>
                <A href={item.url}>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip={item.title}>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </A>
              </Collapsible>
            )}
          </For>
        </Show>
      </SidebarMenu>
    </SidebarGroup>
  );
}
