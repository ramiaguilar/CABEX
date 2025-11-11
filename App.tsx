
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Screen, ExamType, Results, ExamOption, HistoricResult, Reminder, ReminderFrequency } from './types';
import { EXAM_OPTIONS } from './constants';
import WelcomeScreen from './components/WelcomeScreen';
import ExamSelectionScreen from './components/ExamSelectionScreen';
import InstructionsScreen from './components/InstructionsScreen';
import InProgressScreen from './components/InProgressScreen';
import ResultsScreen from './components/ResultsScreen';
import HistoryScreen from './components/HistoryScreen';
import IdentificationScreen from './components/IdentificationScreen';
import ReminderScreen from './components/ReminderScreen';
import TicketDispensingScreen from './components/TicketDispensingScreen';
import VoiceControlStatus from './components/VoiceControlStatus';
import SplashScreen from './components/SplashScreen';
import SurveyScreen from './components/SurveyScreen';
import HelpScreen from './components/HelpScreen';
import OfflineIndicator from './components/OfflineIndicator';

// Fix: Add type definitions for the Speech Recognition API.
// This is not a standard part of the TypeScript DOM library, so we define it here
// to avoid compilation errors.
interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}
interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}
interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}
// We use `SpeechRecognitionInstance` to avoid a name collision with the `SpeechRecognition` constant below.
interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  start: () => void;
  stop: () => void;
}

// Fix: Correctly access non-standard properties on the window object.
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const IS_VOICE_RECOGNITION_SUPPORTED = !!SpeechRecognition;


function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [selectedExam, setSelectedExam] = useState<ExamOption | null>(null);
  const [results, setResults] = useState<Results | null>(null);
  const [history, setHistory] = useState<HistoricResult[]>([]);
  const [reminder, setReminder] = useState<Reminder | null>(null);
  const [isVoiceControlActive, setIsVoiceControlActive] = useState(false);
  const [voiceStatusMessage, setVoiceStatusMessage] = useState('Escuchando...');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fix: Use the custom `SpeechRecognitionInstance` type for the ref to avoid name collision errors.
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    window.speechSynthesis.speak(utterance);
  }

  const handleInstructionsComplete = useCallback(() => {
    setCurrentScreen('in_progress');
  }, []);

  const processVoiceCommand = useCallback((command: string) => {
    const lowerCaseCommand = command.toLowerCase().trim();
    console.log(`Comando recibido: "${lowerCaseCommand}" en pantalla: "${currentScreen}"`);
    setVoiceStatusMessage(`Comando: "${command}"`);

    const commandToAction = (action: () => void) => {
        action();
        setTimeout(() => setVoiceStatusMessage('Escuchando...'), 1000);
    };

    switch (currentScreen) {
      case 'welcome':
        if (lowerCaseCommand.includes('iniciar')) commandToAction(handleStartIdentification);
        else if (lowerCaseCommand.includes('anónimo')) commandToAction(handleStartAnonymous);
        else if (lowerCaseCommand.includes('historial')) commandToAction(handleShowHistory);
        else if (lowerCaseCommand.includes('ayuda')) commandToAction(handleShowHelp);
        break;
      case 'identification':
        if (lowerCaseCommand.includes('documento')) commandToAction(() => {}); // DNI requires typing
        else if (lowerCaseCommand.includes('reconocimiento') || lowerCaseCommand.includes('facial')) commandToAction(() => {}); // Specific logic in component
        else if (lowerCaseCommand.includes('volver')) commandToAction(() => setCurrentScreen('welcome'));
        break;
      case 'selection':
        const examIndex = ['uno', 'dos', 'tres', 'cuatro'].indexOf(lowerCaseCommand);
        if (examIndex !== -1) {
            commandToAction(() => handleSelectExam(EXAM_OPTIONS[examIndex].id));
        }
        break;
      case 'instructions':
        if (lowerCaseCommand.includes('comenzar') || lowerCaseCommand.includes('listo') || lowerCaseCommand.includes('iniciar')) commandToAction(handleInstructionsComplete);
        break;
      case 'results':
        if (lowerCaseCommand.includes('imprimir') || lowerCaseCommand.includes('uno')) commandToAction(handlePrintTicketRequest);
        else if (lowerCaseCommand.includes('añadir') || lowerCaseCommand.includes('dos')) commandToAction(handleSaveAndShowHistory);
        else if (lowerCaseCommand.includes('descargar') || lowerCaseCommand.includes('tres')) commandToAction(() => {}); // PDF requires interaction
        else if (lowerCaseCommand.includes('compartir') || lowerCaseCommand.includes('cuatro')) commandToAction(() => {}); // Share requires interaction
        else if (lowerCaseCommand.includes('finalizar')) commandToAction(handleFinish);
        break;
      case 'history':
        if (lowerCaseCommand.includes('agendar') || lowerCaseCommand.includes('recordatorio')) commandToAction(handleNavigateToReminders);
        else if (lowerCaseCommand.includes('volver')) commandToAction(handleReset);
        break;
       case 'ticket_dispensing':
        if (lowerCaseCommand.includes('finalizar')) commandToAction(handleFinish);
        break;
      case 'survey':
        if (lowerCaseCommand.includes('enviar')) {
          commandToAction(handleReset); // Assuming the component handles the submission visually first
        } else if (lowerCaseCommand.includes('omitir')) {
          commandToAction(handleReset);
        }
        break;
      case 'help':
        if (lowerCaseCommand.includes('volver')) commandToAction(() => setCurrentScreen('welcome'));
        break;
      default:
        setVoiceStatusMessage('Comando no reconocido');
        setTimeout(() => setVoiceStatusMessage('Escuchando...'), 2000);
        break;
    }
  }, [currentScreen, handleInstructionsComplete]);

  const toggleVoiceControl = useCallback(() => {
    if (!IS_VOICE_RECOGNITION_SUPPORTED) {
        console.error("El reconocimiento de voz no es compatible y se intentó activar.");
        return;
    }

    if (isVoiceControlActive) {
      recognitionRef.current?.stop();
      setIsVoiceControlActive(false);
      speak("Control por voz desactivado.");
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsVoiceControlActive(true);
        speak("Control por voz activado. Diga un comando.");
      }
    }
  }, [isVoiceControlActive]);
  
  // Global command to activate voice control
  useEffect(() => {
    if (IS_VOICE_RECOGNITION_SUPPORTED) {
      const globalRecognition: SpeechRecognitionInstance = new SpeechRecognition();
      globalRecognition.lang = 'es-ES';
      globalRecognition.continuous = true;
      globalRecognition.interimResults = false;
      
      globalRecognition.onresult = (event) => {
        const command = event.results[event.results.length - 1][0].transcript;
        if (!isVoiceControlActive && command.toLowerCase().includes('activar modo voz')) {
            toggleVoiceControl();
        }
      };
      globalRecognition.start();
      return () => globalRecognition.stop();
    }
  }, [isVoiceControlActive, toggleVoiceControl]);


  useEffect(() => {
    if (IS_VOICE_RECOGNITION_SUPPORTED) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'es-ES';
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const command = event.results[event.results.length - 1][0].transcript;
        processVoiceCommand(command);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Error en reconocimiento de voz:', event.error);
        setVoiceStatusMessage('Error. Intente de nuevo.');
      };

    }
  }, [processVoiceCommand]);


  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('cabexHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
      const storedReminder = localStorage.getItem('cabexReminder');
      if (storedReminder) {
        setReminder(JSON.parse(storedReminder));
      }
    } catch (error) {
      console.error("Failed to parse data from localStorage", error);
    }
  }, []);
  
  const handleStart = useCallback(() => {
    setCurrentScreen('welcome');
  }, []);

  const handleStartIdentification = useCallback(() => {
    setCurrentScreen('identification');
  }, []);
  
  const handleStartAnonymous = useCallback(() => {
    setCurrentScreen('selection');
  }, []);

  const handleIdentificationComplete = useCallback(() => {
    setCurrentScreen('selection');
  }, []);

  const handleSelectExam = useCallback((examId: ExamType) => {
    const exam = EXAM_OPTIONS.find(opt => opt.id === examId) || null;
    setSelectedExam(exam);
    setCurrentScreen('instructions');
  }, []);

  const getNextReminderDate = (frequency: ReminderFrequency): Date => {
    const now = new Date();
    switch (frequency) {
      case 'monthly':
        return new Date(now.setMonth(now.getMonth() + 1));
      case 'quarterly':
        return new Date(now.setMonth(now.getMonth() + 3));
      case 'biannually':
        return new Date(now.setMonth(now.getMonth() + 6));
      case 'annually':
        return new Date(now.setFullYear(now.getFullYear() + 1));
    }
  };

  const handleProcessComplete = useCallback(() => {
    if (isOffline) {
        // Handle offline result generation if needed, or show error
        console.log("Cannot generate results while offline.");
        // For demonstration, we'll just go back to welcome screen
        setCurrentScreen('welcome');
        return;
    }
    const randomizer = Math.random();
    let mockResults: Results;

    if (randomizer < 0.5) { // 50% chance of Normal
      mockResults = {
        pressure: '120/80',
        pressureStatus: 'Normal',
        oxygen: '98%',
        oxygenStatus: 'Normal',
      };
    } else if (randomizer < 0.8) { // 30% chance of Attention
      mockResults = {
        pressure: '145/92',
        pressureStatus: 'Atención',
        oxygen: '94%',
        oxygenStatus: 'Normal',
      };
    } else { // 20% chance of Danger
      mockResults = {
        pressure: '180/120',
        pressureStatus: 'Peligro',
        oxygen: '89%',
        oxygenStatus: 'Peligro',
      };
    }

    setResults(mockResults);
    setCurrentScreen('results');
  }, [isOffline]);

  const handleSaveAndShowHistory = useCallback(() => {
    if (!results || !selectedExam) return;

    const newResult: HistoricResult = {
      ...results,
      date: new Date().toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      examTitle: selectedExam.title,
    };

    const updatedHistory = [...history, newResult];
    setHistory(updatedHistory);
    localStorage.setItem('cabexHistory', JSON.stringify(updatedHistory));

    // Reschedule reminder if it exists
    if (reminder) {
      const nextDate = getNextReminderDate(reminder.frequency);
      const updatedReminder = { ...reminder, nextDate: nextDate.toISOString() };
      setReminder(updatedReminder);
      localStorage.setItem('cabexReminder', JSON.stringify(updatedReminder));
    }
    
    setCurrentScreen('history');
  }, [results, selectedExam, history, reminder]);

  const handleReset = useCallback(() => {
    setCurrentScreen('splash');
    setSelectedExam(null);
    setResults(null);
  }, []);

  const handleFinish = useCallback(() => {
    setCurrentScreen('survey');
  }, []);

  const handleShowHistory = useCallback(() => {
    setCurrentScreen('history');
  }, []);

  const handleShowHelp = useCallback(() => {
    setCurrentScreen('help');
  }, []);

  const handleNavigateToReminders = useCallback(() => {
    setCurrentScreen('reminder');
  }, []);

  const handleSetReminder = useCallback((frequency: ReminderFrequency) => {
    const nextDate = getNextReminderDate(frequency);
    const newReminder = { frequency, nextDate: nextDate.toISOString() };
    setReminder(newReminder);
    localStorage.setItem('cabexReminder', JSON.stringify(newReminder));
    setCurrentScreen('history');
  }, []);

  const handleClearReminder = useCallback(() => {
    setReminder(null);
    localStorage.removeItem('cabexReminder');
    setCurrentScreen('history');
  }, []);

  const handlePrintTicketRequest = useCallback(() => {
    console.log('Simulating printing ticket...');
    setCurrentScreen('ticket_dispensing');
  }, []);

  const renderScreen = () => {
    const commonProps = { isVoiceControlActive };
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onStart={handleStart} />;
      case 'welcome':
        return <WelcomeScreen onStartArgentina={handleStartIdentification} onStartAnonymous={handleStartAnonymous} onShowHistory={handleShowHistory} onShowHelp={handleShowHelp} reminder={reminder} onToggleVoiceControl={toggleVoiceControl} isVoiceRecognitionSupported={IS_VOICE_RECOGNITION_SUPPORTED} />;
      case 'identification':
        return <IdentificationScreen onComplete={handleIdentificationComplete} onBack={() => setCurrentScreen('welcome')} {...commonProps} />;
      case 'selection':
        return <ExamSelectionScreen onSelectExam={handleSelectExam} {...commonProps} />;
      case 'instructions':
        return <InstructionsScreen exam={selectedExam} onComplete={handleInstructionsComplete} {...commonProps} />;
      case 'in_progress':
        return <InProgressScreen examTitle={selectedExam?.title || ''} onComplete={handleProcessComplete} {...commonProps} />;
      case 'results':
        return <ResultsScreen results={results} onFinish={handleFinish} examTitle={selectedExam?.title || ''} onSaveAndShowHistory={handleSaveAndShowHistory} onPrintTicket={handlePrintTicketRequest} {...commonProps} />;
      case 'history':
        return <HistoryScreen history={history} onBack={handleReset} onScheduleReminder={handleNavigateToReminders} {...commonProps} />;
      case 'reminder':
        return <ReminderScreen currentReminder={reminder} onSetReminder={handleSetReminder} onClearReminder={handleClearReminder} onBack={() => setCurrentScreen('history')} {...commonProps} />;
       case 'ticket_dispensing':
        return <TicketDispensingScreen onFinish={handleFinish} {...commonProps} />;
       case 'survey':
        return <SurveyScreen onSubmit={handleReset} onSkip={handleReset} {...commonProps} />;
      case 'help':
        return <HelpScreen onBack={() => setCurrentScreen('welcome')} {...commonProps} />;
      default:
        return <SplashScreen onStart={handleStart} />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-slate-200 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl shadow-slate-300/60 border border-white/90 overflow-hidden h-[90vh] max-h-[900px] flex flex-col relative">
        {isOffline && <OfflineIndicator />}
        <main className="flex-grow p-6 overflow-y-auto">
          {renderScreen()}
        </main>
        {isVoiceControlActive && <VoiceControlStatus message={voiceStatusMessage} />}
      </div>
    </div>
  );
}

export default App;
