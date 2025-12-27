import { Show } from "solid-js";
import ChevronsUpDown from "lucide-solid/icons/chevrons-up-down";
import LogOut from "lucide-solid/icons/log-out";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/client/components/ui/avatar.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/client/components/ui/dropdown-menu.tsx";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/client/components/ui/sidebar.tsx";
import { useSession } from "~/client/contexts/session-context.tsx";
import { getInitials } from "~/client/lib/utils.ts";
import { A } from "@solidjs/router";
import { Button } from "~/client/components/ui/button.tsx";
import {
  isLoading,
  signInWithGoogle,
} from "~/client/components/auth-button.tsx";
import { Spinner } from "~/client/components/ui/spinner.tsx";
import LogIn from "lucide-solid/icons/log-in";

export function NavUser() {
  const session = useSession();
  const { state } = useSidebar();

  return (
    <Show
      when={session()?.user}
      fallback={
        <Button onclick={signInWithGoogle} disabled={isLoading()}>
          <Show when={state() === "expanded"} fallback={<LogIn />}>
            Sign in with Google
            <Show when={!isLoading()} fallback={<Spinner />}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                class="size-4"
              >
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
            </Show>
          </Show>
        </Button>
      }
    >
      {(user) => (
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <SidebarMenuButton
                  size="lg"
                  class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar class="h-8 w-8 rounded-lg">
                    <AvatarImage src={user().image ?? ""} alt={user.name} />
                    <AvatarFallback class="rounded-lg">
                      {getInitials(user().name)}
                    </AvatarFallback>
                  </Avatar>
                  <div class="grid flex-1 text-left text-sm leading-tight">
                    <span class="truncate font-medium">{user().name}</span>
                    <span class="truncate text-xs">{user().email}</span>
                  </div>
                  <ChevronsUpDown class="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent class="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg">
                <DropdownMenuLabel class="p-0 font-normal">
                  <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar class="h-8 w-8 rounded-lg">
                      <AvatarImage src={user().image ?? ""} alt={user().name} />
                      <AvatarFallback class="rounded-lg">
                        {getInitials(user().name)}
                      </AvatarFallback>
                    </Avatar>
                    <div class="grid flex-1 text-left text-sm leading-tight">
                      <span class="truncate font-medium">{user().name}</span>
                      <span class="truncate text-xs">{user().email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <A href="/sign-out">
                  <DropdownMenuItem>
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </A>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      )}
    </Show>
  );
}
