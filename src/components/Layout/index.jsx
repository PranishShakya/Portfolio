import React from 'react'
import { Outlet } from 'react-router'
import Footer from '../Footer'
import Header from '../Header'
import AdminPanel from '../AdminPanel'
import ParticleBackground from '../ParticleBackground'
import CustomCursor from '../CustomCursor'

const MainLayout = () => {
  return (
    <>
        <ParticleBackground />
        <CustomCursor />
        <Header />
        <Outlet />
        <AdminPanel />
        <Footer />
    </>
  );
};

export default MainLayout;

