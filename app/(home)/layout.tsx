'use client'
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { ReactNode } from "react";
import AiChatButton from "@/components/AiChatButton";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const Links = [
    { name: "Home", link: "/" },
    { name: "Courses", link: "/student" },
    { name: "Teacher", link: "/teacher/courses" },
    { name: "Projects", link: "#projects" },
    { name: "Contact", link: "#contact" },
  ];

  return (
    <>
      <div className="shadow-md w-full top-0 left-0 bg-white">
        <div className="md:flex items-center justify-between py-4 md:px-10 px-7">
          <div className="text-2xl font-bold flex items-center font-[Poppins] text-primary">
            <Link href="/">CourseNet</Link>
          </div>
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-2xl absolute right-12 top-5 cursor-pointer text-primary"
          >
            {isOpen ? <X /> : <Menu />}
          </div>
          <ul
            className={`md:flex md:items-center md:pb-0 pb-12 absolute md:static md:z-auto z-10
              left-0 w-full md:w-auto md:pl-0 pl-9 transition-all bg-white
              duration-500 ease-in ${isOpen ? "top-20 opacity-100" : "top-[-490px]"} md:opacity-100 opacity-0`}
          >
            {Links.map((link) => (
              <li key={link.name} className="md:ml-8 text-xl md:my-0 my-7">
                <Link href={link.link} className="text-primary hover:text-secondary duration-500">
                  {link.name}
                </Link>
              </li>
            ))}
            <div className="ml-5">
              <UserButton />
            </div>
            <div className="ml-5">
              <AiChatButton />
            </div>
          </ul>
        </div>
      </div>
      <main>{children}</main>
    </>
  );
};

export default Layout;
