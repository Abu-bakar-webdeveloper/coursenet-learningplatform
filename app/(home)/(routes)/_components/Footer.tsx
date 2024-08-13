const Footer = () => {
    return (
      <footer className="bg-primary text-white py-8">
        <div className="max-w-6xl mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} CourseNet. All rights reserved.</p>
          <div className="mt-4 space-x-4">
            <a href="#projects" className="hover:text-secondary">Projects</a>
            <a href="#contact" className="hover:text-secondary">Contact</a>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  