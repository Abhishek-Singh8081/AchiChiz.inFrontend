import React from "react";
import banner from "../assets/banner.jpg"; // Make sure banner is an image path, not a folder

const PageTopBanner = () => {

  return (
    <div className="relative w-full h-[300px] overflow-hidden  shadow-md">
      <img
        src={banner}
        alt="Banner"
        className="w-full h-full object-cover"
      />
      
    </div>
  );
};

export default PageTopBanner;
