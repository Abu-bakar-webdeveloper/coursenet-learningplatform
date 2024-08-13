const Features = () => {
    const features = [
      { title: "Interactive Courses", description: "Learn at your own pace with interactive content." },
      { title: "Expert Instructors", description: "Get guided by top instructors from around the world." },
      { title: "Certifications", description: "Receive certifications for the courses you complete." },
    ];
  
    return (
      <section className="py-20">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-primary">Features</h2>
          <div className="mt-10 grid md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div key={index} className="p-6 border rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-primary">{feature.title}</h3>
                <p className="mt-4 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default Features;
  