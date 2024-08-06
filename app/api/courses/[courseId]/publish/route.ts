import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
// import { isTeacher } from '@/lib/teacher';
import { Course } from '@/models/Course';
import { Chapter } from '@/models/Chapter';

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    await connectDB(); // Ensure the database connection is established

    const { userId } = auth();
    const { courseId } = params;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Aggregate the chapters to check if there is any published chapter
    const chapters = await Chapter.aggregate([
      { $match: { courseId: courseId } },
      {
        $group: {
          _id: null,
          hasPublishedChapters: {
            $sum: { $cond: ['$isPublished', 1, 0] }
          }
        }
      }
    ]);

    const hasPublishedChapters = chapters.length > 0 && chapters[0].hasPublishedChapters > 0;

    // Find the course directly without populating
    const course = await Course.findOne({ _id: courseId, userId });

    if (!course) {
      return new NextResponse('Not found', { status: 404 });
    }

    // Validate that the course has required fields and at least one published chapter
    if (
      !course.title ||
      !course.imageUrl ||
      !course.categoryId ||
      !course.description ||
      !hasPublishedChapters
    ) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Update the course to be published
    const publishedCourse = await Course.findOneAndUpdate(
      { _id: courseId, userId },
      { isPublished: true },
      { new: true }
    );

    return NextResponse.json(publishedCourse);
  } catch (error) {
    console.error('[COURSE_ID_PUBLISH]', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
