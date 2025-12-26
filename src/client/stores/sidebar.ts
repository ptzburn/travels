import { createStore } from "solid-js/store";
import { LucideIcon } from "lucide-solid/icons";

export type SidebarItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

export const [sidebarStore, setSidebarStore] = createStore<{
  sidebarItems: SidebarItem[];
  isLoading: boolean;
}>({
  sidebarItems: [],
  isLoading: false,
});
