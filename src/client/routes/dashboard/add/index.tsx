import { useAppForm } from "~/client/hooks/use-app-form.tsx";
import { Button } from "~/client/components/ui/button.tsx";
import CirclePlus from "lucide-solid/icons/circle-plus";
import ArrowLeft from "lucide-solid/icons/arrow-left";
import { InsertLocationSchema } from "~/shared/schema/location.ts";
import { InsertLocation } from "~/shared/types.ts";
import { toast } from "solid-sonner";
import {
  BeforeLeaveEventArgs,
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

function AddLocationPage() {
  const [isAlertDialogOpen, setIsAlertDialogOpen] = createSignal(false);
  const [navigation, setNavigation] = createSignal<(() => void) | null>(null);

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
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(value);
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
          <Button type="button" variant="outline" onclick={() => navigate(-1)}>
            <ArrowLeft size={24} />
            Cancel
          </Button>
          <form.AppForm>
            <form.SubmitButton icon={CirclePlus} label="Add" />
          </form.AppForm>
        </div>
      </form>
    </div>
  );
}

export default AddLocationPage;
