import Mux from '@mux/mux-node';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';

// import { isTeacher } from '@/lib/teacher';
import { Course } from '@/models/Course';
import { Chapter } from '@/models/Chapter';
import { MuxData } from '@/models/MuxData';

const mux = new Mux({
  tokenId: process.env['MUX_TOKEN_ID'],
  tokenSecret: process.env['MUX_TOKEN_SECRET'],
});



export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    await connectDB(); // Ensure the database connection is established

    const { userId } = auth();
    const { courseId, chapterId } = params;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Find course and ensure the user is the owner
    const courseOwner = await Course.findOne({
      _id: courseId,
      userId: userId,
      chapters: chapterId, // Ensure the chapter belongs to this course
    });

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Find the chapter
    const chapter = await Chapter.findById(chapterId);

    if (!chapter) {
      return new NextResponse('Not found', { status: 404 });
    }

    // Handle Mux video deletion
    if (chapter.videoUrl) {
      const existingMuxData = await MuxData.findOne({ chapterId });

      if (existingMuxData) {
        const video = await mux.video.assets.retrieve(existingMuxData.assetId);

        if (video) {
          await mux.video.assets.delete(existingMuxData.assetId);
        }

        await MuxData.deleteOne({ _id: existingMuxData._id });
      }
    }

    // Delete the chapter
    await Chapter.deleteOne({ _id: chapterId });

    // Check if there are any published chapters left in the course
    const publishedChaptersInCourse = await Chapter.find({
      courseId,
      isPublished: true,
    });

    // If no published chapters left, update the course to not be published
    if (publishedChaptersInCourse.length === 0) {
      await Course.updateOne(
        { _id: courseId },
        { isPublished: false }
      );
    }

    return NextResponse.json({ success: true, message: 'Chapter deleted successfully' });
  } catch (error) {
    console.error('[CHAPTER_ID_DELETE]', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}


export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } },
) {
  try {
    const { userId } = auth();
    const { courseId, chapterId } = params;
    const { isPublished, ...values } = await req.json();

    if (!userId) {
      return new NextResponse('userID not found Unauthorized', { status: 401 });
    }

    const courseOwner = await Course.findOne({
      _id: courseId,
      userId: userId,
      chapters: chapterId, // Assuming chapters are referenced by their IDs
    });

    if (!courseOwner) {
      return new NextResponse('courseowner Unauthorized', { status: 401 });
    }

    const chapter = await Chapter.findByIdAndUpdate(
      chapterId,
      { ...values },
      { new: true }
    );

    if (!chapter) {
      return new NextResponse('Not found', { status: 404 });
    }


    if (values.videoUrl) {
      const existingMuxData = await MuxData.findOne({ chapterId });

      if (existingMuxData) {
        await mux.video.assets.delete(existingMuxData.assetId);
        await MuxData.deleteOne({ _id: existingMuxData._id });
      }

      const asset = await mux.video.assets.create({
        test: false,
        input: values.videoUrl,
        playback_policy: ['public'],
      });

      await MuxData.create({
        chapterId,
        assetId: asset.id,
        playbackId: asset.playback_ids?.[0]?.id,
      });
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.error('[COURSE_CHAPTER_ID]', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
