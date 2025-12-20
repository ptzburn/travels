import { createAsync, RouteSectionProps } from "@solidjs/router";
import { Suspense } from "solid-js";
import { NavBar } from "../components/nav-bar.tsx";
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
            <div class="flex min-h-screen flex-col">
              <NavBar />
              <Separator />
              <main>
                {props.children}
              </main>
              <Toaster />
            </div>
          </SessionProvider>
        </Suspense>
      </ColorModeProvider>
    </MetaProvider>
  );
}

export default DefaultLayout;
