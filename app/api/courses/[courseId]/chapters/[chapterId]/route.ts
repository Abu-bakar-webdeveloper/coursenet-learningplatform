import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import mongoose from 'mongoose';
import { Course } from "@/models/Course";
import { Chapter } from '@/models/Chapter';



export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } },
  ) {
    try {
      const { userId } = auth();
      const { courseId, chapterId } = params;
      const { isPublished, ...values } = await req.json();
  
      if (!userId) {
        return new NextResponse('Unauthorized', { status: 401 });
      }
  
      // Check if the user is the owner of the course and the chapter exists
      const courseOwner = await Course.findOne({
        _id: courseId,
        userId: userId,
       'chapters._id': chapterId,
      });
  
      if (!courseOwner) {
        return new NextResponse('Unauthorized', { status: 401 });
      }
  
      const chapter = await Chapter.findByIdAndUpdate(chapterId, values, {
        new: true,
      });
  
    //   if (values.videoUrl) {
    //     const existingMuxData = await MuxData.findOne({ chapterId });
  
    //     if (existingMuxData) {
    //       await Video.Assets.del(existingMuxData.assetId);
    //       await MuxData.findByIdAndDelete(existingMuxData._id);
    //     }
  
    //     const asset = await Video.Assets.create({
    //       test: false,
    //       input: values.videoUrl,
    //       playback_policy: 'public',
    //     });
  
    //     await MuxData.create({
    //       chapterId,
    //       assetId: asset.id,
    //       playbackId: asset.playback_ids?.[0]?.id,
    //     });
    //   }
  
      return NextResponse.json(chapter);
    } catch (error) {
      console.error('[COURSE_CHAPTER_ID]', error);
      return new NextResponse('Internal server error', { status: 500 });
    }
  }
  