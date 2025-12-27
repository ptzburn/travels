import { createAsync, RouteSectionProps, useLocation } from "@solidjs/router";
import { Suspense } from "solid-js";
import { Separator } from "../components/ui/separator.tsx";
import { getCookie } from "vinxi/http";
import {
  ColorModeProvider,
  ColorModeScript,
  cookieStorageManagerSSR,
} from "@kobalte/core";
import { isServer } from "solid-js/web";
import { SessionProvider } from "../contexts/session-context.tsx";
import { userSessionQuery } from "../lib/queries/auth.ts";
import { MetaProvider } from "@solidjs/meta";

import { Toaster } from "../components/ui/sonner.tsx";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../components/ui/sidebar.tsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "../components/ui/breadcrumb.tsx";
import { clientOnly } from "@solidjs/start";
import { ThemeToggle } from "../components/theme-toggle.tsx";
import { Show } from "solid-js";
import { LocationsProvider } from "../contexts/locations.tsx";

const MapComponent = clientOnly(() =>
  import("../routes/dashboard/_components/map.tsx")
);

const AppSidebar = clientOnly(() =>
  import("../routes/dashboard/_components/app-sidebar.tsx")
);

function getServerCookies() {
  "use server";
  const colorMode = getCookie("kb-color-mode");
  return colorMode ? `kb-color-mode=${colorMode}` : "";
}

function DefaultLayout(props: RouteSectionProps) {
  const storageManager = cookieStorageManagerSSR(
    isServer ? getServerCookies() : document.cookie,
  );

  const location = useLocation();

  const session = createAsync(() => userSessionQuery());

  return (
    <MetaProvider>
      <ColorModeScript storageType={storageManager.type} />
      <ColorModeProvider storageManager={storageManager}>
        <Suspense>
          <SessionProvider
            session={session}
          >
            <LocationsProvider>
              <SidebarProvider>
                <Show when={session()?.user}>
                  <AppSidebar />
                </Show>
                <SidebarInset>
                  <header class="mr-4 flex h-16 shrink-0 items-center justify-between">
                    <div class="flex items-center gap-2 px-4">
                      <Show when={session()?.user}>
                        <SidebarTrigger class="-ml-1" />
                        <Separator
                          orientation="vertical"
                          class="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <Breadcrumb>
                          <BreadcrumbList>
                            <BreadcrumbItem class="hidden md:block">
                              <BreadcrumbLink href={location.pathname}>
                                {location.pathname === "/dashboard"
                                  ? "Locations"
                                  : "Add location"}
                              </BreadcrumbLink>
                            </BreadcrumbItem>
                          </BreadcrumbList>
                        </Breadcrumb>
                      </Show>
                    </div>
                    <ThemeToggle />
                  </header>
                  <main class="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div>
                      {props.children}
                    </div>
                    <Show when={session() && location.pathname !== "/"}>
                      <div class="flex-1">
                        <MapComponent />
                      </div>
                    </Show>
                  </main>
                  <Toaster />
                </SidebarInset>
              </SidebarProvider>
            </LocationsProvider>
          </SessionProvider>
        </Suspense>
      </ColorModeProvider>
    </MetaProvider>
  );
}

export default DefaultLayout;
