import React, { useState, useEffect, ReactElement } from "react";
import Image from "next/image";
import banner from "@/public/banner/banner.svg?url";
import bannerMobile from "@/public/banner/banner_mobile.svg?url";

interface HeroSectionProps {
  children?: ReactElement;
}

const HeroSection: React.FC<HeroSectionProps> = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, []);

  return (
    <section
      className={`relative w-full h-screen flex flex-col items-center justify-center text-center overflow-hidden transition-opacity duration-1000 ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`absolute top-0 left-0 w-full h-full bg-[#C3ECF6] z-[-5] transition-opacity duration-1000 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      ></div>

      <div className="mx-auto max-w-6xl px-4">
        <div>
          <Image
            src={banner}
            alt="Google Cloud DevFest 2024"
            className={`hidden sm:block w-full h-auto object-contain z-[-1] transition-opacity duration-1000 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            priority
          />
          <div className="block sm:hidden w-full h-auto">
            <Image
              src={bannerMobile}
              alt="Google Cloud DevFest 2024"
              className={`sm:hidden w-full h-auto object-contain z-[-1] transition-opacity duration-1000 ${
                loaded ? "opacity-100" : "opacity-0"
              }`}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
