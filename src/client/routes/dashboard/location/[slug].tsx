import {
  A,
  createAsync,
  RouteSectionProps,
  useLocation,
  useParams,
} from "@solidjs/router";
import {
  createEffect,
  ErrorBoundary,
  Match,
  onCleanup,
  Show,
  Suspense,
  Switch,
} from "solid-js";
import { userLocationQuery } from "~/client/lib/queries/locations.ts";
import { Spinner } from "~/client/components/ui/spinner.tsx";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "~/client/components/ui/alert.tsx";
import AlertCircleIcon from "lucide-solid/icons/alert-circle";
import MapPinPlus from "lucide-solid/icons/map-pin-plus";
import { setMapStore } from "~/client/stores/map.ts";
import { useLocations } from "~/client/contexts/locations.tsx";
import ScrollText from "lucide-solid/icons/scroll-text";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/client/components/ui/empty.tsx";
import { Button } from "~/client/components/ui/button.tsx";

function LocationPage(props: RouteSectionProps) {
  const params = useParams<{ slug: string }>();

  const locations = useLocations();
  const location = createAsync(() => userLocationQuery(params.slug));

  const routerLocation = useLocation();

  createEffect(() => {
    try {
      const loc = location();
      if (loc) {
        setMapStore("locations", [loc]);
      }
    } catch {
      return;
    }
  });

  onCleanup(() => {
    if (locations) {
      setMapStore("locations", locations());
    }
  });

  return (
    <div class="min-h-64 p-4">
      <ErrorBoundary
        fallback={(error) => (
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
        )}
      >
        <Suspense fallback={<Spinner />}>
          <Switch>
            <Match
              when={routerLocation.pathname ===
                  `/dashboard/location/${params.slug}` && location()}
            >
              {(location) => (
                <div>
                  <h2 class="text-xl">{location().name}</h2>
                  <p class="text-sm">{location().description}</p>
                  <Show when={location().logs}>
                    {(logs) => (
                      <Show
                        when={logs().length}
                        fallback={
                          <Empty>
                            <EmptyHeader>
                              <EmptyMedia variant="icon">
                                <ScrollText />
                              </EmptyMedia>
                              <EmptyTitle>
                                No logs found
                              </EmptyTitle>
                              <EmptyDescription>
                                Add a location log to get started.
                              </EmptyDescription>
                            </EmptyHeader>
                            <EmptyContent>
                              <div class="flex flex-col justify-center gap-4 sm:flex-row sm:gap-6">
                                <Button as={A} href="/dashboard/add">
                                  Add Location Log
                                  <MapPinPlus size={24} />
                                </Button>
                              </div>
                            </EmptyContent>
                          </Empty>
                        }
                      >
                        <p>{logs().length}</p>
                      </Show>
                    )}
                  </Show>
                </div>
              )}
            </Match>
            <Match
              when={routerLocation.pathname !==
                  `/dashboard/location/${params.slug}` && location()}
            >
              {props.children}
            </Match>
          </Switch>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default LocationPage;
