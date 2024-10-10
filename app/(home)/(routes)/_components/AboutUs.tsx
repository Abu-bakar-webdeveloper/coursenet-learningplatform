import Image from "next/image";
import { FaArrowRight } from 'react-icons/fa';

const About = () => {
    return (
      <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Image Section */}
          <div className="relative min-h-[400px] fade-in-up" style={{ animationDelay: '0.1s' }}>
          <Image
              src='/about.jpg'
              alt="About eLearning"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>

          {/* Text Section */}
          <div className="fade-in-up" style={{ animationDelay: '0.3s' }}>
            <h6 className="bg-blue-400 text-white inline-block py-1 px-3 rounded-lg mb-4 animate-bounce">
              About Us
            </h6>
            <h1 className="text-4xl font-bold text-gray-800 mb-6">
              Welcome to <span className="text-blue-500">eLEARNING</span>
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et eos.
              Clita erat ipsum et lorem et sit.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo justo magna dolore erat amet.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <FaArrowRight className="text-blue-400 mr-2" />
                Skilled Instructors
              </div>
              <div className="flex items-center text-gray-600">
                <FaArrowRight className="text-blue-400 mr-2" />
                Online Classes
              </div>
              <div className="flex items-center text-gray-600">
                <FaArrowRight className="text-blue-400 mr-2" />
                International Certificate
              </div>
              <div className="flex items-center text-gray-600">
                <FaArrowRight className="text-blue-400 mr-2" />
                Career Assistance
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    );
  };
  
  export default About;
  