import React, { useEffect } from 'react';
import { HistoricResult, ResultStatus } from '../types';
import { HeartbeatIcon } from './icons/HeartbeatIcon';
import { CalendarIcon } from './icons/CalendarIcon';

interface HistoryScreenProps {
  history: HistoricResult[];
  onBack: () => void;
  onScheduleReminder: () => void;
  isVoiceControlActive: boolean;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ history, onBack, onScheduleReminder, isVoiceControlActive }) => {
  useEffect(() => {
    let message = "Mi Historial. Aquí puede ver sus chequeos anteriores.";
    if (isVoiceControlActive) {
      message += " Diga 'Agendar Recordatorio' para configurar uno, o diga 'Volver' para ir al inicio."
    }
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'es-ES';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [isVoiceControlActive]);


  const getStatusColor = (status: ResultStatus) => {
    switch(status) {
      case 'Normal': return 'text-green-800 bg-green-100';
      case 'Atención': return 'text-orange-800 bg-orange-100';
      case 'Peligro': return 'text-red-800 bg-red-100 font-bold';
      default: return 'text-gray-800 bg-gray-100';
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Mi Historial</h2>
      
      {history.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center text-gray-500 p-4 bg-slate-50 rounded-xl">
           <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          <p className="font-semibold text-lg">No hay resultados guardados.</p>
          <p className="text-sm">Cuando complete un chequeo y lo guarde, aparecerá aquí.</p>
        </div>
      ) : (
        <div className="space-y-4 overflow-y-auto pr-2 -mr-2">
          {history.slice().reverse().map((record, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border-2 border-slate-200 transition-all duration-300 hover:shadow-lg hover:border-blue-300 hover:-translate-y-1">
              <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-800">{record.examTitle}</h3>
                    <p className="text-sm text-gray-500">{record.date}</p>
                  </div>
                  <HeartbeatIcon className="h-6 w-6 text-blue-500"/>
              </div>
             
              <div className="text-sm space-y-2 mt-3">
                 <div className="flex justify-between items-center">
                    <span className="text-gray-600">Presión:</span>
                    <div className="text-right">
                        <span className="font-semibold text-gray-800 mr-2">{record.pressure}</span>
                         <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(record.pressureStatus)}`}>
                            {record.pressureStatus}
                        </span>
                    </div>
                </div>
                 <div className="flex justify-between items-center">
                    <span className="text-gray-600">O2 en Sangre:</span>
                     <div className="text-right">
                        <span className="font-semibold text-gray-800 mr-2">{record.oxygen}</span>
                         <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(record.oxygenStatus)}`}>
                            {record.oxygenStatus}
                        </span>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-auto pt-6 space-y-3">
         <button 
          onClick={onScheduleReminder}
          className="w-full flex items-center justify-center gap-3 bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors shadow-md"
        >
          <CalendarIcon className="h-5 w-5"/>
          Agendar Recordatorio
        </button>
        <button 
          onClick={onBack}
          className="w-full bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-lg hover:bg-slate-300 transition-colors"
        >
          Volver
        </button>
      </div>
    </div>
  );
};

export default HistoryScreen;
