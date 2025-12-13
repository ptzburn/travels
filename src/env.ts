import { z, ZodError } from "zod";

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
    MONGODB_URI: z.string(),
    DB_NAME: z.enum(["development", "test", "production"]).default("test"),
    APP_URL: z.url(),
    BETTER_AUTH_SECRET: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
});

export type env = z.infer<typeof EnvSchema>;

let env: env;

try {
    env = EnvSchema.parse(Deno.env.toObject());
} catch (error) {
    if (error instanceof ZodError) {
        const missingValues = Object.keys(z.flattenError(error).fieldErrors)
            .join(
                "\n",
            );
        // deno-lint-ignore no-console
        console.error("Missing required variables in .env:\n" + missingValues);
    }
    Deno.exit(1);
}

export default env;
