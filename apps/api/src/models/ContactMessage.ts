import { Schema, model, models, InferSchemaType } from "mongoose";

const contactMessageSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    phone: { type: String },
    website: { type: String },
    budgetAmount: { type: Number },
    currency: { type: String, enum: ["NGN", "USD", "GBP"] },
  },
  { timestamps: true }
);

// Let Mongoose infer types — no Document unions, no Model<> generics
export type ContactMessage = InferSchemaType<typeof contactMessageSchema>;

const ContactMessageModel =
  models.ContactMessage || model("ContactMessage", contactMessageSchema);

export default ContactMessageModel;
