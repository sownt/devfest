/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import Image from 'next/image';

interface Photo {
  url: string;
}

interface GalleryBlockProps {
  photos: Photo[];
  title: string;
  description: string;
  callToAction: {
    label: string;
    link: string;
  };
}

const Gallery: React.FC<GalleryBlockProps> = ({ photos, title, description, callToAction }) => {
  return (
    <div className="container mx-0 min-w-full shadow-lg">
      <div className="grid gap-1 grid-cols-3 grid-rows-5 sm:grid-cols-5 sm:grid-rows-3 min-h-[840px] max-h-[1200px]">
        {photos.map((photo, index) => (
          <div key={index} className={`relative aspect-w-1 aspect-h-1 bg-gray-200 ${getGridItemStyles(index)}`}>
            <Image
              src={photo.url}
              alt={`Gallery item ${index + 1}`}
              fill
              blurDataURL="data:..."
              placeholder="blur"
              sizes="(max-width: 1200px) 100vw, (max-width: 1920px) 50vw, 33vw"
              className="object-cover"
              // className="transition-transform duration-300 object-cover transform hover:scale-105 hover:z-10 hover:rounded-lg hover:shadow-lg"
            />
          </div>
        ))}

        {/* <div className={`gallery-info bg-gray-700 hover:bg-gray-800 text-white p-6 sm:p-8 flex flex-col justify-center`}>
          <div className='hidden sm:block mb-4'>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
          <a
            href={callToAction.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-white"
          >
            <button className="sm:bg-blue-600 px-4 py-2 rounded sm:hover:bg-blue-700 transition-colors">
              {callToAction.label}
            </button>
          </a>
        </div> */}
      </div>
    </div>
  );
};

// Function to handle grid-item styles based on index
const getGridItemStyles = (index: number) => {
  switch (index) {
    case 0:
      return 'col-span-3 row-span-2 sm:col-span-2 sm:row-span-1';
    case 1:
      return 'col-span-2 row-span-2 sm:col-span-2 sm:row-span-1';
    case 2:
      return 'sm:row-span-2';
    case 3:
      return 'sm:col-span-1 sm:row-span-1';
    case 4:
      return 'col-span-2 sm:col-span-1 sm:row-span-1';
    case 5:
      return 'sm:col-span-2';
    case 6:
      return 'hidden sm:block col-span-2';
    case 7:
      return 'hidden sm:block col-span-2';
    case 8:
      return 'hidden sm:block';
    default:
      return 'hidden';
  }
};

export default Gallery;
