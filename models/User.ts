import mongoose, { Schema, Document } from 'mongoose';
import { ICourse } from './Course';

export interface IUser extends Document {
  name: string;
  email: string;
  courses: ICourse[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);