import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Course } from '@/models/Course';
import { Chapter } from '@/models/Chapter';

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } },
) {
  try {
    await connectDB(); // Ensure the database connection is established

    const { userId } = auth();
    const { courseId } = params;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Find the course and its associated chapters and muxData
    const course = await Course.findOne({ _id: courseId, userId });

    if (!course) {
      return new NextResponse('Not found', { status: 404 });
    }

    // Check if the course has any published chapters
    const chapters = await Chapter.find({ courseId, isPublished: true });

    if (
      !course.title ||
      !course.imageUrl ||
      !course.categoryId ||
      !course.description ||
      !chapters.length
    ) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Update the course to be published
    course.isPublished = true;
    await course.save();

    return NextResponse.json(course);
  } catch (error) {
    console.error('[COURSE_ID_PUBLISH]', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
