import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Category } from '@/models/Category';
// import { isTeacher } from '@/lib/teacher';

export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name) {
      return new NextResponse('name is required', { status: 400 });
    }

    await connectDB();

    const category = new Category({
      name
    });

    await category.save();

    return NextResponse.json(category);
  } catch (error) {
    console.error('[Category]', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
