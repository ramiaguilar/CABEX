
import React, { useEffect } from 'react';
import { Reminder } from '../types';
import { AccessibilityIcon } from './icons/AccessibilityIcon';
import { HelpIcon } from './icons/HelpIcon';

interface WelcomeScreenProps {
  onStartArgentina: () => void;
  onStartAnonymous: () => void;
  onShowHistory: () => void;
  onShowHelp: () => void;
  reminder: Reminder | null;
  onToggleVoiceControl: () => void;
  isVoiceRecognitionSupported: boolean;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartArgentina, onStartAnonymous, onShowHistory, onShowHelp, reminder, onToggleVoiceControl, isVoiceRecognitionSupported }) => {
  
  useEffect(() => {
    let message = "Bienvenido a CABEX. Por favor, seleccione una opción para comenzar.";
    if (isVoiceRecognitionSupported) {
      message += " Para activar el control por voz, diga 'Activar modo voz' o presione el botón de accesibilidad.";
    }
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'es-ES';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [isVoiceRecognitionSupported]);

  const isReminderDue = reminder && new Date() >= new Date(reminder.nextDate);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      
      {isReminderDue && (
        <div className="w-full p-3 mb-6 bg-yellow-100 border-l-4 border-yellow-500 rounded-r-lg">
          <div className="flex items-center">
             <svg className="w-6 h-6 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <div className="text-left">
              <p className="font-bold text-yellow-800">Recordatorio</p>
              <p className="text-sm text-yellow-700">¡Es hora de realizar tu chequeo periódico!</p>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-3xl font-bold text-gray-800 mb-2 mt-8">Seleccione una opción</h2>
      <p className="text-gray-600 mb-8">¿Cómo desea continuar?</p>
      
      <div className="w-full space-y-4">
        <button 
          onClick={onStartArgentina}
          className="w-full bg-blue-600 text-white text-lg font-bold py-6 px-6 rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-transform transform hover:scale-105"
          aria-label="Iniciar un nuevo chequeo médico identificándose"
        >
          Identificarse para Chequeo
        </button>
        <button 
          onClick={onStartAnonymous}
          className="w-full text-center text-gray-500 hover:text-gray-700 font-semibold py-3"
          aria-label="Iniciar un nuevo chequeo médico de forma anónima"
        >
          Continuar como Anónimo
        </button>
      </div>
      <div className="mt-auto pt-6 w-full space-y-2">
        <div className="flex gap-2">
         <button 
            onClick={onShowHistory}
            className="flex-1 text-blue-600 hover:text-blue-800 font-semibold py-2"
            aria-label="Ver mi historial de chequeos médicos"
        >
          Ver Mi Historial
        </button>
         <button 
            onClick={onShowHelp}
            className="flex-1 text-blue-600 hover:text-blue-800 font-semibold py-2 flex items-center justify-center gap-1"
            aria-label="Ver sección de ayuda y preguntas frecuentes"
        >
          <HelpIcon className="h-5 w-5"/>
          <span>Ayuda</span>
        </button>
        </div>
         {isVoiceRecognitionSupported && (
            <button 
                onClick={onToggleVoiceControl}
                className="w-full flex items-center justify-center gap-3 bg-slate-100 text-slate-800 font-bold py-3 px-4 rounded-lg hover:bg-slate-200 transition-colors border border-slate-200"
                aria-label="Activar o desactivar el control por voz para navegar la aplicación sin usar las manos"
            >
              <AccessibilityIcon className="h-6 w-6"/>
              <span>Activar Control por Voz</span>
            </button>
        )}
      </div>
    </div>
  );
};

export default WelcomeScreen;
