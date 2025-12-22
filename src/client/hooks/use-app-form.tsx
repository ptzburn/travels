import { createFormHook, createFormHookContexts } from "@tanstack/solid-form";
import { TextField } from "../components/form/text-field.tsx";
import { TextArea } from "../components/form/text-area.tsx";
import { SubmitButton } from "../components/form/submit-button.tsx";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    TextArea,
  },
  formComponents: { SubmitButton },
});
