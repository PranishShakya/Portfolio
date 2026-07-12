import React, { useState, useEffect } from "react";
import Picture from "../Pictures";
import { subscribeToResume } from "../../utils/portfolioStorage";

const BodyTitle = () => {
  const [resumeUrl, setResumeUrl] = useState("CV.pdf");
  const [isPictureHovered, setIsPictureHovered] = useState(false);

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
          <div className={`text-orange-500 font-bold text-lg mb-2 uppercase tracking-widest pull-item ${isPictureHovered ? "pulled-1" : ""}`}>
            Hello, Welcome
          </div>
          
          <div className={`text-white text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 pull-item ${isPictureHovered ? "pulled-2" : ""}`}>
            I'm <span className="text-orange-500">Pranish Shakya</span>
          </div>

          <div className={`text-gray-300 text-2xl sm:text-3xl font-semibold mb-6 pull-item ${isPictureHovered ? "pulled-3" : ""}`}>
            Software Developer
          </div>
          
          <p className={`text-gray-400 text-lg max-w-xl mb-8 leading-relaxed pull-item ${isPictureHovered ? "pulled-4" : ""}`}>
            I craft high-performance, beautiful, and accessible web solutions. Specialize in ASP.NET Core, React ecosystem, and robust database architectures.
          </p>

          <div className={`flex items-center flex-wrap gap-4 mb-6 pull-item ${isPictureHovered ? "pulled-5" : ""}`}>
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
          <Picture onHoverChange={setIsPictureHovered} />
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

      {/* ── Keyframes & Dynamic Pull Classes ───────────────────── */}
      <style>{`
        /* Staggered pull classes for tug of war suction effect */
        .pull-item {
          transition: transform 0.8s cubic-bezier(0.25, 1, 0.2, 1.05), opacity 0.6s, filter 0.6s;
          transform-origin: right center;
          will-change: transform, opacity, filter;
        }
        
        @media (min-width: 768px) {
          .pulled-1 { transform: translate(40px, 0px) scaleX(0.96) skewX(-4deg); opacity: 0.95; }
          .pulled-2 { transform: translate(85px, 0px) scaleX(0.92) skewX(-7deg); opacity: 0.88; filter: blur(0.5px); }
          .pulled-3 { transform: translate(125px, 0px) scaleX(0.88) skewX(-10deg); opacity: 0.8; filter: blur(0.8px); }
          .pulled-4 { transform: translate(160px, 0px) scaleX(0.84) skewX(-13deg); opacity: 0.72; filter: blur(1.2px); }
          .pulled-5 { transform: translate(190px, 0px) scaleX(0.8) skewX(-16deg); opacity: 0.65; filter: blur(1.6px); }
        }
        
        @media (max-width: 767px) {
          .pull-item {
            transform-origin: center top;
          }
          .pulled-1 { transform: translate(0px, -25px) scaleY(0.96) skewY(-2deg); opacity: 0.95; }
          .pulled-2 { transform: translate(0px, -55px) scaleY(0.92) skewY(-4deg); opacity: 0.88; filter: blur(0.5px); }
          .pulled-3 { transform: translate(0px, -80px) scaleY(0.88) skewY(-6deg); opacity: 0.8; filter: blur(0.8px); }
          .pulled-4 { transform: translate(0px, -105px) scaleY(0.84) skewY(-8deg); opacity: 0.72; filter: blur(1.2px); }
          .pulled-5 { transform: translate(0px, -125px) scaleY(0.8) skewY(-10deg); opacity: 0.65; filter: blur(1.6px); }
        }
      `}</style>
    </div>
  );
};

export default BodyTitle;

