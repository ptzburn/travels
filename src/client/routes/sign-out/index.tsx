import { createSignal, onMount } from "solid-js";
import { revalidate, useNavigate } from "@solidjs/router";

import { authClient } from "~/client/lib/auth-client.ts";
import { Card, CardContent } from "~/client/components/ui/card.tsx";
import { Spinner } from "~/client/components/ui/spinner.tsx";
import { userSessionQuery } from "~/client/lib/queries/auth.ts";
import { toast } from "solid-sonner";

function SignOutPage() {
  const navigate = useNavigate();
  const [_, setIsSigningOut] = createSignal(true);

  onMount(async () => {
    setIsSigningOut(true);

    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          revalidate(userSessionQuery.key);
        },
        onError: (error) => {
          toast.error(error.error.message || "Unknown error");
        },
      },
    });
    navigate("/", { replace: true });
    setIsSigningOut(false);
  });

  return (
    <Card class="container mx-auto mt-4 flex min-h-72 flex-col items-center justify-center">
      <CardContent class="flex min-w-1/2 items-center justify-center">
        <Spinner class="size-16" />
      </CardContent>
    </Card>
  );
}

export default SignOutPage;
