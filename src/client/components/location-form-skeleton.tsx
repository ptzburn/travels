import { useAppForm } from "../hooks/use-app-form.tsx";
import { Button } from "./ui/button.tsx";
import { Spinner } from "./ui/spinner.tsx";

import MapPin from "lucide-solid/icons/map-pin";
import Search from "lucide-solid/icons/search";
import ArrowLeft from "lucide-solid/icons/arrow-left";
import { Separator } from "./ui/separator.tsx";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./ui/input-group.tsx";

export function LocationFormSkeleton() {
  const form = useAppForm(() => ({}));
  return (
    <form>
      <fieldset class="flex flex-col gap-4">
        <form.AppField name="name">
          {(field) => <field.TextField label="Name" disabled />}
        </form.AppField>
        <form.AppField name="description">
          {(field) => <field.TextArea label="Description" disabled />}
        </form.AppField>
      </fieldset>
      <p class="inline-flex text-muted-foreground text-xs">
        Current coordinates: {<Spinner />}
      </p>
      <p class="text-sm">To set the coordinates</p>
      <ul class="ml-4 list-disc text-sm">
        <li>
          <p class="inline-flex">
            Drag the{" "}
            <MapPin class="fill-success-foreground text-accent transition-colors" />
            {" "}
            marker on the map
          </p>
        </li>
        <li>
          Double click the map.
        </li>
        <li>
          Search for a location below.
        </li>
      </ul>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          disabled
        >
          <ArrowLeft size={24} />
          Cancel
        </Button>
        <Button
          type="button"
          disabled
        >
          Loading
          <Spinner />
        </Button>
      </div>
      <Separator class="my-4" />
      <InputGroup>
        <InputGroupInput
          placeholder="Search for a location..."
          disabled
        />
        <InputGroupAddon>
          <MapPin />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            type="submit"
            variant="default"
            size="xs"
            disabled
          >
            <Search />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
