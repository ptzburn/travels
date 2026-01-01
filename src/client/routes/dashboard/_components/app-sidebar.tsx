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
import MapPinPen from "lucide-solid/icons/map-pin-pen";
import { Separator } from "~/client/components/ui/separator.tsx";
import { NavLocations } from "./nav-locations.tsx";
import { useLocation } from "@solidjs/router";
import { mapStore } from "~/client/stores/map.ts";

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

function AppSidebar() {
  const location = useLocation();

  const getLocationName = () => {
    if (mapStore.locations && mapStore.locations.length === 1) {
      return mapStore.locations[0].name;
    } else {
      return "";
    }
  };

  const navLogs = () => [
    {
      title: "Back to Locations",
      url: "/dashboard",
      icon: ArrowLeft,
    },
    {
      title: getLocationName(),
      url: location.pathname,
      icon: Map,
    },
    {
      title: "Edit Location",
      url: `${location.pathname}/edit`,
      icon: MapPinPen,
    },
    {
      title: "Add Location Log",
      url: `${location.pathname}/add`,
      icon: CirclePlus,
    },
  ];

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader class="my-2">
        <NavUser />
        <Separator />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={location.pathname.includes("location") ? navLogs() : navMain}
        />
        <NavLocations />
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
