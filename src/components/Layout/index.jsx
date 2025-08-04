import React from 'react'
import { Outlet } from 'react-router'
import Footer from '../Footer'
import Header from '../Header'

const MainLayout = () => {
  return (
    <>
        <Header />
        <Outlet />
        <Footer />
    </>
   
  );
};

export default MainLayout;
