import { connect } from "mongoose";
import env from "~/env.ts";

const mongoose = await connect(env.MONGODB_URI);

export const client = mongoose.connection.getClient();
export const db = client.db();
