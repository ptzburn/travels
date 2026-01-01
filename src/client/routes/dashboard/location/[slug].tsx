import { RouteSectionProps } from "@solidjs/router";
import { ErrorBoundary, onCleanup, Suspense } from "solid-js";
import { Spinner } from "~/client/components/ui/spinner.tsx";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "~/client/components/ui/alert.tsx";
import AlertCircleIcon from "lucide-solid/icons/alert-circle";
import { LocationProvider } from "~/client/contexts/location.tsx";

import { createEffect } from "solid-js";
import { mapStore, setMapStore } from "~/client/stores/map.ts";

function LocationPage(props: RouteSectionProps) {
  onCleanup(() => setMapStore("isError", false));

  createEffect(() => console.log(mapStore.isError));

  return (
    <div class="min-h-64 p-4">
      <ErrorBoundary
        fallback={(error) => {
          setMapStore("isError", true);
          return (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>
                {Error.isError(error)
                  ? (error.cause ? error.cause as number : "500")
                  : "500"}
              </AlertTitle>
              <AlertDescription>
                {Error.isError(error) ? error.message : "Server Error"}
              </AlertDescription>
            </Alert>
          );
        }}
      >
        <Suspense fallback={<Spinner />}>
          <LocationProvider>
            {props.children}
          </LocationProvider>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default LocationPage;
