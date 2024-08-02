"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { UserButton, useAuth } from "@clerk/nextjs";

// import { isTeacher } from '@/lib/teacher'
// import { SearchInput } from './search-input'
import { Button } from "@/components/ui/button";

export const NavbarRoutes = () => {
  const { userId } = useAuth();
  const pathname = usePathname();

  //   const isSearchPage = pathname === '/search'
  const isCoursePage = pathname?.includes("/courses");
  const isTeacherPage = pathname?.startsWith("/teacher");

  return (
    <>
      <div className="flex ml-auto gap-x-2">
        {isTeacherPage || isCoursePage ? (
          <Link href="/">
            <Button size="sm" variant="ghost">
              <LogOut className="w-4 h-4 mr-2" />
              <span>Exit</span>
            </Button>
          </Link>
        ) : (
          <Link href="/teacher/courses">
            <Button size="sm" variant="ghost">
              Teacher Mode
            </Button>
          </Link>
        )}

        <UserButton />
      </div>
    </>
  );
};