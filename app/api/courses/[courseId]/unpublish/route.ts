import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
// import { isTeacher } from "@/lib/teacher";
import { Course } from "@/models/Course";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    await connectDB(); // Ensure the database connection is established

    const { userId } = auth();
    const { courseId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find the course directly without populating
    const course = await Course.findOne({ _id: courseId, userId });

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Update the course to set isPublished to false
    const unpublishedCourse = await Course.findOneAndUpdate(
      { _id: courseId, userId },
      { isPublished: false },
      { new: true }
    );

    return NextResponse.json(unpublishedCourse);
  } catch (error) {
    console.error("[COURSE_ID_UNPUBLISH]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
