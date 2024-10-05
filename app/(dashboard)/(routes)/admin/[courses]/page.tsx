import React from 'react'
import mongoose from 'mongoose';
import { Course, ICourse } from '@/models/Course';
import { ICategory } from '@/models/Category';
import { IChapter } from '@/models/Chapter';
import { IAttachment } from '@/models/Attachment';
import { CoursesList } from '@/components/courses-list';
import { isAdmin } from '@/lib/admin';
import { redirect } from 'next/navigation';

type CourseWithProgress = ICourse & {
  category: ICategory | null;
  chapters: { _id: string; title: string }[];
  attachments: IAttachment[];
  progress: number | null;
}

interface UserIdPageProps {
  params: {
    UserId: string;
  };
}

const UserCoursePage = async ({ params }: UserIdPageProps) => {
  if (!isAdmin) {
    return redirect('/');
  }

  const userId = new mongoose.Types.ObjectId(params.UserId);

  const courses = await Course.find({ userId, isPublished: true }).sort({ createdAt: -1 });

  const plainCourses: CourseWithProgress[] = courses.map((course) => ({
    ...course.toObject(),
    _id: course._id.toString(),
    userId: course.userId.toString(),
    categoryId: course.categoryId?.toString(),
    category: course.category 
      ? { ...course.category.toObject(), _id: course.category._id.toString() } 
      : null,
    attachments: course.attachments?.map((attachment: IAttachment) => ({
      _id: attachment._id.toString(),
      name: attachment.name,
      url: attachment.url,
      courseId: attachment.courseId?.toString(),
    })) ?? [],
    chapters: course.chapters?.map((chapter: IChapter) => ({
      _id: chapter._id.toString(),
      title: chapter.title,
    })) ?? [],
    imageUrl: course.imageUrl?.toString('base64'),
    progress: null,
  }));

  return (
    <div>
      <CoursesList items={plainCourses} />
    </div>
  )
}

export default UserCoursePage