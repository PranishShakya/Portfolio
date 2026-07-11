import { db, storage, auth, isFirebaseConfigured } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { signInAnonymously } from "firebase/auth";

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

// Ensure Firebase is anonymously authenticated when performing write operations
const ensureAuth = async () => {
  if (isFirebaseConfigured && auth && !auth.currentUser) {
    try {
      await signInAnonymously(auth);
    } catch (e) {
      console.error("Firebase Anonymous Auth failed:", e);
    }
  }
};

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
  } catch (e) {
    console.error("Failed to save resume to localStorage:", e);
    return false;
  }

  // Push to Firebase in background if configured
  if (isFirebaseConfigured && storage && db) {
    ensureAuth().then(async () => {
      try {
        const storageRef = ref(storage, "resumes/resume.pdf");
        const uploadResult = await uploadString(storageRef, base64Data, "data_url");
        const downloadUrl = await getDownloadURL(uploadResult.ref);
        
        await setDoc(doc(db, "cv", "latest"), {
          url: downloadUrl,
          updatedAt: new Date().toISOString(),
        });
        
        // Save the URL to localStorage to prevent quota issues
        localStorage.setItem(RESUME_KEY, downloadUrl);
        window.dispatchEvent(new Event("portfolio-resume-updated"));
      } catch (err) {
        console.error("Error uploading CV to Firebase:", err);
      }
    });
  }

  return true;
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
  const id = `project-${Date.now()}`;
  const newProject = {
    ...project,
    id
  };
  const updated = [newProject, ...projects];
  
  const success = saveProjects(updated);

  if (success && isFirebaseConfigured && db) {
    ensureAuth().then(async () => {
      try {
        await setDoc(doc(db, "projects", id), project);
      } catch (e) {
        console.error("Error saving new project to Firebase:", e);
      }
    });
  }

  return success;
};

export const updateProject = (updatedProject) => {
  const projects = getProjects();
  const updated = projects.map(p => p.id === updatedProject.id ? updatedProject : p);
  
  const success = saveProjects(updated);

  if (success && isFirebaseConfigured && db) {
    ensureAuth().then(async () => {
      try {
        const { id, ...data } = updatedProject;
        await setDoc(doc(db, "projects", id), data);
      } catch (e) {
        console.error("Error updating project in Firebase:", e);
      }
    });
  }

  return success;
};

export const deleteProject = (id) => {
  const projects = getProjects();
  const updated = projects.filter(p => p.id !== id);
  
  const success = saveProjects(updated);

  if (success && isFirebaseConfigured && db) {
    ensureAuth().then(async () => {
      try {
        await deleteDoc(doc(db, "projects", id));
      } catch (e) {
        console.error("Error deleting project from Firebase:", e);
      }
    });
  }

  return success;
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

// --- Firebase Sync Function ---
export const syncFromFirebase = async () => {
  if (!isFirebaseConfigured || !db) return;
  try {
    // 1. Fetch projects
    const snapshot = await getDocs(collection(db, "projects"));
    const projects = [];
    snapshot.forEach((docSnap) => {
      projects.push({
        id: docSnap.id,
        ...docSnap.data()
      });
    });

    if (projects.length > 0) {
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
      window.dispatchEvent(new Event("portfolio-projects-updated"));
    }

    // 2. Fetch CV
    const cvSnapshot = await getDocs(collection(db, "cv"));
    let cvUrl = "";
    cvSnapshot.forEach((docSnap) => {
      if (docSnap.id === "latest") {
        cvUrl = docSnap.data().url;
      }
    });

    if (cvUrl) {
      localStorage.setItem(RESUME_KEY, cvUrl);
      window.dispatchEvent(new Event("portfolio-resume-updated"));
    }
  } catch (e) {
    console.error("Failed to sync data from Firebase:", e);
  }
};

// Auto-trigger Firebase background synchronization on load
if (typeof window !== "undefined") {
  setTimeout(() => {
    syncFromFirebase();
  }, 100);
}
