import React from "react";
import { useOutletContext } from "react-router";
import BodyTitle from "../../components/SectionTitle";
import AboutPage from "../../components/About";
import Projects from "../../components/Projects";
import Contact from "../../components/Contact";
import ThemeToggler from "../../components/ThemeToggler";

const HomePage = () => {
  const { theme, setTheme } = useOutletContext();

  return (
    <div className="min-h-screen scroll-smooth text-white bg-grid-pattern relative overflow-hidden transition-colors duration-500">
      
      {/* Background Graphic Accents (Floating Glow Blobs) */}
      <div className="absolute top-[10%] left-[-15%] w-72 h-72 md:w-[450px] md:h-[450px] rounded-full bg-orange-500/10 blur-[90px] md:blur-[140px] pointer-events-none -z-10 animate-float"></div>
      <div className="absolute top-[35%] right-[-15%] w-96 h-96 md:w-[500px] md:h-[500px] rounded-full bg-orange-600/5 blur-[100px] md:blur-[150px] pointer-events-none -z-10"></div>
      <div className="absolute top-[65%] left-[5%] w-80 h-80 md:w-[400px] md:h-[400px] rounded-full bg-orange-500/5 blur-[90px] md:blur-[130px] pointer-events-none -z-10 animate-float"></div>
      <div className="absolute bottom-[5%] right-[-10%] w-96 h-96 md:w-[450px] md:h-[450px] rounded-full bg-orange-600/8 blur-[100px] md:blur-[140px] pointer-events-none -z-10"></div>

      {/* Home Hero Section */}
      <section id="home" className="min-h-screen flex flex-col justify-center relative">
        <BodyTitle />
      </section>

      {/* About Section */}
      <section id="about" className="min-h-screen flex flex-col justify-start scroll-mt-20 pt-28 pb-20 relative">
        <AboutPage />
      </section>

      {/* Project Section */}
      <section id="projects" className="min-h-screen flex flex-col justify-start scroll-mt-20 pt-28 pb-20 relative">
        <Projects />
      </section>

       {/* Contact Section */}
      <section id="contact" className="min-h-screen flex flex-col justify-start items-center scroll-mt-20 pt-28 pb-20 relative bg-gray-950/20">
        <Contact />
      </section>

      {/* Theme Atmosphere Control Section */}
      <section id="theme-control" className="py-20 flex flex-col justify-center items-center relative border-t border-gray-900 bg-gray-950/40 px-6">
        <ThemeToggler theme={theme} setTheme={setTheme} />
      </section>
    </div>
  );
};

export default HomePage;


