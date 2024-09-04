import About from "./_components/AboutUs";
import Features from "./_components/Features";
import Footer from "./_components/Footer";
import HeroSection from "./_components/HeroSection";
import TeachOnCourseNet from "./_components/TeachOnCoursenet";

export default function Home() {
  return (
    <>
      <HeroSection />
      <Features />
      <About />
      <TeachOnCourseNet />
      <Footer />
    </>
  );
}
