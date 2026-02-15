import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";

import env from "../env.ts";
import db from "../api/db/index.ts";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [
    openAPI({ disableDefaultReference: true }),
  ],
  telemetry: {
    enabled: false,
  },
  advanced: {
    cookiePrefix: "travel-log",
    database: {
      generateId: false,
    },
  },
});
