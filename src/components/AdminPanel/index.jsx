import React, { useState, useEffect, useRef } from "react";
import {
  FaCog, FaTimes, FaFilePdf, FaSave, FaUndo, FaUpload, FaLock, FaUser, FaEye, FaEyeSlash,
} from "react-icons/fa";
import { saveResume, addProject, updateProject, resetPortfolio } from "../../utils/portfolioStorage";

// ── Credentials (kept client-side only; not exposed as env) ─────────────────
const ADMIN_USERNAME = "Pranish Shakya";
const ADMIN_PASSWORD = "9845754168p@";
const AUTH_KEY       = "pranish_admin_authed";

const AdminPanel = () => {
  // Auth state
  const [isAuthed, setIsAuthed]         = useState(false);
  const [showLogin, setShowLogin]       = useState(false);
  const [loginUser, setLoginUser]       = useState("");
  const [loginPass, setLoginPass]       = useState("");
  const [showPass, setShowPass]         = useState(false);
  const [loginError, setLoginError]     = useState("");
  const [loginShake, setLoginShake]     = useState(false);

  // Panel state
  const [isOpen, setIsOpen]     = useState(false);
  const [isAdmin, setIsAdmin]   = useState(false);

  // Project form state
  const [editingProjectId, setEditingProjectId]       = useState(null);
  const [projectTitle, setProjectTitle]               = useState("");
  const [projectDescription, setProjectDescription]   = useState("");
  const [projectTech, setProjectTech]                 = useState("");
  const [projectGithub, setProjectGithub]             = useState("");
  const [projectLive, setProjectLive]                 = useState("");
  const [projectImage, setProjectImage]               = useState("");

  const fileInputRef   = useRef(null);
  const resumeInputRef = useRef(null);

  // Restore auth + admin mode from session/localStorage on mount
  useEffect(() => {
    const authed = sessionStorage.getItem(AUTH_KEY) === "true";
    setIsAuthed(authed);

    try {
      setIsAdmin(localStorage.getItem("pranish_admin_mode") === "true");
    } catch (e) {
      setIsAdmin(false);
    }

    const handleEditProjectEvent = (e) => {
      const p = e.detail;
      setEditingProjectId(p.id);
      setProjectTitle(p.title);
      setProjectDescription(p.description);
      setProjectTech(p.technologies ? p.technologies.join(", ") : "");
      setProjectGithub(p.githubLink || "");
      setProjectLive(p.liveLink || "");
      setProjectImage(p.image || "");
      // Require auth before opening via card click
      if (sessionStorage.getItem(AUTH_KEY) === "true") {
        setIsOpen(true);
      } else {
        setShowLogin(true);
      }
    };

    window.addEventListener("portfolio-edit-project", handleEditProjectEvent);
    return () => window.removeEventListener("portfolio-edit-project", handleEditProjectEvent);
  }, []);

  // ── Auth handlers ────────────────────────────────────────────────────────
  const handleGearClick = () => {
    if (isAuthed) {
      setIsOpen((o) => !o);
    } else {
      setLoginUser("");
      setLoginPass("");
      setLoginError("");
      setShowLogin(true);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginUser === ADMIN_USERNAME && loginPass === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, "true");
      setIsAuthed(true);
      setShowLogin(false);
      setLoginError("");
      setIsOpen(true);
    } else {
      setLoginError("Invalid username or password.");
      setLoginShake(true);
      setTimeout(() => setLoginShake(false), 600);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setIsAuthed(false);
    setIsOpen(false);
    toggleAdminMode(false);
  };

  // ── Admin panel helpers ──────────────────────────────────────────────────
  const toggleAdminMode = (checked) => {
    setIsAdmin(checked);
    try {
      localStorage.setItem("pranish_admin_mode", checked ? "true" : "false");
      window.dispatchEvent(new Event("portfolio-admin-mode-updated"));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCvUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") { alert("Please upload a PDF file only."); return; }
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const success = await saveResume(ev.target.result);
      if (success) { alert("CV Resume uploaded successfully!"); if (resumeInputRef.current) resumeInputRef.current.value = ""; }
      else alert("Failed to save CV. Make sure Firebase is configured.");
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setProjectImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    if (!projectTitle || !projectDescription) { alert("Please enter a title and description."); return; }
    const techArray = projectTech ? projectTech.split(",").map((t) => t.trim()).filter(Boolean) : [];
    const projectData = { title: projectTitle, description: projectDescription, technologies: techArray, githubLink: projectGithub || "#", liveLink: projectLive || "#", image: projectImage };
    let success = false;
    if (editingProjectId) {
      success = await updateProject({ ...projectData, id: editingProjectId });
      alert(success ? "Project updated successfully!" : "Failed to update project.");
    } else {
      success = await addProject(projectData);
      alert(success ? "Project added successfully!" : "Failed to add project.");
    }
    if (success) clearProjectForm();
  };

  const clearProjectForm = () => {
    setEditingProjectId(null); setProjectTitle(""); setProjectDescription("");
    setProjectTech(""); setProjectGithub(""); setProjectLive(""); setProjectImage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleReset = async () => {
    if (window.confirm("This will erase all custom uploads and restore the default portfolio projects and resume. Continue?")) {
      const success = await resetPortfolio();
      clearProjectForm(); toggleAdminMode(false);
      alert(success ? "Portfolio reset to default state!" : "Reset failed. Check Firebase configuration.");
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* ── Floating Gear Button ─────────────────────────────────── */}
      <button
        onClick={handleGearClick}
        className="fixed bottom-6 right-6 z-50 p-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center border border-orange-400/20"
        title="Portfolio Settings"
      >
        <FaCog size={24} className={isOpen ? "animate-spin" : ""} />
      </button>

      {/* ── Login Modal ──────────────────────────────────────────── */}
      {showLogin && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div
            className={`relative w-full max-w-sm bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl p-8 ${loginShake ? "animate-shake" : ""}`}
          >
            {/* Close */}
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors cursor-pointer"
            >
              <FaTimes size={18} />
            </button>

            {/* Header */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mb-3">
                <FaLock className="text-orange-500" size={22} />
              </div>
              <h3 className="text-xl font-bold text-white">Admin Access</h3>
              <p className="text-gray-500 text-sm mt-1">Sign in to manage your portfolio</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Username */}
              <div className="space-y-1">
                <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider block">Username</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={13} />
                  <input
                    type="text"
                    value={loginUser}
                    onChange={(e) => setLoginUser(e.target.value)}
                    placeholder="Enter username"
                    autoComplete="username"
                    className="w-full bg-gray-900 border border-gray-800 focus:border-orange-500 rounded-lg pl-9 pr-4 py-2.5 text-white text-sm focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider block">Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={13} />
                  <input
                    type={showPass ? "text" : "password"}
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    className="w-full bg-gray-900 border border-gray-800 focus:border-orange-500 rounded-lg pl-9 pr-10 py-2.5 text-white text-sm focus:outline-none transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 cursor-pointer"
                  >
                    {showPass ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {loginError && (
                <div className="text-red-400 text-xs text-center bg-red-500/10 border border-red-500/20 rounded-lg py-2 px-3">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors cursor-pointer mt-2 shadow-lg shadow-orange-500/10"
              >
                Sign In
              </button>
            </form>
          </div>

          {/* Shake animation */}
          <style>{`
            @keyframes shake {
              0%,100% { transform: translateX(0); }
              20%      { transform: translateX(-8px); }
              40%      { transform: translateX(8px); }
              60%      { transform: translateX(-5px); }
              80%      { transform: translateX(5px); }
            }
            .animate-shake { animation: shake 0.5s ease; }
          `}</style>
        </div>
      )}

      {/* ── Admin Panel Drawer ───────────────────────────────────── */}
      {isAuthed && (
        <div
          className={`fixed top-0 right-0 h-screen w-full sm:w-[450px] bg-gray-950 border-l border-gray-800 z-50 shadow-2xl flex flex-col transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Drawer Header */}
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <FaCog className="text-orange-500" /> Portfolio Settings
            </h3>
            <div className="flex items-center gap-3">
              <button
                onClick={handleLogout}
                className="text-xs text-gray-500 hover:text-red-400 border border-gray-800 hover:border-red-500/30 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                title="Log out"
              >
                Logout
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <FaTimes size={20} />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-grow overflow-y-auto p-6 space-y-8">

            {/* Section 1: Toggle Admin Mode */}
            <div className="bg-gray-900/50 p-4 border border-gray-800 rounded-lg">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-white font-medium block">Enable Edit Mode</span>
                  <span className="text-gray-500 text-xs">Shows edit/delete overlays on project cards</span>
                </div>
                <div className="relative inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={isAdmin}
                    onChange={(e) => toggleAdminMode(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500" />
                </div>
              </label>
            </div>

            {/* Section 2: CV Upload */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold text-md border-b border-gray-800 pb-2 flex items-center gap-2">
                <FaFilePdf className="text-orange-400" /> Upload New Resume
              </h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                Upload your updated CV (PDF format). The "Download Resume" button on the hero page will automatically point to this file.
              </p>
              <label className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 hover:bg-gray-900/80 border border-gray-800 hover:border-orange-500/40 rounded-lg cursor-pointer transition-colors text-sm text-gray-300">
                <FaUpload className="text-orange-500" />
                <span>Choose PDF File</span>
                <input ref={resumeInputRef} type="file" accept="application/pdf" onChange={handleCvUpload} className="hidden" />
              </label>
            </div>

            {/* Section 3: Add / Edit Project */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold text-md border-b border-gray-800 pb-2">
                {editingProjectId ? "✏️ Edit Project" : "➕ Add New Project"}
              </h4>
              <form onSubmit={handleProjectSubmit} className="space-y-4 text-sm">
                {[
                  { label: "Project Title *", value: projectTitle, set: setProjectTitle, placeholder: "e.g. E-Commerce Website", type: "text", required: true },
                ].map(({ label, value, set, placeholder, type, required }) => (
                  <div key={label} className="space-y-1">
                    <label className="text-gray-400 block font-medium">{label}</label>
                    <input type={type} value={value} onChange={(e) => set(e.target.value)} placeholder={placeholder}
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-orange-500 transition-colors"
                      required={required} />
                  </div>
                ))}

                <div className="space-y-1">
                  <label className="text-gray-400 block font-medium">Project Description *</label>
                  <textarea value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Summarize key features, architectures, and design processes..."
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-orange-500 transition-colors min-h-[80px]"
                    required />
                </div>

                {[
                  { label: "Tech Stack (comma separated)", value: projectTech, set: setProjectTech, placeholder: "React, CSS, ASP.NET Core", type: "text" },
                  { label: "GitHub Repository Link", value: projectGithub, set: setProjectGithub, placeholder: "https://github.com/...", type: "url" },
                  { label: "Live Demo Link (optional)", value: projectLive, set: setProjectLive, placeholder: "https://... or #", type: "text" },
                ].map(({ label, value, set, placeholder, type }) => (
                  <div key={label} className="space-y-1">
                    <label className="text-gray-400 block font-medium">{label}</label>
                    <input type={type} value={value} onChange={(e) => set(e.target.value)} placeholder={placeholder}
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-orange-500 transition-colors" />
                  </div>
                ))}

                <div className="space-y-2">
                  <label className="text-gray-400 block font-medium">Project Card Thumbnail Image</label>
                  <div className="flex gap-4 items-center">
                    <label className="flex-grow flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-900/80 border border-gray-800 hover:border-orange-500/40 rounded-lg cursor-pointer transition-colors text-xs text-gray-300">
                      <FaUpload className="text-orange-500" />
                      <span>Upload Image</span>
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                    {projectImage && (
                      <div className="w-14 h-10 rounded border border-gray-800 overflow-hidden relative group">
                        <img src={projectImage} alt="preview" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => setProjectImage("")}
                          className="absolute inset-0 bg-black/75 flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          <FaTimes size={10} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit"
                    className="flex-grow flex items-center justify-center gap-2 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-md transition-colors cursor-pointer">
                    <FaSave size={14} />
                    <span>{editingProjectId ? "Save Changes" : "Create Project"}</span>
                  </button>
                  {editingProjectId && (
                    <button type="button" onClick={clearProjectForm}
                      className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors cursor-pointer">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Section 4: Reset */}
            <div className="border-t border-gray-800 pt-6">
              <button onClick={handleReset}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-transparent border border-red-500/30 hover:border-red-500 hover:bg-red-500/5 text-red-500 text-sm font-semibold rounded-lg transition-colors cursor-pointer">
                <FaUndo size={14} />
                <span>Reset Portfolio to Defaults</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default AdminPanel;
