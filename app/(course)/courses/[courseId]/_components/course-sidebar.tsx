import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/db';
import { Course } from '@/models/Course';
import { Purchase } from '@/models/Purchase';
import { CourseSidebarItem } from './course-sidebar-item';
import { CourseProgress } from '@/components/course-progress';

interface CourseSidebarProps {
  progressCount: number;
  course: any; // We'll define the shape of the course using Mongoose below
}

export const CourseSidebar = async ({ course, progressCount }: CourseSidebarProps) => {
  const { userId } = auth();

  if (!userId) return redirect('/');

  await connectDB(); // Ensure the database connection is established

  const purchase = await Purchase.findOne({
    userId,
    courseId: course._id,
  });

  return (
    <div className="flex flex-col h-full overflow-y-auto border-r shadow-sm select-none">
      <div className="flex flex-col p-8 border-b">
        <h1 className="font-semibold">{course.title}</h1>

        {purchase && (
          <div className="mt-10">
            <CourseProgress variant="success" value={progressCount} />
          </div>
        )}
      </div>

      <div className="flex flex-col w-full">
        {course.chapters.map((chapter: any) => (
          <CourseSidebarItem
            _id={chapter._id}
            key={chapter._id}
            courseId={course._id}
            label={chapter.title}
            isLocked={!chapter.isFree && !purchase}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
          />
        ))}
      </div>
    </div>
  );
};
