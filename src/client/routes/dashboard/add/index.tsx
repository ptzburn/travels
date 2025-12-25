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
import { createSignal } from "solid-js";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "~/client/components/ui/alert-dialog.tsx";
import { Show } from "solid-js";
import { addLocationAction } from "~/client/lib/actions/locations.ts";
import { error } from "node:console";

function AddLocationPage() {
  const [isAlertDialogOpen, setIsAlertDialogOpen] = createSignal(false);
  const [navigation, setNavigation] = createSignal<(() => void) | null>(null);

  const addLocation = useAction(addLocationAction);

  const form = useAppForm(() => ({
    defaultValues: {
      name: "",
      description: "",
      lat: 0,
      long: 0,
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
  });

  const navigate = useNavigate();

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
          <form.AppField name="lat">
            {(field) => (
              <field.TextField
                type="number"
                max={90}
                min={-90}
                label="Latitude"
              />
            )}
          </form.AppField>
          <form.AppField name="long">
            {(field) => (
              <field.TextField
                type="number"
                max={90}
                min={-90}
                label="Longitude"
              />
            )}
          </form.AppField>
        </fieldset>
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
