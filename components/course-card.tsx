'use client'

import Link from 'next/link'
import Image from 'next/image'
import { BookOpen } from 'lucide-react'
import { formatPrice } from '@/lib/format'
import { IconBadge } from '@/components/icon-badge'
import { CourseProgress } from '@/components/course-progress'
import { isAdmin } from '@/lib/admin'
import { useAuth } from '@clerk/nextjs'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { usePathname } from "next/navigation";

interface CourseCardProps {
  id: string
  title: string
  price: number
  imageUrl: string
  category: string
  chaptersLength: number
  progress: number | null
  isBlock: boolean
}

export const CourseCard = ({
  id,
  title,
  price,
  imageUrl,
  progress,
  isBlock,
  category,
  chaptersLength,
}: CourseCardProps) => {
  const { userId } = useAuth()
  const pathname = usePathname();
  const isAdminUser = isAdmin(userId ?? null)
  const isAdminPage = pathname?.startsWith("/admin");

  const handleBlockCourse = async () => {
    try {
      await axios.patch(`/api/courses/block`, { courseId: id })
      alert('Course blocked successfully')
    } catch (error) {
      console.error('Failed to block course:', error)
    }
  }

  const handleUnblockCourse = async () => {
    try {
      await axios.patch(`/api/courses/unblock`, { courseId: id })
      alert('Course unblocked successfully')
    } catch (error) {
      console.error('Failed to unblock course:', error)
    }
  }

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <Link href={`/courses/${id}`}>
        <div className="relative aspect-video overflow-hidden">
          <Image 
            fill 
            alt={title} 
            src={imageUrl} 
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <CardContent className="p-4">
          <Badge className="mb-2" variant="secondary">{category}</Badge>
          <h3 className="text-lg font-semibold line-clamp-2 mb-2 transition-colors group-hover:text-primary">
            {title}
          </h3>
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <IconBadge size="sm" icon={BookOpen} />
            <span className="ml-2">
              {chaptersLength} {chaptersLength === 1 ? 'Chapter' : 'Chapters'}
            </span>
          </div>
          {!isAdminUser && progress !== null ? (
            <CourseProgress
              size="sm"
              value={progress}
              variant={progress === 100 ? 'success' : 'default'}
            />
          ) : (
            <p className="text-lg font-bold text-primary">
              {formatPrice(price)}
            </p>
          )}
        </CardContent>
      </Link>
      {isAdminUser && isAdminPage && (
        <CardFooter className="p-4 pt-0">
          {isBlock ? (
            <Button 
              onClick={handleUnblockCourse} 
              variant="outline"
              className="w-full"
            >
              Unblock Course
            </Button>
          ) : (
            <Button 
              onClick={handleBlockCourse} 
              variant="destructive"
              className="w-full"
            >
              Block Course
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  )
}