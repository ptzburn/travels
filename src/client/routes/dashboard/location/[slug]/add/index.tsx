import { Show, Suspense } from "solid-js";
import { LocationLogForm } from "~/client/components/location-log-form.tsx";
import { useLocations } from "~/client/contexts/locations.tsx";
import { Spinner } from "~/client/components/ui/spinner.tsx";

function AddLogPage() {
  const locations = useLocations();
  return (
    <div class="container mx-auto max-w-md">
      <Suspense fallback={<Spinner />}>
        <Show when={locations().length > 0 && locations} fallback={null}>
          <LocationLogForm location={locations()[0]} />
        </Show>
      </Suspense>
    </div>
  );
}

export default AddLogPage;
