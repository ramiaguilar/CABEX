
import React, { useEffect } from 'react';
import { HeartbeatIcon } from './icons/HeartbeatIcon';

interface InProgressScreenProps {
  examTitle: string;
  onComplete: () => void;
  isVoiceControlActive: boolean;
}

const InProgressScreen: React.FC<InProgressScreenProps> = ({ examTitle, onComplete, isVoiceControlActive }) => {
  useEffect(() => {
    const message = `Proceso en Curso. Estamos tomando sus mediciones para el ${examTitle}. Por favor, permanezca quieto y siga las instrucciones en la pantalla de la cabina.`;
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'es-ES';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);

    const timer = setTimeout(() => {
      onComplete();
    }, 5000); // Simulate a 5-second measurement process

    return () => {
      clearTimeout(timer);
      window.speechSynthesis.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
       <div className="relative flex items-center justify-center w-40 h-40 mb-8">
        <div className="absolute w-full h-full bg-blue-500/20 rounded-full health-pulse-circle"></div>
        <div className="absolute w-full h-full bg-blue-500/20 rounded-full health-pulse-circle" style={{ animationDelay: '1s' }}></div>
        <div className="bg-white p-6 rounded-full shadow-lg">
          <HeartbeatIcon className="h-16 w-16 text-blue-600" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-2">Proceso en Curso</h2>
      <p className="text-gray-600 mb-4">Tomando mediciones para <span className="font-semibold">{examTitle}</span>.</p>
      <p className="text-sm text-gray-500">Por favor, permanezca quieto y siga las instrucciones.</p>
    </div>
  );
};

export default InProgressScreen;
