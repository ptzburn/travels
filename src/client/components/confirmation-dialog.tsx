import { Accessor, Setter, Show } from "solid-js";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "~/client/components/ui/alert-dialog.tsx";
import { Button } from "~/client/components/ui/button.tsx";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "~/client/components/ui/drawer.tsx";
import { useMediaQuery } from "~/client/hooks/use-media-query.ts";

type ConfirmationDialogProps = {
  open: Accessor<boolean>;
  onOpenChange: Setter<boolean>;
  onConfirm: () => void;
  onCancel?: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
};

export function ConfirmationDialog(props: ConfirmationDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleCancel = () => {
    props.onCancel?.();
    props.onOpenChange(false);
  };

  const handleConfirm = () => {
    props.onConfirm();
    props.onOpenChange(false);
  };

  const defaultTitle = "Cancel changes?";
  const defaultDescription =
    "You have unsaved changes. Are you sure you want to cancel them?";
  const defaultConfirmText = "Confirm";
  const defaultCancelText = "Continue editing";

  return (
    <Show
      when={isDesktop()}
      fallback={
        <Drawer
          open={props.open()}
          onOpenChange={props.onOpenChange}
        >
          <DrawerContent>
            <DrawerHeader class="text-left">
              <DrawerTitle>
                {props.title ?? defaultTitle}
              </DrawerTitle>
              <DrawerDescription>
                {props.description ?? defaultDescription}
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter class="pt-2">
              <Button onClick={handleConfirm}>
                {props.confirmText ?? defaultConfirmText}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                {props.cancelText ?? defaultCancelText}
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      }
    >
      <AlertDialog open={props.open()} onOpenChange={props.onOpenChange}>
        <AlertDialogContent>
          <div class="flex flex-col gap-2 text-center sm:text-left">
            <AlertDialogTitle>
              {props.title ?? defaultTitle}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {props.description ?? defaultDescription}
            </AlertDialogDescription>
          </div>
          <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-x-2">
            <Button
              variant="outline"
              class="mt-2 sm:mt-0"
              onClick={handleCancel}
            >
              {props.cancelText ?? defaultCancelText}
            </Button>
            <Button onClick={handleConfirm}>
              {props.confirmText ?? defaultConfirmText}
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </Show>
  );
}
