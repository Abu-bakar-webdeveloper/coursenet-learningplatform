// import Mux from '@mux/mux-node';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Course } from '@/models/Course';
// import { isTeacher } from '@/lib/teacher';

// const { Video } = new Mux(
//   process.env.MUX_TOKEN_ID as string,
//   process.env.MUX_TOKEN_SECRET as string,
// );

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } },
) {
  try {
    const { userId } = auth();
    const { courseId } = params;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectDB();

    const course = await Course.findOne({
      _id: courseId,
      userId,
    })
    // .populate({
    //   path: 'chapters',
    //   populate: {
    //     path: 'muxData',
    //   },
    // });

    if (!course) {
      return new NextResponse('Not found', { status: 404 });
    }

    // for (const chapter of course.chapters) {
    //   if (chapter.muxData?.assetId) {
    //     await Video.Assets.del(chapter.muxData.assetId).catch(() => {});
    //   }
    // }

    await Course.deleteOne({
      _id: courseId,
      userId,
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error('[COURSE_ID_DELETE]', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } },
) {
  try {
    const { userId } = auth();
    const { courseId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectDB();

    const course = await Course.findOneAndUpdate(
      {
        _id: courseId,
        userId,
      },
      values,
      { new: true }
    );

    return NextResponse.json(course);
  } catch (error) {
    console.error('[COURSE_ID]', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
