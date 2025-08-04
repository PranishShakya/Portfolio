import React from "react";
import { Link } from "react-router";

const Picture = () => {
  return (
    <div className="relative">
      <div
        className="
          border-20 border-orange-500 rounded-full w-[450px] h-[450px] 
          absolute -top-[450px] right-[140px] 
          animate-pulse
          shadow-[0_0_30px_10px_rgba(255,165,0,0.6),inset_0_0_30px_10px_rgba(255,165,0,0.9)]"></div>
      <div className="bg-[linear-gradient(175deg,rgba(255,_255,_255,_0)_0%,_rgba(0,_0,_0,_1)_100%)] absolute  -top-[450px] bottom-0 right-[105px]  w-[520px]  z-10 block"></div>

      
      <Link className="flex w-[425px] h-[450px] -my-[450px]   mx-[155px] relative ">
        <img src="pra1.png" alt="logo" />
      </Link>
    </div>
  );
};

export default Picture;
