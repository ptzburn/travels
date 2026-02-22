import { Index } from "solid-js";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel.tsx";
import { Card, CardContent } from "./ui/card.tsx";
import { SelectLocationLogImage } from "~/shared/types.ts";

type ImageCarouselProps = {
  images: SelectLocationLogImage[];
};

export function ImageCarousel(props: ImageCarouselProps) {
  return (
    <Carousel
      opts={{
        align: "center",
      }}
      class="w-full max-w-4xl"
    >
      <CarouselContent>
        <Index each={props.images}>
          {(image) => (
            <CarouselItem class="md:basis-1/2 lg:basis-1/3">
              <Card>
                <CardContent>
                  <img
                    src={`http://localhost:9000/images/${image().key}`}
                    alt="image"
                    class="size-full object-cover"
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          )}
        </Index>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
