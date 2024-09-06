import About from "./_components/AboutUs";
import Features from "./_components/Features";
import Footer from "./_components/Footer";
import HeroSection from "./_components/HeroSection";
import TeachOnCourseNet from "./_components/TeachOnCoursenet";
import AiChatButton from "@/components/AiChatButton";

export default function Home() {
  return (
    <>
      <HeroSection />
      <Features />
      <About />
      <TeachOnCourseNet />
      <Footer />
      <div className="fixed bottom-5 right-5 rounded-full bg-slate-300 p-2">
        <AiChatButton />
      </div>
    </>
  );
}
