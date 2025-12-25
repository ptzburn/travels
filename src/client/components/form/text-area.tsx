import { useFieldContext } from "~/client/hooks/use-app-form.tsx";
import {
  TextField as Textfield,
  TextFieldDescription,
  TextFieldErrorMessage,
  TextFieldLabel,
  TextFieldTextArea,
} from "../ui/text-field.tsx";
import { Show } from "solid-js";

type TextFieldProps = {
  label?: string;
  description?: string;
  placeholder?: string;
};

export function TextArea(props: TextFieldProps) {
  const field = useFieldContext<string>();
  const isInvalid = () =>
    field().state.meta.isTouched && !field().state.meta.isValid;

  return (
    <Textfield
      data-invalid={isInvalid()}
      validationState={isInvalid() ? "invalid" : "valid"}
    >
      <Show when={props.label}>
        {(label) => (
          <TextFieldLabel for={field().name}>{label()}</TextFieldLabel>
        )}
      </Show>
      <TextFieldTextArea
        id={field().name}
        name={field().name}
        value={field().state.value}
        onBlur={field().handleBlur}
        onChange={(e) => field().handleChange(e.target.value)}
        aria-invalid={isInvalid()}
        placeholder={props.placeholder ?? ""}
        disabled={field().form.state.isSubmitting}
      />
      <Show when={props.description}>
        {(description) => (
          <TextFieldDescription>
            {description()}
          </TextFieldDescription>
        )}
      </Show>
      <Show when={isInvalid()}>
        {field().state.meta.errors.length > 0
          ? (field().state.meta.errors.map(
            (error) =>
              error?.message && (
                <TextFieldErrorMessage>{error.message}</TextFieldErrorMessage>
              ),
          ))
          : null}
      </Show>
    </Textfield>
  );
}
