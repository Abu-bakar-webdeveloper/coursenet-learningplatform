import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Course } from "@/models/Course";
import { Chapter } from '@/models/Chapter';

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId, chapterId } = params;
    const { isPublished, ...values } = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if the course exists and is owned by the user
    const courseOwner = await Course.findOne({
      _id: courseId,
      userId: userId,
    });

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if the chapter exists
    const chapter = await Chapter.findByIdAndUpdate(chapterId, values, {
      new: true,
    });

    if (!chapter) {
      return new NextResponse('Chapter not found', { status: 404 });
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.error('[COURSE_CHAPTER_ID]', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
