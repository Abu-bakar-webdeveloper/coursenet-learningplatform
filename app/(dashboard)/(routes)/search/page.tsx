import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import connectDB from '@/lib/db';
import { Category } from '@/models/Category';
import { getCourses } from '@/actions/get-courses';
import { Categories } from './_components/categories';
import { SearchInput } from '@/components/search-input';
import { CoursesList } from '@/components/courses-list';

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  // Ensure the database connection is established
  await connectDB();

  const { userId } = auth();

  if (!userId) return redirect('/');

  // Fetch categories from MongoDB using Mongoose
  const categories = await Category.find({}).sort({ name: 1 });

  // Fetch courses using a custom function that works with Mongoose
  const courses = await getCourses({
    userId,
    ...searchParams,
  });

  return (
    <>
      <div className="block px-6 pt-6 md:hidden md:mb-0">
        <SearchInput />
      </div>

      <div className="p-6 space-y-4">
        <Categories items={categories} />
        <CoursesList items={courses} />
      </div>
    </>
  );
}

export default SearchPage;
