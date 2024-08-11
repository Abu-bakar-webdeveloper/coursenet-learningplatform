import { redirect } from 'next/navigation';
import connectDB from '@/lib/db';
import { Course } from '@/models/Course';
import mongoose from 'mongoose';

export default async function CourseIdPage({ params }: { params: { courseId: string } }) {
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
          { $project: { _id: 1 } },
        ],
        as: 'chapters',
      },
    },
  ]);

  console.log(course)

  if (!course || course.length === 0 || course[0].chapters.length === 0) {
    return redirect('/');
  }

  const firstChapterId = course[0].chapters[0]._id;

  return redirect(`/courses/${course[0]._id}/chapters/${firstChapterId}`);
}
