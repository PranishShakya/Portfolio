import React from "react";

const Navigation = ({ isMobile, onItemClick }) => {
  const navlists = [
    { name: "Home", url: "#home" },
    { name: "About", url: "#about" },
    { name: "Projects", url: "#projects" },
    { name: "Contact", url: "#contact" },
    { name: "Theme", url: "#theme-control" },
  ];

  return (
    <nav className={isMobile ? "w-full" : ""}>
      <ul className={isMobile ? "flex flex-col gap-4 text-center items-center py-6" : "flex gap-6 justify-center items-center"}>
        {navlists.map((navlist, i) => (
          <li key={i} className="relative group py-2 md:py-0">
            <a
              href={navlist.url}
              onClick={onItemClick}
              className="text-lg md:text-base font-medium transition-colors duration-200 hover:text-orange-500 text-gray-300"
            >
              {navlist.name}
              <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;



