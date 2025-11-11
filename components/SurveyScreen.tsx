import React, { useState, useEffect } from 'react';
import { StarIcon } from './icons/StarIcon';

interface SurveyScreenProps {
  onSubmit: () => void;
  onSkip: () => void;
  isVoiceControlActive: boolean;
}

const SurveyScreen: React.FC<SurveyScreenProps> = ({ onSubmit, onSkip, isVoiceControlActive }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    let message = "Por favor, valore su experiencia. Su opinión nos ayuda a mejorar.";
    if (isVoiceControlActive) {
        message += " Diga 'Enviar' para mandar sus comentarios o 'Omitir' para finalizar.";
    }
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'es-ES';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    return () => {
        window.speechSynthesis.cancel();
    };
  }, [isVoiceControlActive]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Survey Submitted:', { rating, comment });
    setIsSubmitted(true);
    setTimeout(() => {
      onSubmit();
    }, 2000); // Wait 2 seconds before calling the passed onSubmit function
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <svg className="w-24 h-24 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h2 className="text-2xl font-bold text-gray-800">¡Gracias por sus comentarios!</h2>
        <p className="text-gray-600">Su opinión es muy valiosa para nosotros.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Valore su Experiencia</h2>
      <p className="text-center text-gray-500 mb-8">Su opinión nos ayuda a mejorar el servicio.</p>

      <div className="mb-8">
        <div className="flex justify-center items-center space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              className="focus:outline-none transform transition-transform hover:scale-125"
              aria-label={`Calificar con ${star} estrellas`}
            >
              <StarIcon 
                className={`w-10 h-10 ${ (hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300' }`} 
              />
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
        <label htmlFor="comment" className="text-sm font-medium text-gray-700 mb-2">
          ¿Tiene alguna sugerencia? (Opcional)
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full p-3 bg-slate-100/80 border-2 border-slate-200 rounded-lg shadow-inner-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
          placeholder="Escriba aquí sus comentarios..."
        />
        
        <div className="mt-auto pt-6 space-y-3">
          <button
            type="submit"
            disabled={rating === 0}
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
          >
            Enviar Comentarios
          </button>
          <button
            type="button"
            onClick={onSkip}
            className="w-full text-center text-gray-500 hover:text-gray-700 font-semibold"
          >
            Omitir
          </button>
        </div>
      </form>
    </div>
  );
};

export default SurveyScreen;
