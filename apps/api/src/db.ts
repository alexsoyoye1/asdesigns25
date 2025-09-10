import mongoose from "mongoose";
import { env } from "./env"; // if this path is off, use "./env"

let ready: Promise<typeof mongoose> | null = null;

export function getDb() {
  if (!ready) {
    ready = mongoose.connect(env.MONGO_URI, { dbName: "asdesigns" });
    ready.then(() => console.log("✅ Mongo connected"));
  }
  return ready;
}
