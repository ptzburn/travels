import {
  createAsync,
  RouteSectionProps,
  useLocation,
  useParams,
} from "@solidjs/router";
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
import { Show } from "solid-js";
import { LocationsProvider } from "../contexts/locations.tsx";
import { Spinner } from "../components/ui/spinner.tsx";
import Sun from "lucide-solid/icons/sun";

const MapComponent = clientOnly(() =>
  import("../routes/dashboard/_components/map.tsx")
);

const AppSidebar = clientOnly(() =>
  import("../routes/dashboard/_components/app-sidebar.tsx")
);

const ThemeToggle = clientOnly(() => import("../components/theme-toggle.tsx"));

function getServerCookies() {
  "use server";
  const colorMode = getCookie("kb-color-mode");
  return colorMode ? `kb-color-mode=${colorMode}` : "";
}

function DefaultLayout(props: RouteSectionProps) {
  const storageManager = cookieStorageManagerSSR(
    isServer ? getServerCookies() : document.cookie,
  );

  const params = useParams<{ slug: string }>();

  const EDIT_PAGES = (slug: string) =>
    new Set([
      "/dashboard/add",
      `/dashboard/location/${slug}/edit`,
      `/dashboard/location/${slug}/add`,
    ]);

  const location = useLocation();

  const session = createAsync(() => userSessionQuery());

  return (
    <MetaProvider>
      <ColorModeScript storageType={storageManager.type} />
      <ColorModeProvider storageManager={storageManager}>
        <div class="flex h-screen">
          <Suspense fallback={<Spinner />}>
            <SessionProvider
              session={session}
            >
              <LocationsProvider>
                <SidebarProvider>
                  <Show when={session()?.user}>
                    <AppSidebar />
                  </Show>
                  <SidebarInset class="flex flex-1 flex-col overflow-hidden">
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
                      <ThemeToggle fallback={<Sun size={16} />} />
                    </header>
                    <main
                      class={`flex flex-1 ${
                        EDIT_PAGES(params.slug).has(
                            location.pathname,
                          )
                          ? "flex-row"
                          : "flex-col"
                      } gap-4 overflow-auto p-4 pt-0`}
                    >
                      <div class="shrink-0">
                        {props.children}
                      </div>
                      <Show when={session() && location.pathname !== "/"}>
                        <div class="relative min-h-0 flex-1 overflow-hidden rounded-xl">
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
        </div>
      </ColorModeProvider>
    </MetaProvider>
  );
}

export default DefaultLayout;
