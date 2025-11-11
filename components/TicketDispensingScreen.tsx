

import React, { useEffect } from 'react';
import { TicketIcon } from './icons/TicketIcon';

interface TicketDispensingScreenProps {
  onFinish: () => void;
  isVoiceControlActive: boolean;
}

const TicketDispensingScreen: React.FC<TicketDispensingScreenProps> = ({ onFinish, isVoiceControlActive }) => {
  useEffect(() => {
    let message = "Ticket Impreso. Por favor, retire su ticket de la ranura ubicada a su derecha.";
    if (isVoiceControlActive) {
      message += " Diga 'Finalizar' para continuar."
    }
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'es-ES';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [isVoiceControlActive]);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="mb-8">
        <TicketIcon className="w-48 h-48 text-blue-500 animate-dispense" />
      </div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Ticket Impreso</h2>
      <p className="text-lg text-gray-600 mb-10 max-w-xs">
        Por favor, retire su ticket de la ranura de la cabina.
      </p>
      <div className="w-full mt-auto">
        <button
          onClick={onFinish}
          className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105"
        >
          Finalizar
        </button>
      </div>
    </div>
  );
};

export default TicketDispensingScreen;