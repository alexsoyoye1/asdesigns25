import mongoose, {
  Schema,
  model,
  models,
  type Model,
  type Document,
} from "mongoose";

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  role: "admin" | "employee";
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserDocument = Document & IUser;

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "employee"], default: "employee" },
  },
  { timestamps: true }
);

const User: Model<UserDocument> =
  (models.User as Model<UserDocument>) ||
  model<UserDocument>("User", userSchema);

export default User;
