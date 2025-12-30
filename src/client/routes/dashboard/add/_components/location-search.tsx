import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "~/client/components/ui/input-group.tsx";

import MapPin from "lucide-solid/icons/map-pin";
import MapPinPlus from "lucide-solid/icons/map-pin-plus";
import MapPinOff from "lucide-solid/icons/map-pin-off";
import Search from "lucide-solid/icons/search";
import AlertCircleIcon from "lucide-solid/icons/alert-circle";
import { useAppForm } from "~/client/hooks/use-app-form.tsx";
import { toast } from "solid-sonner";
import { SearchQuerySchema } from "~/shared/schema/search.ts";
import {
  TextField,
  TextFieldErrorMessage,
} from "~/client/components/ui/text-field.tsx";
import { createSignal, For, Show } from "solid-js";
import { Spinner } from "~/client/components/ui/spinner.tsx";
import { locationSearchQuery } from "~/client/lib/queries/locations.ts";
import { NominatimResult, SearchQuery } from "~/shared/types.ts";
import { Button } from "~/client/components/ui/button.tsx";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "~/client/components/ui/item.tsx";
import { mapStore, setMapStore } from "~/client/stores/map.ts";
import { Skeleton } from "~/client/components/ui/skeleton.tsx";
import { Alert, AlertTitle } from "~/client/components/ui/alert.tsx";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/client/components/ui/empty.tsx";

export function LocationSearch() {
  const [searchResults, setSearchResults] = createSignal<
    NominatimResult[] | null
  >(null);

  const [errorMessage, setErrorMessage] = createSignal<string>("");

  const form = useAppForm(() => ({
    defaultValues: {
      q: "",
    },
    validators: {
      onBlur: SearchQuerySchema,
    },
    onSubmitInvalid: () => {
      toast.error("Enter a search term");
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        setErrorMessage("");
        const result = await locationSearchQuery(value);

        if ("errors" in result && result.errors) {
          for (const error of result.errors) {
            const [fieldName, message] = Object.entries(error)[0];
            formApi.setFieldMeta(fieldName as keyof SearchQuery, (prev) => ({
              ...prev,
              isTouched: true,
              errorMap: {
                ...prev.errorMap,
                onSubmit: { message },
              },
            }));
          }
        } else {
          setSearchResults(result as NominatimResult[]);
        }
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Unknown error",
        );
        toast.error(error instanceof Error ? error.message : "Unknown error");
      }
    },
  }));

  function setLocation(location: NominatimResult) {
    setMapStore("addedLocation", {
      name: location.display_name,
      lat: Number(location.lat),
      long: Number(location.lon),
    });

    if (mapStore.map) {
      mapStore.map.flyTo({
        center: [
          Number(location.lon),
          Number(location.lat),
        ],
        speed: 0.8,
        zoom: 6,
      });
    }

    form.reset();
    setSearchResults(null);
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field name="q">
          {(field) => {
            const isInvalid = () =>
              field().state.meta.isTouched && !field().state.meta.isValid;
            return (
              <>
                <TextField
                  data-invalid={isInvalid()}
                  validationState={isInvalid() ? "invalid" : "valid"}
                >
                  <InputGroup>
                    <InputGroupInput
                      name={field().name}
                      placeholder="Search for a location..."
                      value={field().state.value}
                      onInput={(e) =>
                        field().handleChange(e.currentTarget.value)}
                      onBlur={field().handleBlur}
                      aria-invalid={isInvalid()}
                      disabled={field().form.state.isSubmitting}
                    />
                    <InputGroupAddon>
                      <MapPin />
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        type="submit"
                        variant="default"
                        size="xs"
                        disabled={field().form.state.isSubmitting}
                      >
                        <Show
                          when={!field().form.state.isSubmitting}
                          fallback={<Spinner />}
                        >
                          <Search />
                        </Show>
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                  <Show
                    when={isInvalid()}
                  >
                    {field().state.meta.errors.length > 0
                      ? (field().state.meta.errors.map(
                        (error) =>
                          error?.message && (
                            <TextFieldErrorMessage>
                              {error.message}
                            </TextFieldErrorMessage>
                          ),
                      ))
                      : null}
                  </Show>
                </TextField>

                <Show when={field().form.state.isSubmitting}>
                  <div class="flex flex-col gap-2 my-4 max-h-60 overflow-auto">
                    <For each={[0, 1, 2]}>
                      {() => (
                        <Item variant="outline">
                          <ItemContent>
                            <Skeleton height={20} width={120} radius={15} />
                          </ItemContent>
                          <ItemActions>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled
                            >
                              Set Location
                              <Spinner />
                            </Button>
                          </ItemActions>
                        </Item>
                      )}
                    </For>
                  </div>
                </Show>
              </>
            );
          }}
        </form.Field>
      </form>

      <Show when={searchResults()}>
        {(results) => (
          <div class="flex flex-col gap-2 my-4 max-h-72 overflow-auto">
            <For each={results()}>
              {(result) => (
                <Item variant="outline">
                  <ItemContent>
                    <ItemTitle>{result.display_name}</ItemTitle>
                  </ItemContent>
                  <ItemActions>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setLocation(result)}
                    >
                      Set Location
                      <MapPinPlus />
                    </Button>
                  </ItemActions>
                </Item>
              )}
            </For>
          </div>
        )}
      </Show>

      <Show when={errorMessage()}>
        <Alert variant="destructive" class="my-4">
          <AlertCircleIcon />
          <AlertTitle>{errorMessage()}</AlertTitle>
        </Alert>
      </Show>

      <Show when={searchResults() !== null && searchResults()?.length === 0}>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <MapPinOff />
            </EmptyMedia>
            <EmptyTitle>
              No locations found
            </EmptyTitle>
            <EmptyDescription>
              Please try with another term.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </Show>
    </>
  );
}
