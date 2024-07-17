import mongoose, { Document, Schema } from 'mongoose';

interface ICourse extends Document {
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
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  },
  {
    timestamps: true,
  }
);

export const Course = mongoose.model<ICourse>('Course', courseSchema);
