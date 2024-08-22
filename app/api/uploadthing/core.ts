import { auth } from '@clerk/nextjs/server';
import { UTApi } from "uploadthing/server";
import { createUploadthing, type FileRouter } from 'uploadthing/next';

// import { isTeacher } from '@/lib/teacher'

const f = createUploadthing()

export const utapi = new UTApi();

const handleAuth = () => {
  const { userId } = auth()
//   const isAuthorized = isTeacher(userId)

  if (!userId) throw new Error('Unauthorized')
  return { userId }
}

export const ourFileRouter = {
  courseImage: f({ image: { maxFileSize: '16MB', maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadError(async error => {
      console.error('[UPLOADTHING]', error)
      await utapi.deleteFiles(error.fileKey)
    })
    .onUploadComplete(() => {}),
  courseAttachment: f(['text', 'image', 'video', 'audio', 'pdf'])
    .middleware(() => handleAuth())
    .onUploadError(async error => {
      console.error('[UPLOADTHING]', error)
      await utapi.deleteFiles(error.fileKey)
    })
    .onUploadComplete(() => {}),
  chapterVideo: f({ video: { maxFileCount: 1, maxFileSize: '512GB' } })
    .middleware(() => handleAuth())
    .onUploadError(async error => {
      console.error('[UPLOADTHING]', error)
      await utapi.deleteFiles(error.fileKey)
    })
    .onUploadComplete(() => {}),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter