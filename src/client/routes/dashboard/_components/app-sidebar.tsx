import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "~/client/components/ui/sidebar.tsx";
import { NavUser } from "./nav-user.tsx";
import { NavMain } from "./nav-main.tsx";
import Map from "lucide-solid/icons/map";
import CirclePlus from "lucide-solid/icons/circle-plus";
import { Separator } from "~/client/components/ui/separator.tsx";

const navMain = [
  {
    title: "Locations",
    url: "/dashboard",
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
    </Sidebar>
  );
}

export default AppSidebar;
