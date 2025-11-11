
import React from 'react';

interface SplashScreenProps {
  onStart: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-between h-full text-center p-8">
      <div className="w-full flex-grow flex flex-col items-center justify-center">
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight mt-16">Bienvenido a CABEX</h1>
        <p className="text-lg text-slate-600 mt-2">Su chequeo médico, al instante.</p>
      </div>
      <div className="w-full">
        <button
          onClick={onStart}
          className="w-full bg-blue-600 text-white text-xl font-bold py-5 px-6 rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all transform hover:scale-105"
        >
          Iniciar
        </button>
      </div>
    </div>
  );
};

export default SplashScreen;