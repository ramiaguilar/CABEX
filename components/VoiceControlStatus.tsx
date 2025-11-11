import React from 'react';

interface VoiceControlStatusProps {
  message: string;
}

const MicrophoneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" y1="19" x2="12" y2="23"></line>
    <line x1="8" y1="23" x2="16" y2="23"></line>
  </svg>
);


const VoiceControlStatus: React.FC<VoiceControlStatusProps> = ({ message }) => {
  const isListening = message.toLowerCase() === 'escuchando...';

  return (
    <div className="absolute bottom-4 right-4 bg-blue-600/90 backdrop-blur-sm text-white rounded-full p-2 pr-4 shadow-lg flex items-center gap-2 border border-white/20">
      <div className={`w-8 h-8 flex items-center justify-center rounded-full ${isListening ? 'animate-mic-pulse bg-white/20' : ''}`}>
        <MicrophoneIcon className="h-5 w-5" />
      </div>
      <span className="text-sm font-semibold">{message}</span>
    </div>
  );
};

export default VoiceControlStatus;
