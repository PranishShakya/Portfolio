import React, { useState, useEffect } from "react";
import { FaGithub, FaExternalLinkAlt, FaTrash, FaEdit } from "react-icons/fa";
import { subscribeToProjects, deleteProject } from "../../utils/portfolioStorage";

const Projects = () => {
  const [projectsList, setProjectsList] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminMode = () => {
    try {
      setIsAdmin(localStorage.getItem("pranish_admin_mode") === "true");
    } catch (e) {
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    // Subscribe to real-time Firestore updates
    const unsubscribe = subscribeToProjects(setProjectsList);
    checkAdminMode();

    window.addEventListener("portfolio-admin-mode-updated", checkAdminMode);

    return () => {
      unsubscribe();
      window.removeEventListener("portfolio-admin-mode-updated", checkAdminMode);
    };
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await deleteProject(id);
    }
  };

  const handleEdit = (project) => {
    const event = new CustomEvent("portfolio-edit-project", { detail: project });
    window.dispatchEvent(event);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Featured <span className="text-orange-500">Projects</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Here is a selection of projects I've built. Toggle Edit Mode in the bottom corner to upload your own.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projectsList.map((project) => (
          <div 
            key={project.id}
            className="group bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-orange-500/5 hover:border-orange-500/30 transition-all duration-300 flex flex-col h-full"
          >
            {/* Project Image */}
            <div className="h-48 w-full relative overflow-hidden bg-gray-800/40 border-b border-gray-800/60">
              {project.image ? (
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-900 to-orange-950/20 flex items-center justify-center p-4">
                  <span className="text-gray-600 font-bold text-5xl tracking-widest select-none">
                    {project.title.split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase()}
                  </span>
                </div>
              )}
              
              {/* Admin overlays */}
              {isAdmin && (
                <div className="absolute top-3 right-3 flex gap-2 z-10">
                  <button 
                    onClick={() => handleEdit(project)}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-md cursor-pointer"
                    title="Edit Project"
                  >
                    <FaEdit size={14} />
                  </button>
                  <button 
                    onClick={() => handleDelete(project.id)}
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors shadow-md cursor-pointer"
                    title="Delete Project"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Project Info */}
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-500 transition-colors">
                {project.title}
              </h3>
              
              <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                {project.description}
              </p>

              {/* Technologies */}
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech, i) => (
                    <span 
                      key={i}
                      className="px-2.5 py-1 text-xs font-semibold bg-gray-800/80 text-orange-400 border border-gray-700/50 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              {/* Links */}
              <div className="flex items-center gap-4 mt-auto pt-4 border-t border-gray-800/60">
                {project.githubLink && project.githubLink !== "#" && (
                  <a 
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    <FaGithub size={16} /> Code
                  </a>
                )}
                {project.liveLink && (
                  <a 
                    href={project.liveLink}
                    target={project.liveLink === "#" ? "_self" : "_blank"}
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-300 hover:text-orange-500 transition-colors ml-auto"
                  >
                    Demo <FaExternalLinkAlt size={12} />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-12">
        <p className="text-gray-500 text-sm">
          Want to see more? View my full activity history on{" "}
          <a
            href="https://github.com/PranishShakya"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-500 hover:underline inline-flex items-center gap-1"
          >
            GitHub <FaGithub size={12} />
          </a>
        </p>
      </div>
    </div>
  );
};

export default Projects;
