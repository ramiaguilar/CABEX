import React, { useEffect } from 'react';
// Fix: Import `ExamType` to resolve the 'Cannot find name' error.
import { ExamOption, ExamType } from '../types';
import { SpirometerIcon } from './icons/SpirometerIcon';
import { PressureCuffIcon } from './icons/PressureCuffIcon';
import { OxygenIcon } from './icons/OxygenIcon';
import { ScaleIcon } from './icons/ScaleIcon';
import { GlucometerIcon } from './icons/GlucometerIcon';

interface InstructionsScreenProps {
  exam: ExamOption | null;
  onComplete: () => void;
  isVoiceControlActive: boolean;
}

interface InstructionStep {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  text: string;
}

const INSTRUCTIONS_DATA: { [key in ExamType]?: InstructionStep[] } = {
  integral: [
    { icon: ScaleIcon, text: 'Súbase a la balanza ubicada en el piso de la cabina y quédese quieto.' },
    { icon: PressureCuffIcon, text: 'Coloque el brazalete de presión en su brazo izquierdo, dos dedos por encima del codo.' },
    { icon: OxygenIcon, text: 'Introduzca su dedo índice en el oxímetro hasta el fondo y no se mueva.' },
    { icon: GlucometerIcon, text: 'Utilice el glucómetro para tomar una muestra de sangre como se indica.' },
    { icon: SpirometerIcon, text: 'Tome el espirómetro y sople con fuerza y de forma continua.' },
  ],
  rapido: [
    { icon: PressureCuffIcon, text: 'Coloque el brazalete de presión en su brazo izquierdo, dos dedos por encima del codo.' },
    { icon: OxygenIcon, text: 'Introduzca su dedo índice en el oxímetro hasta el fondo y no se mueva.' },
  ],
  respiratorio: [
    { icon: SpirometerIcon, text: 'Tome el espirómetro a su derecha, coloque la boquilla y sople con fuerza y de forma continua.' },
  ],
  pulmonar: [
    { icon: SpirometerIcon, text: 'Tome el espirómetro a su derecha, coloque la boquilla y sople con fuerza y de forma continua.' },
    { icon: OxygenIcon, text: 'Introduzca su dedo índice en el oxímetro hasta el fondo y no se mueva.' },
  ],
};

const InstructionsScreen: React.FC<InstructionsScreenProps> = ({ exam, onComplete, isVoiceControlActive }) => {
  const instructions = exam ? INSTRUCTIONS_DATA[exam.id] : [];

  useEffect(() => {
    if (!exam || !instructions) return;
    
    const intro = `Para su ${exam.title}, por favor siga estas instrucciones.`;
    const stepsText = instructions.map((step, index) => `Paso ${index + 1}: ${step.text}`).join(' ');
    let message = `${intro} ${stepsText}`;

    if (isVoiceControlActive) {
      message += " Cuando esté listo, diga 'Comenzar'.";
    }

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'es-ES';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [exam, instructions, isVoiceControlActive]);

  if (!exam) {
    return <div>Cargando instrucciones...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Preparación para su Examen</h2>
      <p className="text-center text-gray-500 mb-6">{exam.title}</p>

      <div className="space-y-4 flex-grow overflow-y-auto pr-2">
        {instructions && instructions.map((step, index) => {
          const IconComponent = step.icon;
          return (
            <div key={index} className="flex items-start gap-4 p-4 bg-slate-50/70 border border-slate-200 rounded-lg">
              <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                <IconComponent className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-gray-700 font-medium leading-relaxed self-center">
                {step.text}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-auto pt-6">
        <button
          onClick={onComplete}
          className="w-full bg-blue-600 text-white text-lg font-bold py-4 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105"
        >
          Estoy Listo, Comenzar
        </button>
      </div>
    </div>
  );
};

export default InstructionsScreen;