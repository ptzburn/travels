import { Show, Suspense } from "solid-js";
import { Spinner } from "~/client/components/ui/spinner.tsx";
import { useLocation, useParams } from "@solidjs/router";
import { useLocations } from "~/client/contexts/locations.tsx";
import { formatDate } from "~/client/lib/utils.ts";
import { SelectLocationLog } from "~/shared/types.ts";

function LocationLogPage() {
  const params = useParams<{ slug: string; id: string }>();
  const routerLocation = useLocation();

  const locations = useLocations();

  const location = () => locations().find((loc) => loc.slug === params.slug);
  const logs = () => location()?.logs;

  const log = () => {
    const currentLogs = logs();
    if (!currentLogs || currentLogs.length < 1) return;
    return currentLogs.find((log) => log._id === params.id);
  };

  const displayDateElement = (log: SelectLocationLog) => {
    if (log.startedAt === log.endedAt) {
      return <>{formatDate(log.startedAt).toLocaleDateString("de")}</>;
    }

    return (
      <>
        {formatDate(log.startedAt).toLocaleDateString("de")} -
        {formatDate(log.endedAt).toLocaleDateString("de")}
      </>
    );
  };

  const hasSlugAndId = (
    pathname: string,
    slug: string | undefined,
    id: string | undefined,
  ) => {
    if (!slug || !id) return false;
    return pathname.includes(slug) &&
      pathname.includes(id);
  };

  console.log(hasSlugAndId(routerLocation.pathname, params.slug, params.id));

  return (
    <Suspense fallback={<Spinner />}>
      <Show when={log()}>
        {(log) => (
          <>
            <p class="text-sm italic text-muted-foreground">
              {displayDateElement(log())}
            </p>
            <h2 class="text-xl">{log().name}</h2>
            <p class="text-sm">{log().description}</p>
          </>
        )}
      </Show>
    </Suspense>
  );
}

export default LocationLogPage;
