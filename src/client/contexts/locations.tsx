import {
  createContext,
  ErrorBoundary,
  Match,
  ParentProps,
  Show,
  Switch,
  useContext,
} from "solid-js";

import {
  userLocationQuery,
  userLocationsQuery,
} from "../lib/queries/locations.ts";
import { useSession } from "./session-context.tsx";
import {
  A,
  AccessorWithLatest,
  createAsync,
  useLocation,
  useParams,
} from "@solidjs/router";
import type { SelectLocation } from "~/shared/types.ts";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "../components/ui/empty.tsx";
import { Button } from "../components/ui/button.tsx";

import Home from "lucide-solid/icons/home";
import { NOT_FOUND } from "../../shared/http-status.ts";

const LocationsContext = createContext<
  AccessorWithLatest<SelectLocation[]>
>();

export function LocationsProvider(props: ParentProps) {
  const session = useSession();
  const location = useLocation();

  return (
    <Switch>
      <Match when={!session()}>
        <LocationsContext.Provider value={undefined}>
          {props.children}
        </LocationsContext.Provider>
      </Match>
      <Match
        when={session() && location.pathname.startsWith("/dashboard/location")}
      >
        <LocationProviderWithSession>
          {props.children}
        </LocationProviderWithSession>
      </Match>
      <Match
        when={session() && !location.pathname.startsWith("/dashboard/location")}
      >
        <LocationsProviderWithSession>
          {props.children}
        </LocationsProviderWithSession>
      </Match>
    </Switch>
  );
}

function LocationsProviderWithSession(props: ParentProps) {
  const locations = createAsync(() => userLocationsQuery(), {
    initialValue: [],
  });

  return (
    <LocationsContext.Provider value={locations}>
      {props.children}
    </LocationsContext.Provider>
  );
}

function LocationProviderWithSession(props: ParentProps) {
  const params = useParams<{ slug: string }>();
  const location = createAsync(() => userLocationQuery(params.slug), {
    initialValue: [],
  });

  return (
    <LocationsContext.Provider value={location}>
      <ErrorBoundary
        fallback={(error) => {
          const errorCode = Error.isError(error)
            ? (error.cause ? error.cause as number : "500")
            : "500";
          const errorMessage = Error.isError(error)
            ? error.message
            : "Server Error";
          return (
            <Empty class="h-dvh h-full bg-gradient-to-b from-30% from-muted/50 to-background">
              <EmptyHeader>
                <EmptyTitle>{errorCode} - {errorMessage}</EmptyTitle>
                <Show when={errorCode === NOT_FOUND.CODE}>
                  <EmptyDescription>
                    The location you&apos;re looking for doesn&apos;t exist. Try
                    selecting one from the dashboard.
                  </EmptyDescription>
                </Show>
              </EmptyHeader>
              <EmptyContent>
                <A href="/dashboard">
                  <Button variant="outline" size="sm">
                    <Home />
                    Dashboard
                  </Button>
                </A>
              </EmptyContent>
            </Empty>
          );
        }}
      >
        {props.children}
      </ErrorBoundary>
    </LocationsContext.Provider>
  );
}

export function useLocations() {
  const context = useContext(LocationsContext);

  if (!context) {
    throw new Error("useLocations must be used within LocationsProvider");
  }

  return context;
}
