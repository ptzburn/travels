import { Button } from "~/client/components/ui/button.tsx";
import { createFileUploader } from "@solid-primitives/upload";
import { createMemo, Show } from "solid-js";
import { useLocations } from "~/client/contexts/locations.tsx";
import { useAction, useParams, useSubmission } from "@solidjs/router";
import { uploadLocationLogImageAction } from "~/client/lib/actions/logs.ts";
import { Spinner } from "~/client/components/ui/spinner.tsx";
import { toast } from "solid-sonner";
import ImageUp from "lucide-solid/icons/image-up";
import { ImageCarousel } from "~/client/components/image-carousel.tsx";

function ImagesPage() {
  const { files, selectFiles, clearFiles } = createFileUploader();
  const locations = useLocations();
  const params = useParams<{ slug: string; id: string }>();

  const uploadLocationLogImage = useAction(uploadLocationLogImageAction);
  const uploadSubmission = useSubmission(uploadLocationLogImageAction);

  const currentLocationLog = createMemo(() => {
    return locations()?.[0]?.locationLogs?.find((log) =>
      log.id === Number(params.id)
    );
  });

  function uploadImage() {
    if (!files()[0]) return;

    const previewImage = new Image();
    previewImage.onload = async () => {
      const width = Math.min(1000, previewImage.width);
      const resized = await createImageBitmap(previewImage, {
        resizeWidth: width,
      });
      const canvas = new OffscreenCanvas(width, resized.height);
      canvas.getContext("bitmaprenderer")?.transferFromImageBitmap(resized);
      const blob = await canvas.convertToBlob({
        type: "image/webp",
        quality: 0.9,
      });

      try {
        await uploadLocationLogImage(
          params.slug,
          params.id,
          blob,
        );
        toast.success("Image uploaded successfully");
      } catch (error) {
        toast.error(Error.isError(error) ? error.message : "Unknown error");
      } finally {
        clearFiles();
      }
    };
    previewImage.src = files()[0].source;
  }

  return (
    <div class="flex flex-row gap-16">
      <div>
        <h2 class="mb-2 text-xl">
          Manage "{currentLocationLog()?.name}" Images
        </h2>
        <div class="flex w-72 flex-col gap-2">
          <div class="relative flex h-28 w-full items-center justify-center bg-muted p-1">
            <Show
              when={files()[0]?.source}
              fallback={<p class="text-center text-primary">Select an image</p>}
            >
              {(source) => (
                <img
                  src={source()}
                  alt="upload preview"
                  class="h-full object-cover"
                />
              )}
            </Show>
            <Show when={uploadSubmission.pending}>
              <div class="suze-full absolute flex items-center justify-center bg-black/50">
                <Spinner />
              </div>
            </Show>
          </div>
          <input
            type="file"
            class="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring dark:bg-input/30"
            onClick={() => selectFiles(() => {})}
          />
          <Button
            type="button"
            disabled={!files()[0] || uploadSubmission.pending}
            onClick={uploadImage}
          >
            Upload
            <ImageUp />
          </Button>
        </div>
      </div>
      <Show when={currentLocationLog()?.images}>
        {(images) => <ImageCarousel images={images()} />}
      </Show>
    </div>
  );
}

export default ImagesPage;
