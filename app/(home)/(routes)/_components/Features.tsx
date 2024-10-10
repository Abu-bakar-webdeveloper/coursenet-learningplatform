import { FaGraduationCap, FaGlobe, FaHome, FaBookOpen } from 'react-icons/fa';

const Features = () => {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-primary mb-10">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Service 1 */}
          <div className="group service-item text-center p-6 bg-blue-200 shadow-lg rounded-lg transition-all duration-500 hover:mt-[-10px] hover:bg-blue-400">
            <div className="flex justify-center items-center mb-4 text-primary text-5xl transition-all duration-500 group-hover:text-light">
              <FaGraduationCap />
            </div>
            <h5 className="text-xl font-semibold mb-3 transition-all duration-500 group-hover:text-light">
              Skilled Instructors
            </h5>
            <p className="text-gray-500 transition-all duration-500 group-hover:text-light">
              Diam elitr kasd sed at elitr sed ipsum justo dolor sed clita amet diam
            </p>
          </div>

          {/* Service 2 */}
          <div className="group service-item text-center p-6 bg-blue-200 shadow-lg rounded-lg transition-all duration-500 hover:mt-[-10px] hover:bg-blue-400">
            <div className="flex justify-center items-center mb-4 text-primary text-5xl transition-all duration-500 group-hover:text-light">
              <FaGlobe />
            </div>
            <h5 className="text-xl font-semibold mb-3 transition-all duration-500 group-hover:text-light">
              Online Classes
            </h5>
            <p className="text-gray-500 transition-all duration-500 group-hover:text-light">
              Diam elitr kasd sed at elitr sed ipsum justo dolor sed clita amet diam
            </p>
          </div>

          {/* Service 3 */}
          <div className="group service-item text-center p-6 bg-blue-200 shadow-lg rounded-lg transition-all duration-500 hover:mt-[-10px] hover:bg-blue-400">
            <div className="flex justify-center items-center mb-4 text-primary text-5xl transition-all duration-500 group-hover:text-light">
              <FaHome />
            </div>
            <h5 className="text-xl font-semibold mb-3 transition-all duration-500 group-hover:text-light">
              Home Projects
            </h5>
            <p className="text-gray-500 transition-all duration-500 group-hover:text-light">
              Diam elitr kasd sed at elitr sed ipsum justo dolor sed clita amet diam
            </p>
          </div>

          {/* Service 4 */}
          <div className="group service-item text-center p-6 bg-blue-200 shadow-lg rounded-lg transition-all duration-500 hover:mt-[-10px] hover:bg-blue-400">
            <div className="flex justify-center items-center mb-4 text-primary text-5xl transition-all duration-500 group-hover:text-light">
              <FaBookOpen />
            </div>
            <h5 className="text-xl font-semibold mb-3 transition-all duration-500 group-hover:text-light">
              Book Library
            </h5>
            <p className="text-gray-500 transition-all duration-500 group-hover:text-light">
              Diam elitr kasd sed at elitr sed ipsum justo dolor sed clita amet diam
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
