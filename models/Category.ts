import mongoose, { Document, Schema } from 'mongoose';

interface ICategory extends Document {
  name: string;
}

const categorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

export const Category = mongoose.model<ICategory>('Category', categorySchema);