import mongoose, { Document, Schema } from 'mongoose';

interface IPurchase extends Document {
  userId: string;
  courseId: string;
}

const purchaseSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  },
  {
    timestamps: true,
  }
);

purchaseSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export const Purchase = mongoose.model<IPurchase>('Purchase', purchaseSchema);