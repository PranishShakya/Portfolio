import React from "react";
import { NavLink } from "react-router";

const Navigation = () => {
  const navlists = [
    { name: "Home", url: "#home" },
    { name: "About", url: "#about" },
    { name: "Projects", url: "#projects" },
    { name: "Contact", url: "#contact" },
    
  ];

  return (
    
    <nav className="fixed top-0 z-50  ">
      <ul className="flex gap-4 p-4 justify-center ">
        {navlists.map((navlist, i) => (
          <li key={i} className="px-2 py-3 relative group">
            <a
              href={navlist.url}
              className="transition-colors duration-200 hover:text-orange-500"
            >
              {navlist.name}
              <span className="absolute left-0 bottom-2 h-0.5 w-0 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
   
  );
};

export default Navigation;


