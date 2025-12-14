import LoaderCircle from "lucide-solid/icons/loader-circle";
import { type Component, type ComponentProps, splitProps } from "solid-js";

import { cn } from "~/client/lib/utils.ts";

const Spinner: Component<ComponentProps<"svg">> = (props) => {
    const [local, others] = splitProps(props, ["class"]);

    return (
        <LoaderCircle
            role="status"
            aria-label="Loading"
            class={cn("size-4 animate-spin", local.class)}
            {...others}
        />
    );
};

export { Spinner };
