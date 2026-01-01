import { Show, Suspense } from "solid-js";
import { LocationForm } from "~/client/components/location-form.tsx";
import { useOneLocation } from "~/client/contexts/location.tsx";
import { LocationFormSkeleton } from "~/client/components/location-form-skeleton.tsx";

function EditLocationPage() {
  const location = useOneLocation();

  return (
    <div class="container mx-auto max-w-md">
      <Suspense fallback={<LocationFormSkeleton />}>
        <Show when={location?.()}>
          {(location) => <LocationForm initialLocation={location()} />}
        </Show>
      </Suspense>
    </div>
  );
}

export default EditLocationPage;
