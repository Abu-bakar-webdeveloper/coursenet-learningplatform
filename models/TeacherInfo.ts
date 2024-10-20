import mongoose, { Schema, Document } from 'mongoose';

export interface ITeacherInfo extends Document {
  _id: string;
  userId: string;
  fullName: string;
  bio: string;
  experience: number;
  expertise: string[];
  socialLinks?: string[];
}

const TeacherInfoSchema: Schema = new Schema({
  userId: { type: String, required: true },
  fullName: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  bio: { type: String, required: true, trim: true, minlength: 10, maxlength: 1000 },
  experience: { type: Number, required: true, min: 0, max: 100 },
  expertise: [{ type: String, required: true, trim: true }],
  socialLinks: [{ type: String, trim: true, match: /^https?:\/\// }],
}, { timestamps: true });

export const TeacherInfo = mongoose.models.TeacherInfo || mongoose.model<ITeacherInfo>('TeacherInfo', TeacherInfoSchema);