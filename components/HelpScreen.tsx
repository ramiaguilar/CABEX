
import React, { useState, useEffect } from 'react';

interface HelpScreenProps {
  onBack: () => void;
  isVoiceControlActive: boolean;
}

const faqs = [
  {
    question: '¿Qué es CABEX?',
    answer: 'CABEX es una cabina de autochequeo médico que le permite realizarse mediciones de salud básicas de forma rápida y sencilla. Los resultados se entregan al instante.'
  },
  {
    question: '¿Mis datos están seguros?',
    answer: 'Sí, su privacidad es nuestra prioridad. Todos los datos se manejan de forma segura. Si elige identificarse, sus resultados se asocian a su historial de forma encriptada. Los chequeos anónimos no guardan ninguna información personal.'
  },
  {
    question: '¿Necesito preparación para el chequeo?',
    answer: 'No se requiere una preparación especial. Solo asegúrese de estar tranquilo y siga las instrucciones que se le indican en la pantalla para cada medición. Para la presión arterial, es recomendable no haber consumido cafeína ni haber hecho ejercicio intenso 30 minutos antes.'
  },
  {
    question: '¿Qué significan los resultados?',
    answer: 'La aplicación le mostrará sus valores y los marcará como "Normal", "Atención" o "Peligro" según rangos médicos estándar. Sin embargo, estos resultados no reemplazan un diagnóstico médico. Siempre debe consultar a un profesional de la salud para una interpretación completa.'
  },
  {
    question: '¿Puedo usar la cabina si tengo un marcapasos?',
    answer: 'Si tiene un marcapasos u otro dispositivo médico implantado, consulte a su médico antes de utilizar la cabina, especialmente las funciones que involucran mediciones eléctricas o de peso.'
  },
  {
    question: '¿Cómo funciona el control por voz?',
    answer: 'Puede activar el control por voz desde la pantalla de bienvenida. Una vez activo, simplemente diga los comandos que aparecen en pantalla o los números asociados a las opciones para navegar por la aplicación sin usar las manos. Diga "Activar modo voz" en la pantalla de bienvenida para empezar.'
  }
];

const AccordionItem: React.FC<{ q: string, a: string, isOpen: boolean, onClick: () => void }> = ({ q, a, isOpen, onClick }) => {
  return (
    <div className="border-b border-slate-200">
      <button onClick={onClick} className="w-full flex justify-between items-center text-left p-4 hover:bg-slate-50 focus:outline-none">
        <span className="font-semibold text-gray-800">{q}</span>
        <svg className={`w-5 h-5 text-gray-500 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="p-4 pt-0 text-gray-600">
          <p>{a}</p>
        </div>
      </div>
    </div>
  )
}

const HelpScreen: React.FC<HelpScreenProps> = ({ onBack, isVoiceControlActive }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    let message = "Ayuda y Preguntas Frecuentes. Aquí encontrará respuestas a las dudas más comunes.";
    if (isVoiceControlActive) {
      message += " Diga 'Volver' para regresar al inicio."
    }
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'es-ES';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [isVoiceControlActive]);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Ayuda y Preguntas Frecuentes</h2>
      
      <div className="flex-grow overflow-y-auto pr-2 -mr-2">
        <div className="bg-white rounded-lg border border-slate-200">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              q={faq.question} 
              a={faq.answer}
              isOpen={openIndex === index}
              onClick={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
      
      <div className="mt-auto pt-6">
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

export default HelpScreen;
