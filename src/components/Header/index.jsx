import React, { useState, useEffect } from "react";
import Logo from "../Logo";
import Navigation from "../Navigations";
import { FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Close mobile menu when window is resized above mobile breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? "bg-black/90 backdrop-blur-md border-b border-orange-500/20 py-2" : "bg-black/40 backdrop-blur-sm py-4"
    }`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo container */}
        <Logo />

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <Navigation isMobile={false} />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white hover:text-orange-500 transition-colors p-2 z-50 cursor-pointer"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <div className={`fixed inset-0 top-[70px] bg-black/95 backdrop-blur-lg z-40 transition-transform duration-300 md:hidden flex justify-center items-start pt-10 ${
        mobileMenuOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        <Navigation isMobile={true} onItemClick={() => setMobileMenuOpen(false)} />
      </div>
    </header>
  );
};

export default Header;

