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

    // Find the purchase for the user and course
    const purchase = await Purchase.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      courseId: new mongoose.Types.ObjectId(courseId),
    });

    // Find the course if it's published
    const course = await Course.findOne({
      _id: new mongoose.Types.ObjectId(courseId),
      isPublished: true,
    }).select('price');

    // Find the chapter if it's published
    const chapter = await Chapter.findOne({
      _id: new mongoose.Types.ObjectId(chapterId),
      courseId: new mongoose.Types.ObjectId(courseId),
      isPublished: true,
    });

    if (!chapter || !course) {
      throw new Error('Chapter or course not found');
    }

    let muxData = null;
    let attachments: IAttachment[] = [];
    let nextChapter: IChapter | null = null;

    if (purchase) {
      // Fetch all attachments related to the course
      attachments = await Attachment.find({
        courseId: new mongoose.Types.ObjectId(courseId),
      });
    }

    if (chapter.isFree || purchase) {
      // Fetch mux data for the chapter
      muxData = await MuxData.findOne({
        chapterId: new mongoose.Types.ObjectId(chapterId),
      });

      // Fetch the next chapter in sequence
      nextChapter = await Chapter.findOne({
        courseId: new mongoose.Types.ObjectId(courseId),
        isPublished: true,
        position: { $gt: chapter.position },
      }).sort({ position: 'asc' });
    }

    // Fetch user progress for the chapter
    const userProgress = await UserProgress.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      chapterId: new mongoose.Types.ObjectId(chapterId),
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
