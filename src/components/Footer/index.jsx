import React from 'react';
import { FaGithub, FaLinkedin, FaFacebook, FaInstagram, FaHeart } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 border-t border-gray-900 text-gray-400 py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-white text-xl font-bold tracking-wider">
              PRANISH<span className="text-orange-500">.</span>
            </span>
          </div>
          <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
            Crafting premium, high-performance web applications and robust software solutions with ASP.NET Core and React.
          </p>
        </div>

        {/* Quick Links Column */}
        <div className="space-y-4">
          <h4 className="text-white text-sm font-semibold uppercase tracking-wider">Quick Links</h4>
          <ul className="grid grid-cols-2 gap-2 text-sm">
            <li>
              <a href="#home" className="hover:text-orange-500 transition-colors">Home</a>
            </li>
            <li>
              <a href="#about" className="hover:text-orange-500 transition-colors">About</a>
            </li>
            <li>
              <a href="#projects" className="hover:text-orange-500 transition-colors">Projects</a>
            </li>
            <li>
              <a href="#contact" className="hover:text-orange-500 transition-colors">Contact</a>
            </li>
          </ul>
        </div>

        {/* Socials Column */}
        <div className="space-y-4">
          <h4 className="text-white text-sm font-semibold uppercase tracking-wider">Connect With Me</h4>
          <div className="flex items-center gap-4 text-xl">
            <a
              href="https://github.com/PranishShakya"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              title="GitHub"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/pranish-shakya-2252a627a/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              title="LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://www.facebook.com/alex.shakya.10"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              title="Facebook"
            >
              <FaFacebook />
            </a>
            <a
              href="https://www.instagram.com/pranish_shakya001"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              title="Instagram"
            >
              <FaInstagram />
            </a>
          </div>
        </div>

      </div>

      {/* Bottom Row */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-gray-900 flex flex-col md:flex-row items-center justify-between text-xs text-gray-600 gap-4">
        <p>© {currentYear} Pranish Shakya. All rights reserved.</p>
        <p className="flex items-center gap-1.5">
          Made with <FaHeart className="text-orange-500 animate-pulse" /> using React & Tailwind
        </p>
      </div>
    </footer>
  );
};

export default Footer;

