import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/solid";
import type { auth } from "~/shared/auth.ts";

export const authClient = createAuthClient({
    plugins: [
        inferAdditionalFields<typeof auth>(),
    ],
});
