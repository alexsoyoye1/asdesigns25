// apps/api/src/models/User.ts
import { Schema, model, models, Document, Model } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  role: "admin" | "employee";
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {}

export interface IUserModel extends Model<IUserDocument> {}

const userSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "employee"], default: "employee" },
  },
  { timestamps: true }
);

// Use the existing model if it exists, otherwise create a new one
const UserModel: IUserModel =
  models.User || model<IUserDocument, IUserModel>("User", userSchema);

export default UserModel;
