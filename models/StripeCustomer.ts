import mongoose, { Document, Schema } from 'mongoose';

interface IStripeCustomer extends Document {
  userId: string;
  stripeCustomerId: string;
}

const stripeCustomerSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    stripeCustomerId: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

export const StripeCustomer = mongoose.model<IStripeCustomer>('StripeCustomer', stripeCustomerSchema);