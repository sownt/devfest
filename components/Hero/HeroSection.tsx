import React, { useState, useEffect, ReactElement } from 'react';
import Image from 'next/image';

interface HeroSectionProps {
  backgroundImage: string;
  mobileBackgroundImage: string,
  title: string;
  subtitle?: string;
  fontColor?: string;
  children?: ReactElement;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  backgroundImage,
  mobileBackgroundImage,
  title,
  subtitle,
  fontColor = 'text-white',
  children,
}) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Delay to show transition after component mounts
    const timer = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, []);

  return (
    <section
      className={`relative w-full h-screen flex flex-col items-center justify-center text-center overflow-hidden transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}
    >
      <div
        className={`absolute top-0 left-0 w-full h-full bg-[#C3ECF6] z-[-2] transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      ></div>

      {/* Background Image */}
      <Image
        src={backgroundImage}
        alt="Hero background"
        fill
        className={`absolute hidden sm:block top-0 left-0 object-contain z-[-1] transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        priority
      />
      <Image
        src={mobileBackgroundImage}
        alt="Hero background"
        fill
        className={`absolute sm:hidden top-0 left-0 object-contain z-[-1] transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        priority
      />

      {/* Dim Overlay */}
      {/* <div
        className={`absolute top-0 left-0 w-full h-full bg-black/65 z-0 transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      ></div> */}

      {/* Blur Overlay */}
      {/* <div
        className={`absolute top-0 left-0 w-full h-full z-0 transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        style={{
          background: 'radial-gradient(circle, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(5px)',
        }}
      ></div> */}



      {/* Hero Content */}
      <div
        className={`hidden relative z-10 px-4 transition-transform duration-1000 ${loaded ? 'translate-y-0' : 'translate-y-10'} ${fontColor}`}>
        <h1 className="text-6xl font-bold">{title}</h1>
        {subtitle && <p className="mt-4 text-2xl">{subtitle}</p>}
        {children}
      </div>

      {/* <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <button
          className="flex items-center justify-center px-4 py-3 rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105"
          onClick={() => alert('SVG Button Clicked!')}
        >
          <Image src="/icons/scroll-down.svg" alt="Add Action" width={16} height={16} />
        </button>
      </div> */}
    </section>
  );
};

export default HeroSection;
