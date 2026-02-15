import { createSignal, Show, Suspense } from "solid-js";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/client/components/ui/empty.tsx";
import { Button } from "~/client/components/ui/button.tsx";
import { A, useAction, useNavigate, useSubmission } from "@solidjs/router";

import ScrollText from "lucide-solid/icons/scroll-text";
import MapPinPlus from "lucide-solid/icons/map-pin-plus";
import EllipsisVertical from "lucide-solid/icons/ellipsis-vertical";
import Trash2 from "lucide-solid/icons/trash-2";
import SquarePen from "lucide-solid/icons/square-pen";

import { useLocations } from "~/client/contexts/locations.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/client/components/ui/dropdown-menu.tsx";
import { DeletionDialog } from "~/client/components/deletion-dialog.tsx";
import { deleteLocationAction } from "~/client/lib/actions/locations.ts";
import { toast } from "solid-sonner";
import { Spinner } from "~/client/components/ui/spinner.tsx";
import { LocationCarousel } from "~/client/components/location-carousel.tsx";

function LocationPage() {
  const location = useLocations();
  const navigate = useNavigate();

  const [isDialogOpen, setIsDialogOpen] = createSignal(false);

  const deleteLocation = useAction(deleteLocationAction);
  const deleteLocationSubmission = useSubmission(deleteLocationAction);

  const handleDelete = async (slug: string) => {
    try {
      await deleteLocation(slug);
      navigate("/dashboard");
    } catch (error) {
      setIsDialogOpen(false);
      const errorMessage = Error.isError(error)
        ? error.message
        : "Unknown error";
      toast.error(errorMessage);
    }
  };
  return (
    <Suspense fallback={<Spinner />}>
      <Show when={location().length === 1}>
        <div>
          <h2 class="flex flex-row gap-4 text-xl">
            {location()[0].name}
            {
              <DropdownMenu>
                <DropdownMenuTrigger class="hover:cursor-pointer">
                  <EllipsisVertical size={16} />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                    <Trash2 size={16} />
                    Delete
                  </DropdownMenuItem>
                  <A href={`/dashboard/location/${location()[0].slug}/edit`}>
                    <DropdownMenuItem>
                      <SquarePen size={16} />
                      Edit
                    </DropdownMenuItem>
                  </A>
                </DropdownMenuContent>
              </DropdownMenu>
            }
          </h2>
          <p class="text-sm">{location()[0].description}</p>
          <Show when={location()[0].locationLogs}>
            {(logs) => (
              <Show
                when={logs().length}
                fallback={
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <ScrollText />
                      </EmptyMedia>
                      <EmptyTitle>
                        No logs found
                      </EmptyTitle>
                      <EmptyDescription>
                        Add a location log to get started.
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <div class="flex flex-col justify-center gap-4 sm:flex-row sm:gap-6">
                        <Button
                          as={A}
                          href={`/dashboard/location/${location()[0].slug}/add`}
                        >
                          Add Location Log
                          <MapPinPlus size={24} />
                        </Button>
                      </div>
                    </EmptyContent>
                  </Empty>
                }
              >
                <div class="flex min-h-64 items-center justify-center p-4">
                  <LocationCarousel locations={logs()} />
                </div>
              </Show>
            )}
          </Show>
        </div>
        <DeletionDialog
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          isPending={deleteLocationSubmission.pending}
          icon={Trash2}
          onDelete={() => handleDelete(location()[0].slug)}
        />
      </Show>
    </Suspense>
  );
}

export default LocationPage;
