import React from "react";
import { DiAtom, DiFirebase, DiDigitalOcean } from "react-icons/di";

const AboutPage = () => {
  const skills = [
    {
      title: "Software Development",
      description: "Building responsive frontend architectures and clean backend structures using React.js and ASP.NET Core.",
      icon: <DiAtom className="text-3xl" />,
    },
    {
      title: "Database Management",
      description: "Structuring optimized relational database schemas, writing complex queries, and ensuring secure backups.",
      icon: <DiFirebase className="text-3.5xl" />,
    },
    {
      title: "Website Hosting",
      description: "Configuring server runtimes, deploying web builds, and managing domain configurations and SSL layers.",
      icon: <DiDigitalOcean className="text-3xl" />,
    },
  ];

  const stats = [
    { value: "5+", label: "Completed Projects" },
    { value: "6+", label: "Months Experience" },
    { value: "4+", label: "Tech Mastered" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
      
      {/* Section Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          About <span className="text-orange-500">Me</span>
        </h2>
        <div className="w-20 h-1 bg-orange-500 mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        
        {/* Left Column: Premium Vertical Timeline */}
        <div className="relative pl-8 md:pl-10 space-y-8">
          {/* Central Vertical Connector Line */}
          <div className="absolute left-4 md:left-5 top-2 bottom-2 w-0.5 bg-gradient-to-b from-orange-500 via-orange-500/50 to-orange-500/10"></div>
          
          {skills.map((skill, index) => (
            <div key={index} className="relative group">
              {/* Stepper Node Bullet */}
              <div className="absolute -left-8 md:-left-10 top-1 w-8 h-8 rounded-full border border-orange-500/30 bg-black flex items-center justify-center text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.15)] group-hover:border-orange-500 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all duration-300 z-10">
                {skill.icon}
              </div>
              
              {/* Skill Details Card */}
              <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800/80 rounded-xl p-5 ml-4 hover:border-orange-500/20 hover:bg-gray-900/40 transition-all duration-300 transform group-hover:-translate-y-1">
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-orange-500 transition-colors">
                  {skill.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {skill.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Bio Card and Interactive Stats */}
        <div className="space-y-8">
          
          {/* Bio Glassmorphic Card */}
          <div className="bg-gray-900/60 backdrop-blur-md border border-gray-700/80 rounded-2xl p-8 shadow-xl relative overflow-hidden">
            {/* Ambient soft glow inside bio */}
            <div className="absolute -top-10 -right-10 w-36 h-36 bg-orange-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-4">
              Hello! I'm <strong className="text-orange-400 font-semibold">Pranish Shakya</strong>, a tech enthusiast with a growing interest in modern web development and software solutions.
            </p>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              I enjoy designing responsive frontends, building secure databases, and resolving complex problems through code. My current stack revolves around the React ecosystem and ASP.NET Core, with a commitment to delivering clean, user-friendly, and accessible interfaces.
            </p>
          </div>

          {/* Graphical Counter Widgets Grid */}
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat, i) => (
              <div 
                key={i} 
                className="bg-gray-900/20 backdrop-blur-sm border border-gray-850 hover:border-orange-500/30 rounded-xl p-4 text-center hover:bg-gray-900/30 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="text-3xl md:text-4xl font-black text-orange-500 mb-1 select-none">
                  {stat.value}
                </div>
                <div className="text-[10px] md:text-xs text-gray-500 font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};

export default AboutPage;

