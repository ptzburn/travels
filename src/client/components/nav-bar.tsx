import { A } from "@solidjs/router";
import { Button } from "./ui/button.tsx";
import { ThemeToggle } from "./theme-toggle.tsx";
import { AuthButton } from "./auth-button.tsx";

export function NavBar() {
    return (
        <div class="flex flex-row items-center justify-between p-3">
            <A href="/">
                <Button variant="ghost" class="font-bold text-lg">
                    Travel Log
                </Button>
            </A>
            <div class="flex items-center gap-2">
                <ThemeToggle />
                <AuthButton />
            </div>
        </div>
    );
}
