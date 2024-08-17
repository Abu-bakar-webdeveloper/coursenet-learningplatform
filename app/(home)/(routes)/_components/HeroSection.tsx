import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="relative h-screen flex items-center text-white">
      <Image
        src="/bg.jpeg"
        alt="Background"
        fill
        className="-z-10"
      />
      <div className="container mx-auto">
        <div className="row">
          <div className="text-left">
            <h3 className="text-xl font-semibold text-gray-300">
              WELCOME TO COURSENET
            </h3>
            <h1 className="text-4xl font-bold text-white mt-2">
              Best Online Education Expertise
            </h1>
          </div>
          <p className="mt-4">
            Explore a wide range of courses and enhance your skills with our
            expert instructors.<br /> Join our learning community today and take the
            next step in your educational journey.
          </p>
          <div className="mt-8 flex flex-col md:flex-row gap-4">
            <Link
              href="/student"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full flex items-center justify-center"
            >
              VIEW COURSES <FaArrowRight className="ml-2" />
            </Link>
            <Link
              href="/teacher/courses"
              className="bg-white hover:bg-gray-200 text-blue-600 font-bold py-2 px-4 rounded-full flex items-center justify-center"
            >
              CREATE COURSES <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
      <div className="margin h-20 mt-10"></div>
    </section>
  );
};

export default HeroSection;
