import React from "react";
import Logo from "../Logo";
import Navigation from "../Navigations";

const Header = () => {
  return (
   <div className="fixed w-full h-[85px] bg-black z-20">
  <div className="py-2">
    <div className="mx-auto px-4 max-w-7xl">
      <div className="flex items-center justify-between">
        <div className="w-60">
          <Logo />
        </div>
        <div className="text-white pr-[590px]">
          <Navigation />
        </div>
      </div>
    </div>
  </div>
</div>
  );
};

export default Header;
