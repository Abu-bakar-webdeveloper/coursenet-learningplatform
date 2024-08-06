import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/db';
import { Course } from '@/models/Course';
import { columns } from './_components/columns';
import { DataTable } from './_components/data-table';

const CoursesPage = async () => {
  // Ensure the database connection is established
  await connectDB();

  const { userId } = auth();

  if (!userId) return redirect('/');

  // Find courses by userId and sort by createdAt in descending order
  const courses = await Course.find({ userId }).sort({ createdAt: -1 });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={courses} />
    </div>
  );
}

export default CoursesPage;
