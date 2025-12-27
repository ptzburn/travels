import { Card, CardContent } from "../components/ui/card.tsx";
import { AuthButton } from "../components/auth-button.tsx";
import { Show } from "solid-js";
import { useSession } from "../contexts/session-context.tsx";
import { A } from "@solidjs/router";
import { Button } from "../components/ui/button.tsx";

export default function Home() {
  const session = useSession();
  return (
    <Card class="container mx-auto mt-4">
      <CardContent class="flex min-h-96 items-center justify-center text-center">
        <div class="max-w-md">
          <h1 class="font-bold text-5xl">
            Travel Log
          </h1>
          <p class="py-6">
            Keep track of your travels and adventures with this simple travel
            log app. Add locations, photos, and notes to create a digital
            journal of your journeys.
          </p>
          <Show
            when={!session()?.session}
            fallback={
              <A href="/dashboard">
                <Button variant="default">
                  Start Logging
                </Button>
              </A>
            }
          >
            <AuthButton />
          </Show>
        </div>
      </CardContent>
    </Card>
  );
}
