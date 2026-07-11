import { db, auth, isFirebaseConfigured } from "../firebase";
import { supabase } from "../supabaseClient";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";

// Default projects shown when Firebase has no data yet
const DEFAULT_PROJECTS = [
  {
    id: "default-1",
    title: "Personal Portfolio Website",
    description:
      "A premium, fully responsive portfolio website featuring a dark-theme aesthetic, dynamic scrolling, custom resume uploader, and in-browser project management system.",
    technologies: ["React", "Tailwind CSS", "Vite", "Firebase"],
    githubLink: "https://github.com/PranishShakya",
    liveLink: "#",
    image: "",
  },
  {
    id: "default-2",
    title: "ASP.NET Core MVC E-Commerce",
    description:
      "A complete online shopping platform built with ASP.NET MVC, featuring product catalogs, secure shopping cart workflows, user authentication, and administrator dashboards.",
    technologies: ["ASP.NET MVC", "C#", "SQL Server", "CSS"],
    githubLink: "https://github.com/PranishShakya",
    liveLink: "#",
    image: "",
  },
  {
    id: "default-3",
    title: "Database Administration Panel",
    description:
      "A secure database management interface designed for optimizing relational query runtimes, running backups, and managing transactional integrity.",
    technologies: ["C#", "SQL Server", "Entity Framework", "JavaScript"],
    githubLink: "https://github.com/PranishShakya",
    liveLink: "#",
    image: "",
  },
];

// Ensure Firebase anonymous auth before Firestore writes
const ensureAuth = async () => {
  if (isFirebaseConfigured && auth && !auth.currentUser) {
    try {
      await signInAnonymously(auth);
    } catch (e) {
      console.error("Firebase Anonymous Auth failed:", e);
    }
  }
};

// ─── Supabase Storage helpers ─────────────────────────────────────────────

const SUPABASE_BUCKET = "uploads";

// Convert a base64 data URL (e.g. from FileReader) into a Blob for upload
const base64ToBlob = (base64Data) => {
  const [header, base64] = base64Data.split(",");
  const mimeMatch = header.match(/data:(.*);base64/);
  const mime = mimeMatch ? mimeMatch[1] : "application/octet-stream";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
};

/**
 * Upload a base64 data URL to Supabase Storage and return its public URL.
 * @param {string} base64Data - result of FileReader.readAsDataURL()
 * @param {string} path - path inside the bucket, e.g. "resumes/resume.pdf" or "projects/xyz.png"
 */
export const uploadToSupabase = async (base64Data, path) => {
  const blob = base64ToBlob(base64Data);
  const { error: uploadError } = await supabase.storage
    .from(SUPABASE_BUCKET)
    .upload(path, blob, { upsert: true, contentType: blob.type });

  if (uploadError) {
    console.error("Error uploading to Supabase:", uploadError);
    return null;
  }

  const { data } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(path);
  return data?.publicUrl || null;
};

/**
 * Delete a file from Supabase Storage.
 * @param {string} path - path inside the bucket, e.g. "projects/xyz.png"
 */
export const deleteFromSupabase = async (path) => {
  if (!path) return true;
  const { error } = await supabase.storage.from(SUPABASE_BUCKET).remove([path]);
  if (error) {
    console.error("Error deleting from Supabase:", error);
    return false;
  }
  return true;
};

// ─── Projects ────────────────────────────────────────────────────────────────

/**
 * Subscribe to real-time project updates from Firestore.
 * Returns an unsubscribe function.
 * Falls back to DEFAULT_PROJECTS if Firebase is not configured.
 */
export const subscribeToProjects = (callback) => {
  if (!isFirebaseConfigured || !db) {
    callback(DEFAULT_PROJECTS);
    return () => { };
  }

  const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const projects = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(projects.length > 0 ? projects : DEFAULT_PROJECTS);
    },
    (error) => {
      console.error("Error listening to projects:", error);
      callback(DEFAULT_PROJECTS);
    }
  );

  return unsubscribe;
};

/**
 * Add a new project. If `project.image` is a base64 data URL, it is uploaded
 * to Supabase Storage first, and the resulting public URL is stored instead.
 */
export const addProject = async (project) => {
  if (!isFirebaseConfigured || !db) {
    console.warn("Firebase not configured. Cannot save project.");
    return false;
  }
  await ensureAuth();
  try {
    const id = `project-${Date.now()}`;

    let imageUrl = project.image || "";
    if (imageUrl.startsWith("data:")) {
      const path = `projects/${id}.png`;
      const uploadedUrl = await uploadToSupabase(imageUrl, path);
      imageUrl = uploadedUrl || "";
    }

    await setDoc(doc(db, "projects", id), {
      ...project,
      image: imageUrl,
      createdAt: new Date().toISOString(),
    });
    return true;
  } catch (e) {
    console.error("Error adding project to Firebase:", e);
    return false;
  }
};

/**
 * Update an existing project. If `updatedProject.image` is a new base64 data URL,
 * it is uploaded to Supabase Storage (overwriting the old file at the same path).
 */
export const updateProject = async (updatedProject) => {
  if (!isFirebaseConfigured || !db) {
    console.warn("Firebase not configured. Cannot update project.");
    return false;
  }
  await ensureAuth();
  try {
    const { id, ...data } = updatedProject;

    let imageUrl = data.image || "";
    if (imageUrl.startsWith("data:")) {
      const path = `projects/${id}.png`;
      const uploadedUrl = await uploadToSupabase(imageUrl, path);
      imageUrl = uploadedUrl || "";
    }

    await setDoc(doc(db, "projects", id), { ...data, image: imageUrl }, { merge: true });
    return true;
  } catch (e) {
    console.error("Error updating project in Firebase:", e);
    return false;
  }
};

export const deleteProject = async (id) => {
  if (!isFirebaseConfigured || !db) {
    console.warn("Firebase not configured. Cannot delete project.");
    return false;
  }
  await ensureAuth();
  try {
    await deleteFromSupabase(`projects/${id}.png`);
    await deleteDoc(doc(db, "projects", id));
    return true;
  } catch (e) {
    console.error("Error deleting project from Firebase:", e);
    return false;
  }
};

// ─── Resume / CV ─────────────────────────────────────────────────────────────

/**
 * Subscribe to real-time CV URL updates from Firestore.
 * Returns an unsubscribe function.
 */
export const subscribeToResume = (callback) => {
  if (!isFirebaseConfigured || !db) {
    callback("");
    return () => { };
  }

  const unsubscribe = onSnapshot(
    doc(db, "cv", "latest"),
    (snap) => {
      callback(snap.exists() ? snap.data().url || "" : "");
    },
    (error) => {
      console.error("Error listening to CV:", error);
      callback("");
    }
  );

  return unsubscribe;
};

export const saveResume = async (base64Data) => {
  if (!isFirebaseConfigured || !db) {
    console.warn("Firebase not configured. Cannot save CV record.");
    return false;
  }
  await ensureAuth();
  try {
    const downloadUrl = await uploadToSupabase(base64Data, "resumes/resume.pdf");
    if (!downloadUrl) return false;

    await setDoc(doc(db, "cv", "latest"), {
      url: downloadUrl,
      updatedAt: new Date().toISOString(),
    });

    return true;
  } catch (err) {
    console.error("Error uploading CV:", err);
    return false;
  }
};

// ─── Reset ───────────────────────────────────────────────────────────────────

export const resetPortfolio = async () => {
  if (!isFirebaseConfigured || !db) {
    console.warn("Firebase not configured. Cannot reset.");
    return false;
  }
  await ensureAuth();
  try {
    // Delete all project images + docs
    const snapshot = await getDocs(collection(db, "projects"));
    const deletions = snapshot.docs.map(async (d) => {
      await deleteFromSupabase(`projects/${d.id}.png`);
      await deleteDoc(doc(db, "projects", d.id));
    });
    await Promise.all(deletions);

    // Delete resume file + record
    await deleteFromSupabase("resumes/resume.pdf");
    await deleteDoc(doc(db, "cv", "latest"));

    return true;
  } catch (e) {
    console.error("Error resetting portfolio:", e);
    return false;
  }
};