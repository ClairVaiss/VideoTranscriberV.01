import React from 'react';
import { VideoIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center">
        <VideoIcon className="h-8 w-8 text-pink-500 mr-3" />
        <h1 className="text-2xl font-bold text-pink-600">
          Video Transcriber
        </h1>
      </div>
    </header>
  );
};