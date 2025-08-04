import React from "react";
import BodyTitle from "../../components/SectionTitle";
import AboutPage from "../../components/About";
import Body from "../../components/Body";

const HomePage = () => {
  return (
    <div className="min-h-screen scroll-smooth">
      {/* Home Section */}
      <section id="home" className="h-screen">
        <Body title="Home" />
      </section>

      {/* About Section */}
      <section id="about" className="min-h-screen scroll-mt-20">
        <div title="About" />
      </section>

      {/* Project Section */}
      <section id="projects" className="min-h-screen scroll-mt-45">
        <div title="Projects" />
      </section>

       {/* Contact Section */}
      <section id="contact" className="min-h-screen scroll-mt-50">
        <div title="Contact" />
      </section>
    </div>
  );
};

export default HomePage;
