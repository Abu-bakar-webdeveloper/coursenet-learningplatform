import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/db';
import { User as UserModel } from '@/models/User';
import { columns, User } from './_components/columns';
import { DataTable } from './_components/data-table';
import { ICourse } from '@/models/Course';

const AdminPage = async () => {
  await connectDB();

  const { userId } = auth();
  if (!userId) return redirect('/');

  const users = await UserModel.find().sort({ createdAt: -1 });

  const plainUsers: User[] = users.map((user) => {
    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      courses: user.courses 
        ? user.courses.map((course: ICourse) => ({
            _id: course._id.toString(),
            title: course.title || '',
            isPublished: course.isPublished || false,
          })) 
        : [],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      __v: user.__v,
    };
  }); 

  return (
    <div className="p-6">
      <DataTable columns={columns} data={plainUsers} />
    </div>
  );
}

export default AdminPage;