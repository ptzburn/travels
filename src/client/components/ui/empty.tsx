import { cva, type VariantProps } from "class-variance-authority";
import { type Component, type ComponentProps, splitProps } from "solid-js";

import { cn } from "~/client/lib/utils.ts";

const Empty: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <div
      data-slot="empty"
      class={cn(
        "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance md:p-12",
        local.class,
      )}
      {...others}
    />
  );
};

const EmptyHeader: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <div
      data-slot="empty-header"
      class={cn(
        "flex max-w-sm flex-col items-center gap-2 text-center",
        local.class,
      )}
      {...others}
    />
  );
};

const emptyMediaVariants = cva(
  "flex shrink-0 items-center justify-center mb-2 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon:
          "bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-6",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const EmptyMedia: Component<
  ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>
> = (props) => {
  const [local, others] = splitProps(props, ["class", "variant"]);
  return (
    <div
      data-slot="empty-icon"
      data-variant={local.variant ?? "default"}
      class={cn(
        emptyMediaVariants({
          variant: local.variant ?? "default",
          class: local.class,
        }),
      )}
      {...others}
    />
  );
};

const EmptyTitle: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="empty-title"
      class={cn("text-lg font-medium tracking-tight", local.class)}
      {...others}
    />
  );
};

const EmptyDescription: Component<ComponentProps<"p">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="empty-description"
      class={cn(
        "text-muted-foreground [&>a:hover]:text-primary text-sm/relaxed [&>a]:underline [&>a]:underline-offset-4",
        local.class,
      )}
      {...others}
    />
  );
};

const EmptyContent: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="empty-content"
      class={cn(
        "flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance",
        local.class,
      )}
      {...others}
    />
  );
};

export {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
};
