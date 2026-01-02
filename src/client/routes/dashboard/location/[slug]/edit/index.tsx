import { Show, Suspense } from "solid-js";
import { LocationForm } from "~/client/components/location-form.tsx";
import { LocationFormSkeleton } from "~/client/components/location-form-skeleton.tsx";
import { useLocations } from "~/client/contexts/locations.tsx";

function EditLocationPage() {
  const locations = useLocations();
  return (
    <div class="container mx-auto max-w-md">
      <Suspense fallback={<LocationFormSkeleton />}>
        <Show when={locations().length === 1}>
          <LocationForm initialLocation={locations()[0]} />
        </Show>
      </Suspense>
    </div>
  );
}

export default EditLocationPage;
