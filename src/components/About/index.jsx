import React from "react";
import { DiAtom, DiFirebase, DiDigitalOcean } from "react-icons/di";

const AboutPage = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row mt-10 px-10">
        {/* Left Timeline Section */}
        <div className="w-full md:w-1/2">
          <div className="flex">
            <div className="text-orange-500 bg-orange-500 border h-20 w-1.5 ml-10 mt-5"></div>
            <div className="flex text-orange-500 text-5xl mx-5 mt-10">
              <DiAtom />
              <span className="ml-5 text-2xl mt-2.5 text-white font-semibold">
                Software Development
              </span>
            </div>
          </div>

          <div className="bg-orange-500 w-2 h-2 rounded-full ml-10 mt-2"></div>

          <div className="flex">
            <div className="text-orange-500 bg-orange-500 border h-20 w-1.5 ml-10 mt-2"></div>
            <div className="flex text-orange-500 text-6xl mx-3 mt-5">
              <DiFirebase />
              <span className="text-2xl ml-5 text-white mt-4 font-semibold">
                Database Management
              </span>
            </div>
          </div>

          <div className="bg-orange-500 w-2 h-2 rounded-full ml-10 mt-2"></div>

          <div className="flex">
            <div className="text-orange-500 bg-orange-500 border h-20 w-1.5 ml-10 mt-2"></div>
            <div className="flex text-orange-500 text-5xl mx-5 mt-5">
              <DiDigitalOcean />
              <span className="text-2xl ml-6 mt-2 text-white font-semibold">
                Website Hosting
              </span>
            </div>
          </div>
        </div>

        {/* Right About Me Section */}
        <div className="w-full md:w-1/2 mt-10 md:mt-0 md:pl-20">
          <h1 className="text-white text-5xl font-bold mb-6">About me</h1>
          <p className="text-white text-3sm leading-relaxed">
            Hello! I'm Pranish Shakya, a tech enthusiast with a growing interest
            in web development and software solutions. I enjoy working on
            creative projects, solving real-world problems through code, and
            continuously improving my skills. I'm currently focused on building
            beautiful, responsive, and user-friendly web applications.
          </p>
        </div>
      </div>

      <div className="text-white mt-10 flex flex-wrap  gap-8 px-4  items-center justify-center ">
        <div className="text-center">
          <h1 className="flex items-center justify-center font-bold text-5xl gap-2 ">
            5 <span className="font-bold text-orange-500">+</span>
          </h1>
          <p className="max-w-[140px] mx-auto">Completed Projects</p>
        </div>

        <div className="text-center">
          <h1 className="flex items-center justify-center font-bold text-5xl gap-2 ">
            6 <span className="font-bold text-orange-500">+</span>
          </h1>
          <p className="max-w-[140px] mx-auto">Months of experience</p>
        </div>

        <div className="text-center">
          <h1 className="flex items-center justify-center font-bold text-5xl gap-2 ">
            4 <span className="font-bold text-orange-500">+</span>
          </h1>
          <p className="max-w-[140px] mx-auto">Technologies Learned</p>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
