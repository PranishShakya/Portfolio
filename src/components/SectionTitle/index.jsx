
import Picture from "../Pictures";

const BodyTitle = () => {
  return (
    <>
      <div className="min-h-screen pt-20">
        <div className="text-white text-5xl pt-30 px-25 font-bold">
          <h1>Hello.</h1>
        </div>
        <div className="flex items-center gap-4 pt-5">
          <div className="w-30 h-0.5 bg-orange-400"></div>
          <h1 className="text-white text-4xl font-semibold">
            I’m Pranish Shakya
          </h1>
        </div>

        <div className="text-white text-5xl pt-5 px-25 font-bold">
          <h1>Software Developer</h1>
        </div>
        <div className="flex text-white gap-7 pt-20 px-25 text-20 pb-20 ">
          <button className="border pl-2 pr-2 h-8 bg-orange-500 cursor-pointer">
            Got a Project?
          </button>
          <a href="CV.pdf" type="button" className="border pt-1 text-white pl-2 pr-2 h-8 cursor-pointer transition-all duration-300 hover:bg-white hover:text-black">
            Resume
          </a>
        </div>
        <div className="flex relative justify-end">
          <Picture />
        </div>

        <div className=" container m-auto">
          <div className=" flex  bg-gray-900 h-14  items-center justify-center">
            {[
              "HTML",
              "CSS",
              "React",
              "Asp.Net(MVC)",
              "JavaScript",
              "GitHub",
            ].map((tech) => (
              <p key={tech} className="text-gray-500 px-10 text-2xl">
                {tech}
              </p>
            ))}
          </div>
        </div>


      </div>
      
    </>
  );
};

export default BodyTitle;
