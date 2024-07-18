import mongoose, { Document, Schema } from 'mongoose';

interface IChapter extends Document {
  title: string;
  description?: string;
  videoUrl?: string;
  position: number;
  isPublished: boolean;
  isFree: boolean;
  courseId: string;
}

const chapterSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    videoUrl: { type: String },
    position: { type: Number, required: true },
    isPublished: { type: Boolean, default: false },
    isFree: { type: Boolean, default: false },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  },
  {
    timestamps: true,
  }
);

export const Chapter = mongoose.model<IChapter>('Chapter', chapterSchema);
