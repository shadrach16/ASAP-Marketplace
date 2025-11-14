import React from 'react';
import { Loader2 } from 'lucide-react'; // Using lucide's spinner icon

 
const AsapTextLoader = () => {
  // Base classes for each letter
  const baseClass = "text-5xl font-bold text-secondary animate-bounce-letter logo";

  return (
    <div className="flex justify-center items-center space-x-1" aria-label="Loading ASAP">
      <span 
        className={baseClass} 
        style={{ animationDelay: '0s' }}
      >
        A
      </span>
      <span 
        className={baseClass} 
        style={{ animationDelay: '0.1s' }}
      >
        s
      </span>
      <span 
        className={baseClass} 
        style={{ animationDelay: '0.2s' }}
      >
        a
      </span>
      <span 
        className={baseClass} 
        style={{ animationDelay: '0.3s' }}
      >
        p
      </span>
    </div>
  );
};



const FullScreenLoader = () => {
  return (
    // The overlay container
    <div className="fixed inset-0 z-[100] flex flex-col   items-center justify-center bg-white/50 backdrop-blur-sm space-x-4">
      {/* 2. Use it here */}
      <AsapTextLoader />  <Loader2 className="h-6 w-6 animate-spin text-secondary" />
      
    </div>)
  }

export default FullScreenLoader;