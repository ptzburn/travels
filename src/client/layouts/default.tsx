import { RouteSectionProps } from "@solidjs/router";
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

function getServerCookies() {
    "use server";
    const colorMode = getCookie("kb-color-mode");
    return colorMode ? `kb-color-mode=${colorMode}` : "";
}

function DefaultLayout(props: RouteSectionProps) {
    const storageManager = cookieStorageManagerSSR(
        isServer ? getServerCookies() : document.cookie,
    );
    return (
        <>
            <ColorModeScript storageType={storageManager.type} />
            <ColorModeProvider storageManager={storageManager}>
                <div class="flex min-h-screen flex-col">
                    <NavBar />
                    <Separator />
                    <main>
                        <Suspense>
                            {props.children}
                        </Suspense>
                    </main>
                </div>
            </ColorModeProvider>
        </>
    );
}

export default DefaultLayout;
