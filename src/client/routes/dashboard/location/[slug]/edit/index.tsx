import { Show } from "solid-js";
import { LocationForm } from "~/client/components/location-form.tsx";
import { mapStore } from "~/client/stores/map.ts";

function EditLocationPage() {
  return (
    <div class="container mx-auto max-w-md">
      <Show when={mapStore.locations}>
        {(locations) => (
          <Show when={locations().length === 1}>
            <LocationForm initialLocation={locations()[0]} />
          </Show>
        )}
      </Show>
    </div>
  );
}

export default EditLocationPage;
