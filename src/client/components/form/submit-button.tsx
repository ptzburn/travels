import { useFormContext } from "~/client/hooks/use-app-form.tsx";
import type { LucideIcon } from "lucide-solid";
import { Show } from "solid-js";
import { Button } from "../ui/button.tsx";
import { Spinner } from "../ui/spinner.tsx";

type SubmitButtonProps = {
  label?: string;
  icon: LucideIcon;
};

export function SubmitButton(props: SubmitButtonProps) {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button type="submit" disabled={isSubmitting()} class="w-24">
          <Show when={!isSubmitting()} fallback={<Spinner />}>
            {props.label ?? "Submit"}
            <props.icon />
          </Show>
        </Button>
      )}
    </form.Subscribe>
  );
}
