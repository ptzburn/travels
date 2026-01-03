import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "~/client/components/ui/sidebar.tsx";
import { NavUser } from "./nav-user.tsx";
import { NavMain } from "./nav-main.tsx";
import { Separator } from "~/client/components/ui/separator.tsx";
import { NavLocations } from "./nav-locations.tsx";

function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader class="my-2">
        <NavUser />
        <Separator />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavLocations />
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
