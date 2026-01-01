import type { Component, ComponentProps } from "solid-js";
import { splitProps } from "solid-js";

import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

import { cn } from "~/client/lib/utils.ts";

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "text-error-foreground bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-error-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type AlertProps =
  & ComponentProps<"div">
  & VariantProps<typeof alertVariants>;

const Alert: Component<AlertProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "variant"]);
  return (
    <div
      data-slot="alert"
      role="alert"
      class={cn(alertVariants({ variant: local.variant }), local.class)}
      {...others}
    />
  );
};

const AlertTitle: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="alert-title"
      class={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        local.class,
      )}
      {...others}
    />
  );
};

const AlertDescription: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="alert-description"
      class={cn(
        "col-start-2 grid justify-items-start gap-1 text-muted-foreground text-sm [&_p]:leading-relaxed",
        local.class,
      )}
      {...others}
    />
  );
};

export { Alert, AlertDescription, AlertTitle };
