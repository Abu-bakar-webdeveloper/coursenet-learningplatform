import { ICourse } from '@/models/Course';
import { ICategory } from '@/models/Category';

import { CourseCard } from './course-card';

type CourseWithProgressWithCategory = ICourse & {
  progress: number | null;
  category: ICategory | null;
  chapters: { _id: string }[];
}

interface CoursesListProps {
  items: CourseWithProgressWithCategory[];
}

export const CoursesList = ({ items }: CoursesListProps) => {
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
        {items.map(item => (
          <CourseCard
            key={item._id}
            id={item._id}
            title={item.title}
            price={item.price || 0}  // Handle cases where price might be undefined
            imageUrl={item.imageUrl || '/placeholder.png'}  // Provide a default image if undefined
            progress={item.progress}
            isBlock={item.isBlock}
            category={item?.category?.name || 'Uncategorized'}  // Default text for uncategorized courses
            chaptersLength={item.chapters.length}
          />
        ))}
      </div>

      {items.length === 0 && (
        <div className="mt-10 text-sm text-center text-muted-foreground">
          No courses found
        </div>
      )}
    </div>
  );
}