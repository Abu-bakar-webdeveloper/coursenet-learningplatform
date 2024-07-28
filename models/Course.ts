import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICourse extends Document {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  isPublished: boolean;
  categoryId?: string;
}

const courseSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String },
    price: { type: Number },
    isPublished: { type: Boolean, default: false },
    categoryId: { type: String, ref: 'Category' },
  },
  {
    timestamps: true,
  }
);

export const Course = mongoose.models.Course || mongoose.model<ICourse>('Course', courseSchema);
