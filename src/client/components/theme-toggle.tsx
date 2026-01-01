import { useColorMode } from "@kobalte/core";
import Sun from "lucide-solid/icons/sun";
import Moon from "lucide-solid/icons/moon";
import { Show } from "solid-js";
import { Toggle } from "./ui/toggle.tsx";

function ThemeToggle() {
  const { colorMode, setColorMode } = useColorMode();

  return (
    <div class="flex items-center justify-center">
      <Toggle
        class="hover:cursor-pointer"
        onChange={() =>
          setColorMode(colorMode() === "light" ? "dark" : "light")}
      >
        <Show when={colorMode() === "light"} fallback={<Sun size={16} />}>
          <Moon size={16} />
        </Show>
      </Toggle>
    </div>
  );
}

export default ThemeToggle;
