import mongoose, { Document, Schema } from 'mongoose';

interface IAttachment extends Document {
  name: string;
  url: string;
  courseId: string;
}

const attachmentSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  },
  {
    timestamps: true,
  }
);

export const Attachment = mongoose.model<IAttachment>('Attachment', attachmentSchema);