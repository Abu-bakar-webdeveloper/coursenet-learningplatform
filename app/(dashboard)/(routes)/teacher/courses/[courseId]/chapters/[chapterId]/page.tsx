import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { ArrowLeft, Eye, LayoutDashboard, Video } from 'lucide-react'
import mongoose from 'mongoose';

import connectDB from '@/lib/db';
import { Chapter } from '@/models/Chapter';
// import Course from '@/models/course'
// import { Banner } from '@/components/banner'
import { IconBadge } from '@/components/icon-badge'
// import { ChapterActions } from './_components/chapter-actions'
// import { ChapterTitleForm } from './_components/chapter-title-form'
// import { ChapterVideoForm } from './_components/chapter-video-form'
// import { ChapterAccessForm } from './_components/chapter-access-form'
// import { ChapterDescriptionForm } from './_components/chapter-description-form'

const ChapterIdPage = async ({
  params,
}: {
  params: {
    courseId: string
    chapterId: string
  }
}) => {
  await connectDB();

  const { userId } = auth()

  if (!userId) {
    return redirect('/')
  }

  const chapterAggregate = await Chapter.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(params.chapterId),
        courseId: new mongoose.Types.ObjectId(params.courseId),
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'courseId',
        foreignField: '_id',
        as: 'course',
      },
    },
    {
      $unwind: '$course',
    },
  ])

  const chapter = chapterAggregate[0]

  if (!chapter || chapter.course.userId !== userId) {
    return redirect('/')
  }

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl]

  const totalFields = requiredFields.length
  const completedFields = requiredFields.filter(Boolean).length
  const completionText = `(${completedFields}/${totalFields})`

  const isCompleted = requiredFields.every(Boolean)

  return (
    <>
      {/* {!chapter.isPublished && (
        <Banner
          variant="warning"
          label="This chapter is unpublished. It will not be visible in the course."
        />
      )} */}

      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/teacher/courses/${params.courseId}`}
              className="flex items-center mb-6 text-sm transition hover:opacity-75"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to course setup
            </Link>

            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Chapter Creation</h1>

                <span className="text-sm text-slate-700">
                  Complete all field {completionText}
                </span>
              </div>

              {/* <ChapterActions
                disabled={!isCompleted}
                courseId={params.courseId}
                chapterId={params.chapterId}
                isPublished={chapter.isPublished}
              /> */}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mt-16 md:grid-cols-2">
          <div className="space-y-6">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />

              <h2 className="text-xl">Customize your chapter</h2>
            </div>

            {/* <ChapterTitleForm
              initialData={chapter}
              courseId={params.courseId}
              chapterId={params.chapterId}
            /> */}

            {/* <ChapterDescriptionForm
              initialData={chapter}
              courseId={params.courseId}
              chapterId={params.chapterId}
            /> */}

            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Eye} />
                <h2 className="text-xl">Access Settings</h2>
              </div>

              {/* <ChapterAccessForm
                initialData={chapter}
                courseId={params.courseId}
                chapterId={params.chapterId}
              /> */}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2 className="text-xl">Add a video</h2>
            </div>

            {/* <ChapterVideoForm
              initialData={chapter}
              courseId={params.courseId}
              chapterId={params.chapterId}
            /> */}
          </div>
        </div>
      </div>
    </>
  )
}

export default ChapterIdPage
