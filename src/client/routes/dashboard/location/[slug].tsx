import { RouteSectionProps } from "@solidjs/router";
import { Suspense } from "solid-js";
import { Spinner } from "~/client/components/ui/spinner.tsx";

function LocationPage(props: RouteSectionProps) {
  return (
    <div class="min-h-64 p-4">
      <Suspense fallback={<Spinner />}>
        {props.children}
      </Suspense>
    </div>
  );
}

export default LocationPage;
