import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin, lastLoginMethod, openAPI } from "better-auth/plugins";

import { client, db } from "~/api/db/mongodb.ts";

import env from "~/env.ts";

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
  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
          const userCount = await ctx?.context.adapter.count({
            model: "users",
          });

          if (userCount === 0) {
            return { data: { ...user, role: "admin" } };
          }

          return { data: user };
        },
      },
    },
  },
  plugins: [
    openAPI({ disableDefaultReference: true }),
    admin(),
    lastLoginMethod({
      cookieName: "travel-log.last_login_method",
      storeInDatabase: true,
    }),
  ],
  telemetry: {
    enabled: false,
  },
  advanced: {
    cookiePrefix: "travel-log",
  },
});
