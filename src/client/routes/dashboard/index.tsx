import { A } from "@solidjs/router";
import CirclePlus from "lucide-solid/icons/circle-plus";
import Map from "lucide-solid/icons/map";
import { onMount } from "solid-js";
import { For, Show } from "solid-js";
import { Button } from "~/client/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/client/components/ui/card.tsx";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/client/components/ui/empty.tsx";
import { Skeleton } from "~/client/components/ui/skeleton.tsx";
import { useLocations } from "~/client/contexts/locations.tsx";

function DashboardPage() {
  const locations = useLocations();

  onMount(() => {
    locations?.refetch();
  });

  return (
    <div class="p-4">
      <Show when={locations?.data.loading}>
        <div class="flex flex-wrap mt-4 gap-2">
          <For each={[0, 1, 2]}>
            {() => (
              <Card class="w-72 h-45">
                <CardHeader>
                  <CardTitle>
                    <Skeleton height={20} width={200} radius={20} />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Skeleton height={15} width={200} radius={20} />
                </CardContent>
              </Card>
            )}
          </For>
        </div>
      </Show>
      <Show
        when={!locations?.data.loading &&
          locations?.data.latest}
      >
        {(locations) => (
          <Show
            when={locations().length > 0}
            fallback={
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Map />
                  </EmptyMedia>
                  <EmptyTitle>
                    Add a location to get started
                  </EmptyTitle>
                  <EmptyDescription>
                    The locations you add will be displayed here.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <div class="flex flex-col gap-4 sm:flex-row sm:gap-6 justify-center">
                    <Button as={A} href="/dashboard/add">
                      Add Location
                      <CirclePlus size={24} />
                    </Button>
                  </div>
                </EmptyContent>
              </Empty>
            }
          >
            <div class="flex flex-wrap mt-4 gap-2">
              <For each={locations()}>
                {(location) => (
                  <Card class="w-72 h-45">
                    <CardHeader>
                      <CardTitle>{location.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p class="truncate">{location.description}</p>
                    </CardContent>
                  </Card>
                )}
              </For>
            </div>
          </Show>
        )}
      </Show>
    </div>
  );
}

export default DashboardPage;
