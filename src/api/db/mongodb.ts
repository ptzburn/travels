import { MongoClient } from "mongodb";
import env from "~/env.ts";

export const client = new MongoClient(env.MONGODB_URI);

export const db = client.db(env.DB_NAME);
