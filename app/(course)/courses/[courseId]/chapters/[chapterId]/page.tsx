import { File } from 'lucide-react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { Banner } from '@/components/banner';
import { Preview } from '@/components/preview';
import { getChapter } from '@/actions/get-chapter';
import { Separator } from '@/components/ui/separator';
import { VideoPlayer } from './_components/video-player';
import { CurseEnrollButton } from './_components/course-enroll-button';
import { CourseProgressButton } from './_components/course-progress-button';
import { isAdmin } from '@/lib/admin'; // Import admin check function

export default async function ChapterIdPage({
  params,
}: {
  params: {
    courseId: string;
    chapterId: string;
  };
}) {
  const { userId } = auth();

  if (!userId) {
    return redirect('/');
  }

  // Check if the current user is an admin
  const admin = await isAdmin(userId);

  const {
    course,
    chapter,
    muxData,
    purchase,
    attachments,
    nextChapter,
    userProgress,
  } = await getChapter({
    userId,
    courseId: params.courseId,
    chapterId: params.chapterId,
  });

  if (!course || !chapter) {
    return redirect('/');
  }

  // Set isLocked based on whether the user is an admin or not
  const isLocked = !admin && !chapter.isFree && !purchase; // Admins bypass the lock
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  // Convert nextChapterId to a string or undefined
  const nextChapterId = nextChapter?._id?.toString() || undefined;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner variant="success" label="You already completed this chapter." />
      )}

      {isLocked && (
        <Banner
          variant="warning"
          label="You need to purchase this course to watch this chapter."
        />
      )}

      <div className="flex flex-col max-w-4xl pb-20 mx-auto">
        <div className="p-4">
          <VideoPlayer
            isLocked={isLocked}
            title={chapter.title}
            courseId={params.courseId}
            chapterId={params.chapterId}
            completeOnEnd={completeOnEnd}
            nextChapterId={nextChapterId}
            playbackId={muxData?.playbackId!}
          />
        </div>

        <div>
          <div className="flex flex-col items-center justify-between p-4 md:flex-row">
            <h2 className="mb-2 text-2xl font-semibold">{chapter.title}</h2>

            {purchase ? (
              <CourseProgressButton
                courseId={params.courseId}
                chapterId={params.chapterId}
                nextChapterId={nextChapterId}
                isCompleted={!!userProgress?.isCompleted}
              />
            ) : (
              <CurseEnrollButton
                price={course.price!}
                courseId={params.courseId}
              />
            )}
          </div>

          <Separator />

          <div>
            <Preview value={chapter.description!} />
          </div>

          {!!attachments.length && (
            <>
              <Separator />

              <div className="p-4">
                {attachments.map((attachment) => (
                  <a
                    target="_blank"
                    key={attachment._id.toString()}
                    href={attachment.url}
                    rel="noopener noreferrer nofollow external"
                    className="flex items-center w-full p-3 border rounded-md bg-sky-200 text-sky-700 hover:underline"
                  >
                    <File />
                    <p className="line-clamp-1">{attachment.name}</p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
