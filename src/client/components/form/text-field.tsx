import { useFieldContext } from "~/client/hooks/use-app-form.tsx";
import {
  TextField as Textfield,
  TextFieldDescription,
  TextFieldErrorMessage,
  TextFieldInput,
  TextFieldLabel,
} from "../ui/text-field.tsx";
import { Show } from "solid-js";

type TextFieldProps = {
  type?: "text" | "number";
  max?: number;
  min?: number;
  label?: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
};

export function TextField(props: TextFieldProps) {
  const field = useFieldContext<string | number>();
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
      <TextFieldInput
        id={field().name}
        type={props.type ?? "text"}
        max={props.max}
        min={props.min}
        step={props.type === "number" ? "0.0000000000000000001" : undefined}
        name={field().name}
        value={field().state.value}
        onBlur={field().handleBlur}
        onChange={(e) =>
          field().handleChange(
            props.type === "number"
              ? Number(e.currentTarget.value)
              : e.currentTarget.value,
          )}
        aria-invalid={isInvalid()}
        placeholder={props.placeholder ?? ""}
        disabled={field().form.state.isSubmitting || props.disabled}
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
                <TextFieldErrorMessage>
                  {error.message}
                </TextFieldErrorMessage>
              ),
          ))
          : null}
      </Show>
    </Textfield>
  );
}
