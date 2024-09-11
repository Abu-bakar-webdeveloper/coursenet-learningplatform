import mongoose, { Types } from "mongoose";
import { ICourse } from "./Course";

export interface IUser extends Document {
  _id: string;
  userId: string;
  username?: string;
  email: string;
  numberOfCourses?: number;
  courses: Types.ObjectId[] | ICourse;
}

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    username: {
      type: String,
    },
    email: { type: String, required: true },
    numberOfCourses: { type: Number, default: 0 },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
