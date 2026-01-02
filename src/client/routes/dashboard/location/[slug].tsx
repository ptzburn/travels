import { RouteSectionProps } from "@solidjs/router";
import { ErrorBoundary, Suspense } from "solid-js";
import { Spinner } from "~/client/components/ui/spinner.tsx";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "~/client/components/ui/alert.tsx";
import AlertCircleIcon from "lucide-solid/icons/alert-circle";

function LocationPage(props: RouteSectionProps) {
  return (
    <div class="min-h-64 p-4">
      <ErrorBoundary
        fallback={(error) => {
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
          {props.children}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default LocationPage;
