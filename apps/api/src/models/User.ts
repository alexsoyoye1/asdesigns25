// apps/api/src/models/User.ts
import { Schema, model, models, InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "employee"], default: "employee" },
  },
  { timestamps: true }
);

export type User = InferSchemaType<typeof userSchema>;

// No generic Model<T> here — let Mongoose infer, avoids overload clashes
const UserModel = models.User || model("User", userSchema);
export default UserModel;
