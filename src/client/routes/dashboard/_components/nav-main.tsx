import type { LucideIcon } from "lucide-solid";
import { For } from "solid-js";
import { A, useLocation } from "@solidjs/router";

import { Collapsible } from "~/client/components/ui/collapsible.tsx";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/client/components/ui/sidebar.tsx";
import { useSession } from "~/client/contexts/session-context.tsx";
import { Show } from "solid-js";

type NavMainProps = {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
  }[];
};

export function NavMain(props: NavMainProps) {
  const { user } = useSession();
  const location = useLocation();
  return (
    <Show when={user()} fallback={null}>
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
        </SidebarMenu>
      </SidebarGroup>
    </Show>
  );
}
