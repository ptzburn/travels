import { type Component, type ComponentProps, splitProps } from "solid-js";
import { cn } from "~/client/lib/utils.ts";

const Spinner: Component<ComponentProps<"svg">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      role="status"
      aria-label="Loading"
      class={cn("size-4 animate-spin", local.class)}
      {...others}
    >
      {/* This path draws the 3/4 circle typical of the Lucide loader */}
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
};

export { Spinner };
