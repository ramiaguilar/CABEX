import React, { useState } from 'react';
import { Reminder, ReminderFrequency } from '../types';

interface ReminderScreenProps {
  currentReminder: Reminder | null;
  onSetReminder: (frequency: ReminderFrequency) => void;
  onClearReminder: () => void;
  onBack: () => void;
  isVoiceControlActive: boolean;
}

const frequencyOptions: { id: ReminderFrequency; label: string }[] = [
  { id: 'monthly', label: 'Mensual' },
  { id: 'quarterly', label: 'Trimestral' },
  { id: 'biannually', label: 'Semestral' },
  { id: 'annually', label: 'Anual' },
];

const ReminderScreen: React.FC<ReminderScreenProps> = ({ currentReminder, onSetReminder, onClearReminder, onBack, isVoiceControlActive }) => {
  const [selectedFrequency, setSelectedFrequency] = useState<ReminderFrequency | null>(currentReminder?.frequency || null);

  const handleSave = () => {
    if (selectedFrequency) {
      onSetReminder(selectedFrequency);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Recordatorio de Chequeo</h2>
      <p className="text-center text-gray-500 mb-6">Seleccione la frecuencia para recibir un aviso.</p>

      {currentReminder && (
        <div className="bg-blue-50 border-2 border-blue-200 text-blue-800 p-3 rounded-lg mb-6 text-center">
            <p className="text-sm">Su próximo chequeo está agendado para el:</p>
            <p className="font-semibold text-lg">
                {new Date(currentReminder.nextDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
        </div>
      )}

      <div className="space-y-3">
        {frequencyOptions.map(({ id, label }, index) => (
          <button
            key={id}
            onClick={() => setSelectedFrequency(id)}
            className={`w-full text-left p-4 border-2 rounded-lg transition-all duration-200 flex items-center gap-4 text-lg ${
              selectedFrequency === id
                ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-lg shadow-blue-500/30'
                : 'bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            {isVoiceControlActive && <span className="text-lg font-bold">{index + 1}.</span>}
            <span className="flex-1">{label}</span>
            {selectedFrequency === id && (
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                 <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="mt-auto pt-6 space-y-3">
        <button
          onClick={handleSave}
          disabled={!selectedFrequency}
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
        >
          {currentReminder ? 'Actualizar Recordatorio' : 'Guardar Recordatorio'}
        </button>
        {currentReminder && (
            <button
                onClick={onClearReminder}
                className="w-full bg-red-500 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-red-600 transition-colors"
            >
                Cancelar Recordatorio
            </button>
        )}
        <button 
          onClick={onBack}
          className="w-full text-center text-gray-500 hover:text-gray-700 font-semibold pt-2"
        >
          Volver
        </button>
      </div>
    </div>
  );
};

export default ReminderScreen;
