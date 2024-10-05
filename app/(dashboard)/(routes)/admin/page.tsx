import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { ICourse } from "@/models/Course";
import User from "@/models/User";
import { isAdmin } from "@/lib/admin";

const AdminPage = async () => {
  await connectDB();

  if (!isAdmin) {
    return redirect("/");
  }

  // Fetch users and transform them into plain objects
  const users = await User.find().sort({ createdAt: -1 }).populate("courses");

  const plainUsers = users.map((user) => ({
    _id: user._id.toString(),
    userId: user.userId,
    name: user.username || "Unknown",  // Default to 'Unknown' if no name
    email: user.email,
    numberOfCourses: user.numberOfCourses,
    courses: user.courses.map((course: ICourse) => ({
      _id: course._id.toString(),
      title: course.title || "Untitled",
      isPublished: course.isPublished || false,
    })),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    __v: user.__v,
  }));

  return (
    <div className="p-6">
      <DataTable columns={columns} data={plainUsers} />
    </div>
  );
};

export default AdminPage;
