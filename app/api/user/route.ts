import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import User from '@/models/User'

export async function POST(request: Request) {
  try {
    await connectDB()
    
    const { userId, username, email, numberOfCourses, courses } = await request.json()

    console.log('Request body:', { userId, username, email, numberOfCourses, courses })

    if (!userId || !email) {
      console.error('Missing required fields:', { userId, email })
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    const existingUser = await User.findOne({ userId })
    if (existingUser) {
      console.log('User already exists:', existingUser)
      return NextResponse.json({ message: 'User already exists' }, { status: 400 })
    }

    const newUser = new User({
      userId,
      username, // This can be undefined now
      email,
      numberOfCourses,
      courses,
    })

    const savedUser = await newUser.save()
    console.log('User saved:', savedUser)

    return NextResponse.json({ message: 'User saved successfully', user: savedUser }, { status: 201 })
  } catch (error) {
    console.error('Error saving user:', error)
    return NextResponse.json({ message: 'Server error', error }, { status: 500 })
  }
}