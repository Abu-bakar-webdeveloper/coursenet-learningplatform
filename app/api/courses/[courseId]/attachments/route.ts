import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Course } from '@/models/Course';
import { Attachment } from '@/models/Attachment';

export async function POST(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectDB();

    const course = await Course.findOne({ _id: params.courseId, userId });

    if (!course) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { url } = await req.json();

    const attachment = await Attachment.create({
      courseId: course._id,
      url,
      name: url.split('/').pop(),
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.error('[ATTACHMENT_CREATE]', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
