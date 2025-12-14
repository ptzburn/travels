import { Card, CardContent } from "../components/ui/card.tsx";
import { AuthButton } from "../components/auth-button.tsx";

export default function Home() {
  return (
    <Card class="container mx-auto mt-4 bg-muted">
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
          <AuthButton />
        </div>
      </CardContent>
    </Card>
  );
}
