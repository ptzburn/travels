import { toast } from "solid-sonner";
import { useAppForm } from "../hooks/use-app-form.tsx";
import {
  InsertLocation,
  SelectLocation,
  UpdateLocation,
} from "~/shared/types.ts";
import { CENTER_OF_FINLAND } from "../lib/constants.ts";
import {
  InsertLocationSchema,
  UpdateLocationSchema,
} from "~/shared/schema/location.ts";
import { mapStore, setMapStore } from "../stores/map.ts";

import MapPin from "lucide-solid/icons/map-pin";
import CirclePlus from "lucide-solid/icons/circle-plus";
import ArrowLeft from "lucide-solid/icons/arrow-left";
import MapPinPen from "lucide-solid/icons/map-pin-pen";

import { Button } from "./ui/button.tsx";
import { useAction, useBeforeLeave, useNavigate } from "@solidjs/router";
import {
  createEffect,
  createSignal,
  on,
  onCleanup,
  onMount,
  Show,
} from "solid-js";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "./ui/alert-dialog.tsx";
import { Separator } from "./ui/separator.tsx";
import { LocationSearch } from "../routes/dashboard/add/_components/location-search.tsx";
import {
  addLocationAction,
  updateLocationAction,
} from "../lib/actions/locations.ts";

type LocationFormProps = {
  initialLocation?: SelectLocation;
};

export function LocationForm(props: LocationFormProps) {
  const [isAlertDialogOpen, setIsAlertDialogOpen] = createSignal(false);
  const [navigation, setNavigation] = createSignal<(() => void) | null>(null);

  const navigate = useNavigate();

  const addLocation = useAction(addLocationAction);
  const updateLocation = useAction(updateLocationAction);

  const form = useAppForm(() => ({
    defaultValues: {
      name: props.initialLocation?.name ?? "",
      description: props.initialLocation?.description ?? "",
      lat: props.initialLocation?.lat ??
        (CENTER_OF_FINLAND as [number, number])[1],
      long: props.initialLocation?.long ??
        (CENTER_OF_FINLAND as [number, number])[0],
    } as InsertLocation | UpdateLocation,
    validators: {
      onBlur: props.initialLocation
        ? UpdateLocationSchema
        : InsertLocationSchema,
    },
    onSubmitInvalid: () => {
      toast.error("Check the input values");
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        const result = props.initialLocation
          ? await updateLocation(
            props.initialLocation.slug,
            value as UpdateLocation,
          )
          : await addLocation(value as InsertLocation);

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
          form.reset();
          navigate(
            props.initialLocation
              ? `/dashboard/location/${(result as SelectLocation).slug}`
              : "/dashboard",
          );
          toast.success(
            props.initialLocation
              ? "Location was updated"
              : "Location was added",
          );
        }
      } catch (error) {
        toast.error(Error.isError(error) ? error.message : "Unknown error");
      }
    },
  }));

  onMount(() => {
    setMapStore("addedLocation", {
      _id: "123",
      name: "AddedPoint",
      description: "",
      lat: props.initialLocation?.lat ??
        (CENTER_OF_FINLAND as [number, number])[1],
      long: props.initialLocation?.long ??
        (CENTER_OF_FINLAND as [number, number])[0],
    });
  });

  onCleanup(() => {
    setMapStore("addedLocation", null);
  });

  createEffect(
    on(
      () =>
        [mapStore.addedLocation?.lat, mapStore.addedLocation?.long] as const,
      ([lat, long]) => {
        if (lat !== undefined && form.getFieldValue("lat") !== lat) {
          form.setFieldValue("lat", lat);
        }
        if (long !== undefined && form.getFieldValue("long") !== long) {
          form.setFieldValue("long", long);
        }
      },
    ),
  );

  createEffect(
    on(
      () => mapStore.addedLocation?.name,
      (name) => {
        if (
          name && name !== "AddedPoint" && form.getFieldValue("name") !== name
        ) {
          form.setFieldValue("name", name);
        }
      },
    ),
  );

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

  useBeforeLeave((e) => {
    if (form.state.isDirty && !e.defaultPrevented) {
      e.preventDefault();
      setNavigation(() => () => e.retry(true));
      setIsAlertDialogOpen(true);
    }
  });

  return (
    <>
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
        <p class="inline-flex text-muted-foreground text-xs">
          Current coordinates:{" "}
          {mapStore.addedLocation?.lat.toFixed(5) ?? form.getFieldValue("lat")},
          {" "}
          {mapStore.addedLocation?.long.toFixed(5) ??
            form.getFieldValue("long")}
        </p>
        <p class="text-sm">To set the coordinates</p>
        <ul class="ml-4 list-disc text-sm">
          <li>
            <p class="inline-flex">
              Drag the{" "}
              <MapPin class="fill-success-foreground text-accent transition-colors" />
              {" "}
              marker on the map
            </p>
          </li>
          <li>
            Double click the map.
          </li>
          <li>
            Search for a location below.
          </li>
        </ul>
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
            <form.SubmitButton
              icon={props.initialLocation ? MapPinPen : CirclePlus}
              label={props.initialLocation ? "Update" : "Add"}
            />
          </form.AppForm>
        </div>
        <Separator class="my-4" />
        <LocationSearch />
      </form>
    </>
  );
}
