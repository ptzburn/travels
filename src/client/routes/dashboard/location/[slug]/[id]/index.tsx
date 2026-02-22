import { createSignal, Show, Suspense } from "solid-js";
import { Spinner } from "~/client/components/ui/spinner.tsx";
import {
  A,
  useAction,
  useNavigate,
  useParams,
  useSubmission,
} from "@solidjs/router";
import { useLocations } from "~/client/contexts/locations.tsx";
import { formatDate } from "~/client/lib/utils.ts";
import { SelectLocationLog } from "~/shared/types.ts";
import { toast } from "solid-sonner";
import { deleteLocationLogAction } from "~/client/lib/actions/logs.ts";
import { DeletionDialog } from "~/client/components/deletion-dialog.tsx";
import Trash2 from "lucide-solid/icons/trash-2";
import EllipsisVertical from "lucide-solid/icons/ellipsis-vertical";
import SquarePen from "lucide-solid/icons/square-pen";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/client/components/ui/dropdown-menu.tsx";

import { ImageCarousel } from "~/client/components/image-carousel.tsx";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/client/components/ui/empty.tsx";
import Image from "lucide-solid/icons/image";
import { Button } from "~/client/components/ui/button.tsx";
import CirclePlus from "lucide-solid/icons/circle-plus";

function LocationLogPage() {
  const params = useParams<{ slug: string; id: string }>();
  const [isDialogOpen, setIsDialogOpen] = createSignal(false);
  const navigate = useNavigate();
  const deleteLocationLog = useAction(deleteLocationLogAction);
  const deleteLocationLogSubmission = useSubmission(deleteLocationLogAction);

  const handleDelete = async () => {
    try {
      await deleteLocationLog(params.slug, params.id);
      navigate(`/dashboard/location/${params.slug}`);
    } catch (error) {
      setIsDialogOpen(false);
      const errorMessage = Error.isError(error)
        ? error.message
        : "Unknown error";
      toast.error(errorMessage);
    }
  };

  const locations = useLocations();

  const location = () => locations().find((loc) => loc.slug === params.slug);
  const logs = () => location()?.locationLogs;

  const log = () => {
    const currentLogs = logs();
    if (!currentLogs || currentLogs.length < 1) return;
    return currentLogs.find((log) => log.id === Number(params.id));
  };

  const displayDateElement = (log: SelectLocationLog) => {
    if (log.startedAt === log.endedAt) {
      return <>{formatDate(log.startedAt).toLocaleDateString("de")}</>;
    }

    return (
      <>
        {formatDate(log.startedAt).toLocaleDateString("de")} -
        {formatDate(log.endedAt).toLocaleDateString("de")}
      </>
    );
  };

  return (
    <Suspense fallback={<Spinner />}>
      <Show when={log()}>
        {(log) => (
          <>
            <p class="text-muted-foreground text-sm italic">
              {displayDateElement(log())}
            </p>
            <h2 class="text-xl">
              {log().name}
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
                    <A
                      href={`/dashboard/location/${params.slug}/${params.id}/edit`}
                    >
                      <DropdownMenuItem>
                        <SquarePen size={16} />
                        Edit
                      </DropdownMenuItem>
                    </A>
                  </DropdownMenuContent>
                </DropdownMenu>
              }
            </h2>
            <p class="text-sm">{log().description}</p>
            <div class="flex min-h-64 items-center justify-center p-4">
              <Show
                when={log().images.length > 0}
                fallback={
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <Image />
                      </EmptyMedia>
                      <EmptyTitle>
                        Add images to get started
                      </EmptyTitle>
                      <EmptyDescription>
                        The images you add will be displayed here.
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <div class="flex flex-col justify-center gap-4 sm:flex-row sm:gap-6">
                        <Button
                          as={A}
                          href={`/dashboard/location/${params.slug}/${params.id}/images`}
                        >
                          Add Image
                          <CirclePlus size={24} />
                        </Button>
                      </div>
                    </EmptyContent>
                  </Empty>
                }
              >
                <ImageCarousel images={log().images} />
              </Show>
            </div>
          </>
        )}
      </Show>
      <DeletionDialog
        isOpen={isDialogOpen}
        description="This action cannot be undone. This will permanently delete the location log and remove its data from our servers."
        setIsOpen={setIsDialogOpen}
        isPending={deleteLocationLogSubmission.pending}
        icon={Trash2}
        onDelete={() => handleDelete()}
      />
    </Suspense>
  );
}

export default LocationLogPage;
