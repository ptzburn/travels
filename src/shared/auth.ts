import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { openAPI } from "better-auth/plugins";

import env from "~/env.ts";
import { client, db } from "~/api/db/mongodb.ts";

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  user: {
    modelName: "users",
  },
  session: {
    modelName: "sessions",
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  account: {
    modelName: "accounts",
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
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
  },
});
