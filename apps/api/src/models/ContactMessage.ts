import { Schema, model, models, type Model, type Document } from "mongoose";

export interface IContactMessage {
  name: string;
  email: string;
  message: string;
  phone?: string;
  website?: string;
  budgetAmount?: number;
  currency?: "NGN" | "USD" | "GBP";
  createdAt?: Date;
  updatedAt?: Date;
}

export type ContactMessageDocument = Document & IContactMessage;

const contactMessageSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    phone: String,
    website: String,
    budgetAmount: Number,
    currency: { type: String, enum: ["NGN", "USD", "GBP"] },
  },
  { timestamps: true }
);

const ContactMessage: Model<ContactMessageDocument> =
  (models.ContactMessage as Model<ContactMessageDocument>) ||
  model<ContactMessageDocument>("ContactMessage", contactMessageSchema);

export default ContactMessage;
