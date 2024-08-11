import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/db';
import { Course } from '@/models/Course';
import { getProgress } from '@/actions/get-progress';
import { CourseNavbar } from './_components/course-navbar';
import { CourseSidebar } from './_components/course-sidebar';
import mongoose from 'mongoose';


export default async function CourseLayout({
  params,
  children,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) {
  const { userId } = auth();

  if (!userId) return redirect('/');

  await connectDB(); // Ensure the database connection is established

  const course = await Course.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(params.courseId) } },
    {
      $lookup: {
        from: 'chapters',
        let: { courseId: '$_id' },
        pipeline: [
          { $match: { $expr: { $eq: ['$$courseId', '$courseId'] }, isPublished: true } },
          { $sort: { position: 1 } },
          {
            $lookup: {
              from: 'userprogresses',
              let: { chapterId: '$_id' },
              pipeline: [
                { $match: { $expr: { $and: [{ $eq: ['$chapterId', '$$chapterId'] }, { $eq: ['$userId', userId] }] } } },
              ],
              as: 'userProgress',
            },
          },
        ],
        as: 'chapters',
      },
    },
  ]);

  console.log(course)

  if (!course || course.length === 0) return redirect('/');

  const progressCount = await getProgress(userId, course[0]._id);

  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
        <CourseNavbar course={course[0]} progressCount={progressCount} />
      </div>

      <div className="fixed inset-y-0 z-50 flex-col hidden h-full md:flex w-80">
        <CourseSidebar course={course[0]} progressCount={progressCount} />
      </div>

      <main className="h-full md:pl-80 pt-[80px]">{children}</main>
    </div>
  );
}
