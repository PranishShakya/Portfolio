import React, { useState, useEffect } from "react";
import Picture from "../Pictures";
import { subscribeToResume } from "../../utils/portfolioStorage";

const BodyTitle = () => {
  const [resumeUrl, setResumeUrl] = useState("CV.pdf");

  useEffect(() => {
    const unsubscribe = subscribeToResume((url) => {
      if (url) {
        setResumeUrl(
          url.startsWith("data:") || url.startsWith("http")
            ? url
            : `data:application/pdf;base64,${url}`
        );
      } else {
        setResumeUrl("CV.pdf");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 w-full pt-20 md:pt-24 pb-8">
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 lg:gap-12">
        {/* Left Column: Intro text */}
        <div className="w-full md:w-3/5 text-left flex flex-col justify-center">
          <div className="text-orange-500 font-bold text-lg mb-2 uppercase tracking-widest">
            Hello, Welcome
          </div>
          
          <div className="text-white text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
            I'm <span className="text-orange-500">Pranish Shakya</span>
          </div>

          <div className="text-gray-300 text-2xl sm:text-3xl font-semibold mb-6">
            Software Developer
          </div>
          
          <p className="text-gray-400 text-lg max-w-xl mb-8 leading-relaxed">
            I craft high-performance, beautiful, and accessible web solutions. Specialize in ASP.NET Core, React ecosystem, and robust database architectures.
          </p>

          <div className="flex items-center flex-wrap gap-4 mb-6">
            <a 
              href="#contact"
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-orange-500/20 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer text-center"
            >
              Got a Project?
            </a>
            
            <a 
              href={resumeUrl}
              download="Pranish_Shakya_CV.pdf"
              className="px-6 py-3 border border-gray-600 hover:border-orange-500 text-white hover:text-orange-500 font-semibold rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer text-center"
            >
              Download Resume
            </a>
          </div>
        </div>

        {/* Right Column: Profile Picture with Solar System */}
        <div className="w-full md:w-1/2 flex justify-center items-center overflow-visible py-10 md:py-0">
          <Picture />
        </div>
      </div>

      {/* Tech Stack Horizontal Carousel / Bar */}
      <div className="mt-6 border-t border-b border-gray-800 py-4 bg-gray-900/30 rounded-xl px-4 overflow-hidden">
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 items-center">
          {[
            "HTML5",
            "CSS3",
            "React",
            "ASP.NET MVC",
            "JavaScript",
            "GitHub",
          ].map((tech) => (
            <span 
              key={tech} 
              className="text-gray-500 hover:text-orange-500/80 font-bold text-xl md:text-2xl tracking-wider transition-colors duration-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BodyTitle;

