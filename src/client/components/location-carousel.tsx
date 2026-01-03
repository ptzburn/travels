import { Index, Show } from "solid-js";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel.tsx";
import { A, useParams } from "@solidjs/router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card.tsx";
import { mapStore, setMapStore } from "../stores/map.ts";
import { SelectLocation, SelectLocationLog } from "~/shared/types.ts";
import { formatDate } from "../lib/utils.ts";

type LocationCarouselProps = {
  locations: SelectLocation[] | SelectLocationLog[];
};

export function LocationCarousel(props: LocationCarouselProps) {
  const params = useParams<{ slug: string }>();

  const isLocationLog = (loc: SelectLocation | SelectLocationLog) =>
    !("slug" in loc);

  const getLocationHref = (loc: SelectLocation | SelectLocationLog) =>
    "slug" in loc
      ? `/dashboard/location/${loc.slug}`
      : `/dashboard/location/${params.slug}/${loc._id}`;

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
    <Carousel
      opts={{
        align: "center",
      }}
      class="w-full max-w-4xl"
    >
      <CarouselContent>
        <Index each={props.locations}>
          {(location) => (
            <CarouselItem class="md:basis-1/2 lg:basis-1/3">
              <A
                href={getLocationHref(location())}
              >
                <Card
                  class={`${
                    mapStore.selectedLocation?._id === location()._id
                      ? "border-accent-foreground"
                      : ""
                  } hover:cursor-pointer`}
                  onMouseEnter={() =>
                    setMapStore("selectedLocation", location())}
                  onMouseLeave={() => setMapStore("selectedLocation", null)}
                >
                  <CardHeader class="gap-2">
                    <Show when={isLocationLog(location())}>
                      <CardDescription>
                        {displayDateElement(location() as SelectLocationLog)}
                      </CardDescription>
                    </Show>
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
  );
}
