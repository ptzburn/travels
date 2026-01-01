import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "~/client/components/ui/sidebar.tsx";
import { NavUser } from "./nav-user.tsx";
import { NavMain } from "./nav-main.tsx";
import Map from "lucide-solid/icons/map";
import CirclePlus from "lucide-solid/icons/circle-plus";
import ArrowLeft from "lucide-solid/icons/arrow-left";
import { Separator } from "~/client/components/ui/separator.tsx";
import { NavLocations } from "./nav-locations.tsx";
import { useLocation } from "@solidjs/router";

const navMain = [
  {
    title: "Locations",
    url: "/dashboard",
    icon: Map,
  },
  {
    title: "Add Location",
    url: "/dashboard/add",
    icon: CirclePlus,
  },
];

const navLogs = [{
  title: "Back to Locations",
  url: "/dashboard",
  icon: ArrowLeft,
}];

function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader class="my-2">
        <NavUser />
        <Separator />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={location.pathname.startsWith("/dashboard/location")
            ? navLogs
            : navMain}
        />
        <NavLocations />
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
