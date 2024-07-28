
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { File, ListChecks, LayoutDashboard, CircleDollarSign } from 'lucide-react';
import connectDB from '@/lib/db';
import { Course } from '@/models/Course';
import { Category } from '@/models/Category';
import { IconBadge } from '@/components/icon-badge';
import { TitleForm } from './_components/title-form';
import { ImageForm } from './_components/image-form';
import  {CategoryForm } from './_components/category-form';
import { DescriptionForm } from './_components/description-form';

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

  const course = await Course.findOne({
    _id: params.courseId,
    userId,
  }).exec();
    // .populate('attachments', null, { sort: { createdAt: -1 } })
    // .populate('chapters', null, { sort: { position: 1 } })
    // .exec();

  if (!course || course.userId.toString() !== userId) {
    return redirect('/');
  }

  const categories = await Category.find().sort({ name: 1 }).exec();

  const requiredFields = [
    course.title,
    course.price,
    course.imageUrl,
    course.categoryId,
    course.description,
    // course.chapters.some(chapter => chapter.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isCompleted = requiredFields.every(Boolean);

  return (
    <>
      {/* Uncomment this block if you want to display a banner for unpublished courses */}
      {/* {!course.isPublished && (
        <Banner
          variant="warning"
          label="This course is unpublished. It will not be visible in the students."
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
          {/* Uncomment and adjust the Actions component as needed */}
          {/* <Actions
            courseId={course._id}
            disabled={!isCompleted}
            isPublished={course.isPublished}
          /> */}
        </div>

        <div className="grid grid-cols-1 gap-6 mt-16 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <TitleForm initialData={course} courseId={course._id} />
            <DescriptionForm initialData={course} courseId={course._id} />
            <ImageForm initialData={course} courseId={course._id} />
            <CategoryForm
              initialData={course}
              courseId={course._id}
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
              {/* Uncomment and adjust the ChaptersForm component as needed */}
              {/* <ChaptersForm initialData={course} courseId={course._id} /> */}
            </div>

            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">Sell your course</h2>
              </div>
              {/* Uncomment and adjust the PriceForm component as needed */}
              {/* <PriceForm courseId={course._id} initialData={course} /> */}
            </div>

            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Resources & Attachments</h2>
              </div>
              {/* Uncomment and adjust the AttachmentForm component as needed */}
              {/* <AttachmentForm initialData={course} courseId={course._id} /> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseIdPage;
