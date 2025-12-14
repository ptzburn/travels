import { useColorMode } from "@kobalte/core";
import { Button } from "~/client/components/ui/button.tsx";
import Sun from "lucide-solid/icons/sun";
import Moon from "lucide-solid/icons/moon";
import { Show } from "solid-js";

export function ThemeToggle() {
    const { colorMode, setColorMode } = useColorMode();

    const toggleTheme = () => {
        setColorMode(colorMode() === "dark" ? "light" : "dark");
    };

    return (
        <Button
            variant="ghost"
            onClick={toggleTheme}
        >
            <Show
                when={colorMode() === "light"}
                fallback={<Sun size={24} />}
            >
                <Moon size={24} />
            </Show>
        </Button>
    );
}
