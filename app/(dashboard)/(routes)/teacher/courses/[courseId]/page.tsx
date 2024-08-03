import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import {
  File,
  ListChecks,
  LayoutDashboard,
  CircleDollarSign,
} from 'lucide-react';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import { Course } from '@/models/Course';
import { Category } from '@/models/Category';
// import { Banner } from '@/components/banner';
// import { Actions } from './_components/actions';
import { IconBadge } from '@/components/icon-badge';
import { TitleForm } from './_components/title-form';
import { ImageForm } from './_components/image-form';
import { PriceForm } from './_components/price-form';
import { CategoryForm } from './_components/category-form';
import { ChaptersForm } from './_components/chapters-form';
import { AttachmentForm } from './_components/attachment-form';
import { DescriptionForm } from './_components/description-form';
import { IChapter } from '@/models/Chapter';

interface CourseIdPageProps {
  params: {
    courseId: string;
  };
}

const CourseIdPage = async ({ params }: CourseIdPageProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect('/');
  }

  await connectDB();

  const courseId = new mongoose.Types.ObjectId(params.courseId);

  const course = await Course.aggregate([
    {
      $match: {
        _id: courseId,
        userId,
      },
    },
    {
      $lookup: {
        from: 'attachments',
        localField: '_id',
        foreignField: 'courseId',
        as: 'attachments',
      },
    },
    {
      $lookup: {
        from: 'chapters',
        localField: '_id',
        foreignField: 'courseId',
        as: 'chapters',
      },
    },
  ]).exec();

  if (!course || course.length === 0 || course[0].userId.toString() !== userId) {
    return redirect('/');
  }

  const categories = await Category.find().sort({ name: 1 }).exec();

  const requiredFields = [
    course[0].title,
    course[0].price,
    course[0].imageUrl,
    course[0].categoryId,
    course[0].description,
    course[0].chapters?.some((chapter: IChapter) => chapter.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isCompleted = requiredFields.every(Boolean);

  return (
    <>
      {/* {!course[0].isPublished && (
        <Banner
          variant="warning"
          label="This course is unpublished. It will not be visible to students."
        />
      )} */}

      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course setup</h1>
            <span className="text-sm text-slate-700">
              Complete all fields {completionText}
            </span>
          </div>

          {/* <Actions
            courseId={course[0]._id}
            disabled={!isCompleted}
            isPublished={course[0].isPublished}
          /> */}
        </div>

        <div className="grid grid-cols-1 gap-6 mt-16 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course</h2>
            </div>

            <TitleForm initialData={course[0]} courseId={course[0]._id} />
            <DescriptionForm initialData={course[0]} courseId={course[0]._id} />
            <ImageForm initialData={course[0]} courseId={course[0]._id} />
            <CategoryForm
              initialData={course[0]}
              courseId={course[0]._id}
              options={categories.map(category => ({
                label: category.name,
                value: category._id,
              }))}
            />
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course chapters</h2>
              </div>

              <ChaptersForm initialData={course[0]} courseId={course[0]._id} />
            </div>

            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">Sell your course</h2>
              </div>

              <PriceForm courseId={course[0]._id} initialData={course[0]} />
            </div>

            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Resources & Attachments</h2>
              </div>

              <AttachmentForm initialData={course[0]} courseId={course[0]._id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseIdPage;