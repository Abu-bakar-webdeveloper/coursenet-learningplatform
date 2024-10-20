'use client'

import * as z from 'zod'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormMessage,
  FormControl,
} from '@/components/ui/form'

interface TeacherInfoFormProps {
  initialData?: {
    userId?: string
    fullName?: string
    bio?: string
    experience?: number
    expertise?: string[]
    socialLinks?: string[]
  }
}

const formSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters'),
  bio: z
    .string()
    .min(10, 'Bio must be at least 10 characters')
    .max(1000, 'Bio must be less than 1000 characters'),
  experience: z
    .number()
    .min(0, 'Experience must be a positive number')
    .max(100, 'Experience must be less than 100 years'),
  expertise: z.string().refine((val) => val.split(',').length > 0, 'At least one expertise is required'),
  socialLinks: z.string().optional(),
})

const TeacherInfoForm = ({ initialData }: TeacherInfoFormProps) => {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: initialData?.fullName || '',
      bio: initialData?.bio || '',
      experience: initialData?.experience || 0,
      expertise: initialData?.expertise?.join(', ') || '',
      socialLinks: initialData?.socialLinks?.join(', ') || '',
    },
  })

  const { isSubmitting, isValid } = form.formState

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post('/api/teacherInfo', {
        ...values,
        expertise: values.expertise.split(',').map((item) => item.trim()),
        socialLinks: values.socialLinks
          ? values.socialLinks.split(',').map((item) => item.trim())
          : [],
      })
      toast.success('Teacher information updated')
      router.push('/teacher/courses')
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  return (
    <div className="p-4 mt-6 border rounded-md bg-slate-100">
      <div className="flex items-center justify-between font-medium">
        <span>Teacher Information</span>
      </div>

      <Form {...form}>
        <form className="mt-4 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="fullName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    placeholder="Your full name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="bio"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={isSubmitting}
                    placeholder="Tell us about yourself"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="experience"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience (years)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    disabled={isSubmitting}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="expertise"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expertise (comma-separated)</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    placeholder="e.g. JavaScript, React, Node.js"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="socialLinks"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Social Links (comma-separated)</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    placeholder="https://twitter.com/username, https://linkedin.com/in/username"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

            <div className="flex items-center gap-x-2">
              <Button disabled={isSubmitting || !isValid} type="submit">
                Save
              </Button>
            </div>
        </form>
      </Form>
    </div>
  )
}

export default TeacherInfoForm
