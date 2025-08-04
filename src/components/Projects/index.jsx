import React from "react";

const Projects = () => {
  return (
    <>
      <div className="flex  md:flex-row mt-25 px-10 text-white w-h-screen items-center justify-center">
        <h1 className="text-5xl font-bold">My Projects</h1>
      </div>
      <div className="flex flex-col items-center justify-center text-center text-white bg-gray-900 p-10 rounded-2xl shadow-lg w-full max-w-2xl mx-auto mt-20">
  <h1 className="text-4xl font-semibold text-orange-500 mb-4">
    You can find my projects here:
  </h1>
  <a
    href="https://github.com/PranishShakya"
    target="_blank"
    rel="noopener noreferrer"
    className="text-2xl text-orange-400 hover:text-white transition duration-300 underline underline-offset-4"
  >
    github.com/PranishShakya
  </a>
</div>

    </>
  );
};

export default Projects;
