import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import { Course } from '@/models/Course';
import { Chapter, IChapter } from '@/models/Chapter';
import { Purchase } from '@/models/Purchase';
import { Attachment, IAttachment } from '@/models/Attachment';
import { MuxData } from '@/models/MuxData';
import { UserProgress } from '@/models/UserProgress';

interface GetChapterProps {
  userId: string;
  courseId: string;
  chapterId: string;
}

export const getChapter = async ({
  userId,
  courseId,
  chapterId,
}: GetChapterProps) => {
  try {
    await connectDB(); // Ensure the database connection is established

    // If IDs are not ObjectId, directly use them without conversion
    const purchase = await Purchase.findOne({
      userId,  // Use userId as is
      courseId, // Use courseId as is
    });

    const course = await Course.findOne({
      _id: courseId,  // Use courseId as is
      isPublished: true,
    }).select('price');

    const chapter = await Chapter.findOne({
      _id: chapterId,  // Use chapterId as is
      courseId,
      isPublished: true,
    });

    if (!chapter || !course) {
      throw new Error('Chapter or course not found');
    }

    let muxData = null;
    let attachments: IAttachment[] = [];
    let nextChapter: IChapter | null = null;

    if (purchase) {
      attachments = await Attachment.find({
        courseId,
      });
    }

    if (chapter.isFree || purchase) {
      muxData = await MuxData.findOne({
        chapterId,
      });

      nextChapter = await Chapter.findOne({
        courseId,
        isPublished: true,
        position: { $gt: chapter.position },
      }).sort({ position: 'asc' });
    }

    const userProgress = await UserProgress.findOne({
      userId,
      chapterId,
    });

    return {
      course,
      chapter,
      muxData,
      purchase,
      attachments,
      nextChapter,
      userProgress,
    };
  } catch (error) {
    console.error('[GET_CHAPTER]', error);
    return {
      course: null,
      chapter: null,
      muxData: null,
      attachments: [],
      purchased: false,
      nextChapter: null,
      userProgress: null,
    };
  }
};
