import { A, revalidate } from "@solidjs/router";
import CirclePlus from "lucide-solid/icons/circle-plus";
import Map from "lucide-solid/icons/map";
import { Index, Match, onMount, Suspense, Switch } from "solid-js";
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/client/components/ui/carousel.tsx";
import { mapStore, setMapStore } from "~/client/stores/map.ts";
import { userLocationsQuery } from "~/client/lib/queries/locations.ts";

function DashboardPage() {
  const locations = useLocations();

  // The step below should be unnecesary in my opinion. However, without it the locations array might get mutated in a very strange way. A bug beyond my understanding.
  onMount(() => revalidate(userLocationsQuery.key));

  return (
    <div class="flex min-h-64 items-center justify-center p-4">
      <Suspense
        fallback={
          <div class="mt-4 flex flex-nowrap gap-4">
            <Index each={[0, 1, 2]}>
              {() => (
                <Card class="h-45 w-72">
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
            </Index>
          </div>
        }
      >
        <Switch
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
                <div class="flex flex-col justify-center gap-4 sm:flex-row sm:gap-6">
                  <Button as={A} href="/dashboard/add">
                    Add Location
                    <CirclePlus size={24} />
                  </Button>
                </div>
              </EmptyContent>
            </Empty>
          }
        >
          <Match when={locations && locations()?.length > 0 && locations()}>
            {(locs) => (
              <Carousel
                opts={{
                  align: "center",
                }}
                class="w-full max-w-4xl"
              >
                <CarouselContent>
                  <Index each={locs()}>
                    {(location) => (
                      <CarouselItem class="md:basis-1/2 lg:basis-1/3">
                        <A href={`/dashboard/location/${location().slug}`}>
                          <Card
                            class={`${
                              mapStore.selectedLocation?._id === location()._id
                                ? "border-accent-foreground"
                                : ""
                            } hover:cursor-pointer`}
                            onMouseEnter={() =>
                              setMapStore("selectedLocation", location())}
                            onMouseLeave={() =>
                              setMapStore("selectedLocation", null)}
                          >
                            <CardHeader>
                              <CardTitle>{location().name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p class="truncate">{location().description}</p>
                            </CardContent>
                          </Card>
                        </A>
                      </CarouselItem>
                    )}
                  </Index>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            )}
          </Match>
        </Switch>
      </Suspense>
    </div>
  );
}

export default DashboardPage;
