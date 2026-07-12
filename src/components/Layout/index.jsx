import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router'
import Footer from '../Footer'
import Header from '../Header'
import AdminPanel from '../AdminPanel'
import ParticleBackground from '../ParticleBackground'
import CustomCursor from '../CustomCursor'
import WeatherBackground from '../WeatherBackground'

const MainLayout = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    const body = document.body;
    if (theme === "light") {
      body.classList.add("light");
    } else {
      body.classList.remove("light");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <>
        {theme === "dark" ? <ParticleBackground /> : <WeatherBackground activeTheme={theme} />}
        <CustomCursor />
        <Header />
        <Outlet context={{ theme, setTheme }} />
        <AdminPanel />
        <Footer />
    </>
  );
};

export default MainLayout;

