import { z, ZodError } from "zod";
import process from "node:process";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default(
    "development",
  ),
  LOG_LEVEL: z.enum([
    "fatal",
    "error",
    "warn",
    "info",
    "debug",
    "trace",
    "silent",
  ]).default("info"),
  TURSO_DATABASE_URL: z.url(),
  TURSO_AUTH_TOKEN: z.string(),
  HOST_URL: z.url(),
  CONTACT_EMAIL: z.email(),
  BETTER_AUTH_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  S3_ENDPOINT: z.string(),
  S3_ACCESS_KEY: z.string(),
  S3_ACCESS_SECRET: z.string(),
  S3_REGION: z.string(),
  S3_BUCKET: z.string(),
});

export type env = z.infer<typeof EnvSchema>;

let env: env;

try {
  env = EnvSchema.parse(process.env);
} catch (error) {
  if (error instanceof ZodError) {
    const missingValues = Object.keys(z.flattenError(error).fieldErrors)
      .join(
        "\n",
      );
    // deno-lint-ignore no-console
    console.error("Missing required variables in .env:\n" + missingValues);
  }
  process.exit(1);
}

export default env;
