import { Show, Suspense } from "solid-js";
import { LocationLogForm } from "~/client/components/location-log-form.tsx";
import { useLocations } from "~/client/contexts/locations.tsx";
import { Spinner } from "~/client/components/ui/spinner.tsx";
import { useParams } from "@solidjs/router";

function EditLogPage() {
  const locations = useLocations();
  const params = useParams();
  return (
    <div class="container mx-auto max-w-md">
      <Suspense fallback={<Spinner />}>
        <Show when={locations().length > 0 && locations} fallback={null}>
          <LocationLogForm
            location={locations()[0]}
            initialLocationLog={locations()[0].locationLogs?.find((log) =>
              log.id === Number(params.id)
            )}
          />
        </Show>
      </Suspense>
    </div>
  );
}

export default EditLogPage;
