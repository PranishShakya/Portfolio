// Default projects for Pranish Shakya's portfolio
const DEFAULT_PROJECTS = [
  {
    id: "default-1",
    title: "Personal Portfolio Website",
    description: "A premium, fully responsive portfolio website featuring a dark-theme aesthetic, dynamic scrolling, custom resume uploader, and in-browser project management system.",
    technologies: ["React", "Tailwind CSS", "Vite", "LocalStorage API"],
    githubLink: "https://github.com/PranishShakya",
    liveLink: "#",
    image: "" // Empty will fallback to a beautiful CSS gradient block
  },
  {
    id: "default-2",
    title: "ASP.NET Core MVC E-Commerce",
    description: "A complete online shopping platform built with ASP.NET MVC, featuring product catalogs, secure shopping cart workflows, user authentication, and administrator dashboards.",
    technologies: ["ASP.NET MVC", "C#", "SQL Server", "CSS"],
    githubLink: "https://github.com/PranishShakya",
    liveLink: "#",
    image: ""
  },
  {
    id: "default-3",
    title: "Database Administration Panel",
    description: "A secure database management interface designed for optimizing relational query runtimes, running backups, and managing transactional integrity.",
    technologies: ["C#", "SQL Server", "Entity Framework", "JavaScript"],
    githubLink: "https://github.com/PranishShakya",
    liveLink: "#",
    image: ""
  }
];

const RESUME_KEY = "pranish_portfolio_resume";
const PROJECTS_KEY = "pranish_portfolio_projects";

export const getResume = () => {
  try {
    return localStorage.getItem(RESUME_KEY) || "";
  } catch (e) {
    console.error("Failed to load resume from localStorage:", e);
    return "";
  }
};

export const saveResume = (base64Data) => {
  try {
    localStorage.setItem(RESUME_KEY, base64Data);
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("portfolio-resume-updated"));
    return true;
  } catch (e) {
    console.error("Failed to save resume to localStorage:", e);
    return false;
  }
};

export const getProjects = () => {
  try {
    const stored = localStorage.getItem(PROJECTS_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_PROJECTS;
  } catch (e) {
    console.error("Failed to load projects from localStorage:", e);
    return DEFAULT_PROJECTS;
  }
};

export const saveProjects = (projects) => {
  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("portfolio-projects-updated"));
    return true;
  } catch (e) {
    console.error("Failed to save projects to localStorage:", e);
    return false;
  }
};

export const addProject = (project) => {
  const projects = getProjects();
  const newProject = {
    ...project,
    id: `project-${Date.now()}`
  };
  const updated = [newProject, ...projects];
  return saveProjects(updated);
};

export const updateProject = (updatedProject) => {
  const projects = getProjects();
  const updated = projects.map(p => p.id === updatedProject.id ? updatedProject : p);
  return saveProjects(updated);
};

export const deleteProject = (id) => {
  const projects = getProjects();
  const updated = projects.filter(p => p.id !== id);
  return saveProjects(updated);
};

export const resetPortfolio = () => {
  try {
    localStorage.removeItem(RESUME_KEY);
    localStorage.removeItem(PROJECTS_KEY);
    window.dispatchEvent(new Event("portfolio-resume-updated"));
    window.dispatchEvent(new Event("portfolio-projects-updated"));
    return true;
  } catch (e) {
    console.error("Failed to reset localStorage:", e);
    return false;
  }
};
