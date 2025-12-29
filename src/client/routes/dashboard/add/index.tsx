import { useAppForm } from "~/client/hooks/use-app-form.tsx";
import { Button } from "~/client/components/ui/button.tsx";
import CirclePlus from "lucide-solid/icons/circle-plus";
import ArrowLeft from "lucide-solid/icons/arrow-left";
import { InsertLocationSchema } from "~/shared/schema/location.ts";
import { InsertLocation } from "~/shared/types.ts";
import { toast } from "solid-sonner";
import {
  BeforeLeaveEventArgs,
  useAction,
  useBeforeLeave,
  useNavigate,
} from "@solidjs/router";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "~/client/components/ui/alert-dialog.tsx";
import {
  createEffect,
  createReaction,
  createSignal,
  onMount,
  Show,
} from "solid-js";
import { addLocationAction } from "~/client/lib/actions/locations.ts";
import { mapStore, setMapStore } from "~/client/stores/map.ts";
import { CENTER_OF_FINLAND } from "~/client/lib/constants.ts";
import MapPin from "lucide-solid/icons/map-pin";

function AddLocationPage() {
  const [isAlertDialogOpen, setIsAlertDialogOpen] = createSignal(false);
  const [navigation, setNavigation] = createSignal<(() => void) | null>(null);

  const addLocation = useAction(addLocationAction);

  const form = useAppForm(() => ({
    defaultValues: {
      name: "",
      description: "",
      lat: (CENTER_OF_FINLAND as [number, number])[1],
      long: (CENTER_OF_FINLAND as [number, number])[0],
    } as InsertLocation,
    validators: {
      onBlur: InsertLocationSchema,
    },
    onSubmitInvalid: () => {
      toast.error("Check the input values");
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        const result = await addLocation(value);

        if ("errors" in result && result.errors) {
          for (const error of result.errors) {
            const [fieldName, message] = Object.entries(error)[0];
            formApi.setFieldMeta(fieldName as keyof InsertLocation, (prev) => ({
              ...prev,
              isTouched: true,
              errorMap: {
                ...prev.errorMap,
                onSubmit: { message },
              },
            }));
          }
        } else {
          formApi.reset();
          navigate("/dashboard");
          toast.success("Location was added");
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unknown error");
      }
    },
  }));

  useBeforeLeave((e: BeforeLeaveEventArgs) => {
    if (form.state.isDirty && !e.defaultPrevented) {
      e.preventDefault();
      setNavigation(() => () => e.retry(true));
      setIsAlertDialogOpen(true);
    }
    if (!form.state.isDirty) setMapStore("addedLocation", null);
  });

  const navigate = useNavigate();

  onMount(() => {
    setMapStore("addedLocation", {
      _id: "123",
      name: "AddedPoint",
      description: "",
      lat: (CENTER_OF_FINLAND as [number, number])[1],
      long: (CENTER_OF_FINLAND as [number, number])[0],
    });
  });

  createEffect(() => {
    if (mapStore.addedLocation) {
      if (form.getFieldValue("lat") !== mapStore.addedLocation.lat) {
        form.setFieldValue("lat", mapStore.addedLocation.lat);
      }
      if (form.getFieldValue("long") !== mapStore.addedLocation.long) {
        form.setFieldValue("long", mapStore.addedLocation.long);
      }
    }
  });

  let hasFlown: boolean = false;

  createEffect(() => {
    if (mapStore.addedLocation && mapStore.map && !hasFlown) {
      mapStore.map.flyTo({
        center: [mapStore.addedLocation.long, mapStore.addedLocation.lat],
        speed: 0.8,
        zoom: 6,
      });

      hasFlown = true;
    }
  });
  return (
    <div class="container mx-auto max-w-md">
      <Show when={isAlertDialogOpen()}>
        <AlertDialog
          open={isAlertDialogOpen()}
          onOpenChange={setIsAlertDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogTitle>Are you sure you want to leave?</AlertDialogTitle>
            <AlertDialogDescription>
              All unsaved changes will be lost.
            </AlertDialogDescription>
            <div class="flex flex-col gap-2">
              <Button
                type="button"
                onClick={() => {
                  const retry = navigation();
                  if (retry) {
                    setMapStore("addedLocation", null);
                    retry();
                  }
                }}
              >
                Confirm
              </Button>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </Show>
      <div class="my-4">
        <h1 class="text-lg">Add Location</h1>
        <p class="text-sm">
          A location is a place you have traveled or will travel to. It can be a
          city, country, state or point of interest. You can add specific times
          you visited this location after adding it.
        </p>
      </div>
      <form
        class="mt-4 flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <fieldset class="flex flex-col gap-4">
          <form.AppField name="name">
            {(field) => <field.TextField label="Name" />}
          </form.AppField>
          <form.AppField name="description">
            {(field) => <field.TextArea label="Description" />}
          </form.AppField>
        </fieldset>
        <p class="text-sm inline-flex">
          Drag the{" "}
          <MapPin class="fill-success-foreground text-accent transition-colors" />
          {" "}
          marker to your desired location
        </p>
        <p class="text-sm inline-flex">
          Or double click on the map.
        </p>
        <p class="text-xs text-muted-foreground inline-flex">
          Current location:{" "}
          {mapStore.addedLocation?.lat.toFixed(5) ?? form.getFieldValue("lat")},
          {" "}
          {mapStore.addedLocation?.long.toFixed(5) ??
            form.getFieldValue("long")}
        </p>
        <div class="flex justify-end gap-2">
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button
                type="button"
                variant="outline"
                onclick={() => navigate(-1)}
                disabled={isSubmitting()}
              >
                <ArrowLeft size={24} />
                Cancel
              </Button>
            )}
          </form.Subscribe>
          <form.AppForm>
            <form.SubmitButton icon={CirclePlus} label="Add" />
          </form.AppForm>
        </div>
      </form>
    </div>
  );
}

export default AddLocationPage;
