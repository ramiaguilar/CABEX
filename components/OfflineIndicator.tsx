
import React from 'react';

const OfflineIndicator: React.FC = () => {
  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-b-lg shadow-md z-50 flex items-center gap-2">
       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636a9 9 0 010 12.728m-12.728 0a9 9 0 010-12.728m12.728 0L5.636 18.364m12.728 0L5.636 5.636"></path></svg>
      <span>Modo sin conexión</span>
    </div>
  );
};

export default OfflineIndicator;
