import { Schema, model, models, Document, Model } from "mongoose";

export interface IContactMessage {
  name: string;
  email: string;
  message: string;
  phone?: string;
  website?: string;
  budgetAmount?: number;
  currency?: "NGN" | "USD" | "GBP";
  createdAt: Date;
  updatedAt: Date;
}

export interface IContactMessageDocument extends IContactMessage, Document {}

export interface IContactMessageModel extends Model<IContactMessageDocument> {}

const contactMessageSchema = new Schema<IContactMessageDocument>(
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

const ContactMessageModel: IContactMessageModel =
  models.ContactMessage ||
  model<IContactMessageDocument, IContactMessageModel>(
    "ContactMessage",
    contactMessageSchema
  );

export default ContactMessageModel;
