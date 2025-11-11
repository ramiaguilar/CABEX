import React, { useState, useEffect } from 'react';
import { DniIcon } from './icons/DniIcon';
import { FaceScanIcon } from './icons/FaceScanIcon';
import { CameraIcon } from './icons/CameraIcon';
import { CheckIcon } from './icons/CheckIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface IdentificationScreenProps {
  onComplete: () => void;
  onBack: () => void;
  isVoiceControlActive: boolean;
}

const IdentificationScreen: React.FC<IdentificationScreenProps> = ({ onComplete, onBack, isVoiceControlActive }) => {
  const [activeTab, setActiveTab] = useState<'dni' | 'face'>('dni');
  const [dni, setDni] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isDniScanning, setIsDniScanning] = useState(false);
  const [dniError, setDniError] = useState('');
  const [isDniValid, setIsDniValid] = useState<boolean | null>(null);

  useEffect(() => {
    let message = "Verificación de Identidad. Por favor, seleccione un método para continuar.";
     if (isVoiceControlActive) {
      message += " Diga 'Documento' o 'Reconocimiento Facial'. También puede decir 'Volver'."
    }
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'es-ES';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [isVoiceControlActive]);

  const handleFaceScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      onComplete();
    }, 2500); // Simulate face scanning for 2.5 seconds
  };
  
  const handleDniScan = () => {
    setIsDniScanning(true);
    setDniError('');
    setTimeout(() => {
      // Simulate a successful scan by populating with a random DNI
      const randomDni = Math.floor(10000000 + Math.random() * 90000000).toString();
      setDni(randomDni);
      setIsDniValid(true);
      setDniError('');
      setIsDniScanning(false);
    }, 3000); // Simulate scanning for 3 seconds
  };

  const handleDniChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    const truncatedValue = value.slice(0, 8);
    setDni(truncatedValue);

    if (truncatedValue === '') {
        setIsDniValid(null);
        setDniError('');
    } else {
        const isValid = /^\d{7,8}$/.test(truncatedValue);
        setIsDniValid(isValid);
        if (isValid) {
            setDniError('');
        } else {
            setDniError('El DNI debe contener 7 u 8 dígitos numéricos.');
        }
    }
  };

  const handleDniSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDniValid) {
      onComplete();
    } else if (dni === '') {
      setDniError('Por favor, ingrese su DNI.');
    }
    // The error message for invalid format is already handled by handleDniChange
  };

  const TabButton: React.FC<{ tabId: 'dni' | 'face'; children: React.ReactNode }> = ({ tabId, children }) => (
    <button
      onClick={() => setActiveTab(tabId)}
      className={`flex-1 p-4 font-semibold text-center transition-all duration-300 border-b-2 ${
        activeTab === tabId
          ? 'text-blue-600 border-blue-600'
          : 'text-gray-500 border-transparent hover:bg-slate-100/50 hover:text-blue-500'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Identificación</h2>
      <p className="text-center text-gray-500 mb-6">Acceda a su historial y guarde sus resultados.</p>
      
      <div className="flex">
        <TabButton tabId="dni">
          <div className="flex items-center justify-center gap-2">
            <DniIcon className="h-5 w-5" />
            <span>Usar DNI</span>
          </div>
        </TabButton>
        <TabButton tabId="face">
          <div className="flex items-center justify-center gap-2">
            <FaceScanIcon className="h-5 w-5" />
            <span>Reconocimiento Facial</span>
          </div>
        </TabButton>
      </div>

      <div className="flex-grow pt-8">
        {activeTab === 'dni' && (
           <div className="relative">
             {isDniScanning && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center text-center z-10 rounded-lg">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-700 font-semibold">Apunte la cámara al frente de su DNI</p>
                    <p className="text-sm text-gray-500">Manténgalo quieto...</p>
                </div>
            )}
            <form onSubmit={handleDniSubmit} className="space-y-4">
              <div>
                <label htmlFor="dni" className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Documento
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    id="dni"
                    value={dni}
                    onChange={handleDniChange}
                    className={`w-full pl-4 pr-10 py-3 bg-slate-100/80 border-2 rounded-lg shadow-inner-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-lg transition-colors ${
                      isDniValid === false
                        ? 'border-red-400 ring-red-300 focus:border-red-500 focus:ring-red-400'
                        : isDniValid === true
                        ? 'border-green-500 ring-green-300 focus:border-green-600 focus:ring-green-400'
                        : 'border-slate-200 focus:ring-blue-400 focus:border-blue-500'
                    }`}
                    placeholder="Ingrese su DNI"
                    required
                    aria-invalid={isDniValid === false}
                    aria-describedby="dni-error"
                    disabled={isDniScanning}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    {isDniValid === true && <CheckIcon className="h-6 w-6 text-green-500" />}
                    {isDniValid === false && dni.length > 0 && <XCircleIcon className="h-6 w-6 text-red-500" />}
                  </div>
                </div>

                {dniError && (
                  <p id="dni-error" className="mt-2 text-sm text-red-600">
                    {dniError}
                  </p>
                )}
              </div>
               <button
                  type="button"
                  onClick={handleDniScan}
                  disabled={isDniScanning}
                  className="w-full flex items-center justify-center gap-3 bg-slate-100 text-slate-800 font-bold py-3 px-4 rounded-lg hover:bg-slate-200 disabled:bg-slate-200/50 disabled:cursor-not-allowed transition-colors border border-slate-200"
                >
                  <CameraIcon className="h-5 w-5" />
                  Escanear DNI con la Cámara
              </button>
              <button
                type="submit"
                disabled={isDniScanning || !isDniValid}
                className="w-full bg-blue-600 text-white font-bold py-4 px-4 rounded-lg shadow-md shadow-blue-500/30 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
              >
                Continuar
              </button>
            </form>
          </div>
        )}
        {activeTab === 'face' && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            {isScanning ? (
              <>
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Escaneando...</p>
                <p className="text-sm text-gray-500">Mantenga su rostro dentro del marco.</p>
              </>
            ) : (
              <>
                <FaceScanIcon className="h-24 w-24 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">Coloque su rostro frente a la cámara de la cabina para escanear.</p>
                <button
                  onClick={handleFaceScan}
                  className="w-full bg-blue-600 text-white font-bold py-4 px-4 rounded-lg shadow-md shadow-blue-500/30 hover:bg-blue-700 transition-colors"
                >
                  Escanear Rostro
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="mt-auto pt-6">
        <button onClick={onBack} className="w-full text-center text-gray-500 hover:text-gray-700 font-semibold">
          Volver
        </button>
      </div>
    </div>
  );
};

export default IdentificationScreen;
