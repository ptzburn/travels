import { useColorMode } from "@kobalte/core";
import Sun from "lucide-solid/icons/sun";
import Moon from "lucide-solid/icons/moon";
import {
  Switch,
  SwitchControl,
  SwitchLabel,
  SwitchThumb,
} from "./ui/switch.tsx";
import { useSidebar } from "./ui/sidebar.tsx";
import { Show } from "solid-js";
import { Toggle } from "./ui/toggle.tsx";

export function ThemeToggle() {
  const { colorMode, setColorMode } = useColorMode();
  const { state } = useSidebar();

  return (
    <Show
      when={state() === "expanded"}
      fallback={
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
      }
    >
      <Switch
        class="flex items-center space-x-2"
        checked={colorMode() === "dark"}
        onChange={() =>
          setColorMode(colorMode() === "light" ? "dark" : "light")}
      >
        <Moon size={18} />
        <SwitchLabel>Dark Mode</SwitchLabel>
        <SwitchControl>
          <SwitchThumb />
        </SwitchControl>
      </Switch>
    </Show>
  );
}
