import { createAsync, RouteSectionProps } from "@solidjs/router";
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
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb.tsx";
import { clientOnly } from "@solidjs/start";

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

  const session = createAsync(() => userSessionQuery());

  return (
    <MetaProvider>
      <ColorModeScript storageType={storageManager.type} />
      <ColorModeProvider storageManager={storageManager}>
        <Suspense>
          <SessionProvider
            session={() => session()?.session}
            user={() => session()?.user}
          >
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <header class="flex h-16 shrink-0 items-center gap-2">
                  <div class="flex items-center gap-2 px-4">
                    <SidebarTrigger class="-ml-1" />
                    <Separator
                      orientation="vertical"
                      class="mr-2 data-[orientation=vertical]:h-4"
                    />
                    <Breadcrumb>
                      <BreadcrumbList>
                        <BreadcrumbItem class="hidden md:block">
                          <BreadcrumbLink href="#">
                            Building Your Application
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator class="hidden md:block" />
                        <BreadcrumbItem>
                          Data Fetching
                        </BreadcrumbItem>
                      </BreadcrumbList>
                    </Breadcrumb>
                  </div>
                </header>
                <main class="flex flex-1 flex-col gap-4 p-4 pt-0">
                  {props.children}
                </main>
                <Toaster />
              </SidebarInset>
            </SidebarProvider>
          </SessionProvider>
        </Suspense>
      </ColorModeProvider>
    </MetaProvider>
  );
}

export default DefaultLayout;
