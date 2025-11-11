

import React, { useEffect } from 'react';
import { ExamType } from '../types';
import { EXAM_OPTIONS } from '../constants';

interface ExamSelectionScreenProps {
  onSelectExam: (exam: ExamType) => void;
  isVoiceControlActive: boolean;
}

const ExamSelectionScreen: React.FC<ExamSelectionScreenProps> = ({ onSelectExam, isVoiceControlActive }) => {
  useEffect(() => {
    let message = "Seleccione su Examen. Elija una de las opciones disponibles.";
    if (isVoiceControlActive) {
      message += " Diga el número correspondiente a su elección. Por ejemplo, 'Uno' para Chequeo Integral."
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
    <div className="flex flex-col h-full">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Tipos de Chequeo</h2>
      <p className="text-center text-gray-500 mb-8">Elija una de las opciones disponibles.</p>
      <div className="space-y-4">
        {EXAM_OPTIONS.map((exam, index) => {
          const IconComponent = exam.icon;
          return (
            <button
              key={exam.id}
              onClick={() => onSelectExam(exam.id)}
              className="group w-full text-left p-5 border-2 border-slate-200 bg-white rounded-xl shadow-sm hover:border-blue-500 hover:bg-blue-50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              <div className="flex items-center gap-4">
                {isVoiceControlActive && <span className="text-xl font-bold text-blue-600">{index + 1}.</span>}
                <div className="bg-blue-100 p-3 rounded-full transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:bg-blue-200">
                  <IconComponent className="h-7 w-7 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{exam.title}</h3>
                  <p className="text-gray-600 text-sm">{exam.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ExamSelectionScreen;
