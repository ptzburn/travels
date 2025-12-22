import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "~/client/components/ui/sidebar.tsx";
import { NavUser } from "./nav-user.tsx";
import { NavMain } from "./nav-main.tsx";
import Map from "lucide-solid/icons/map";
import CirclePlus from "lucide-solid/icons/circle-plus";
import { ThemeToggle } from "~/client/components/theme-toggle.tsx";
import { Separator } from "~/client/components/ui/separator.tsx";

const navMain = [
  {
    title: "Locations",
    url: "/dashboard/locations",
    icon: Map,
    isActive: true,
  },
  {
    title: "Add Location",
    url: "/dashboard/add",
    icon: CirclePlus,
    isActive: false,
  },
];

function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader class="my-2">
        <NavUser />
        <Separator />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <Separator />
      <SidebarFooter class="my-2">
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
