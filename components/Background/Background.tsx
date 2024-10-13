/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';

interface RandomSVGBackgroundProps {
  elements: string[]; // Array of SVG paths or image URLs
}

const getRandomPosition = () => ({
  top: `${Math.random() * 100}vh`,
  left: `${Math.random() * 100}vw`,
  size: `${Math.random() * 100 + 50}px`, // Random size between 50px and 150px
  duration: `${Math.random() * 10 + 5}s`, // Random spin duration between 5s and 15s
});

const RandomSVGBackground: React.FC<RandomSVGBackgroundProps> = ({ elements }) => {
  const [svgPositions, setSvgPositions] = useState<Array<{ top: string; left: string; size: string; duration: string }>>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Create random SVG positions when component mounts
    const timer = setTimeout(() => setLoaded(true), 500);
    const positions = Array.from({ length: elements.length }, () => getRandomPosition());
    setSvgPositions(positions);
    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, [elements]);

  return (
    <div className={`fixed inset-0 z-[-1] pointer-events-none ${loaded ? 'opacity-20' : 'opacity-0'}`}>
      {elements.map((element, index) => (
        <div
          key={index}
          className="absolute animate-spin"
          style={{
            top: svgPositions[index]?.top,
            left: svgPositions[index]?.left,
            width: svgPositions[index]?.size,
            height: svgPositions[index]?.size,
            animationDuration: svgPositions[index]?.duration,
          }}
        >
          {/* Render the provided SVG or image */}
          {element.endsWith('.svg') ? (
            <img src={element} alt={`SVG ${index}`} className="w-full h-full object-contain" />
          ) : (
            <img src={element} alt={`Image ${index}`} className="w-full h-full object-contain" />
          )}
        </div>
      ))}
    </div>
  );
};

export default RandomSVGBackground;
