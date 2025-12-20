import { Button } from "./ui/button.tsx";
import { authClient } from "../lib/auth-client.ts";
import { createSignal } from "solid-js";
import { Show } from "solid-js";
import { Spinner } from "./ui/spinner.tsx";
import { useSession } from "../contexts/session-context.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/client/components/ui/dropdown-menu.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar.tsx";
import { getInitials } from "../lib/utils.ts";
import { A } from "@solidjs/router";
import LogOut from "lucide-solid/icons/log-out";

const [isLoading, setIsLoading] = createSignal(false);

export function AuthButton() {
  const { user } = useSession();

  const signInWithGoogle = async () => {
    setIsLoading(true);
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
      errorCallbackURL: "/auth/error",
      fetchOptions: {
        onError: (error) => {
          console.error(error.error.message);
        },
      },
    });
    setIsLoading(false);
  };
  return (
    <Show
      when={user()}
      fallback={
        <Button onclick={signInWithGoogle} disabled={isLoading()}>
          Sign in with Google
          <Show when={!isLoading()} fallback={<Spinner />}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="size-4"
            >
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
          </Show>
        </Button>
      }
    >
      {(user) => (
        <DropdownMenu>
          <DropdownMenuTrigger class="hover:cursor-pointer">
            <Avatar>
              <AvatarImage
                src={user().image ?? ""}
                alt={user().name}
              />
              <AvatarFallback>
                {getInitials(user().name)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <A href="/sign-out">
              <DropdownMenuItem class="hover:cursor-pointer">
                <LogOut size={24} />
                Sign out
              </DropdownMenuItem>
            </A>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </Show>
  );
}
