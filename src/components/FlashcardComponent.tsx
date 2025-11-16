import React, { useState, useEffect } from 'react';
import { Flashcard } from '../types';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { SpeakerIcon, StopIcon } from '../constants';

interface FlashcardProps {
  card: Flashcard;
}

const FlashcardComponent: React.FC<FlashcardProps> = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { speak, cancel, isSpeaking, supported } = useSpeechSynthesis();

  useEffect(() => {
    setIsFlipped(false);
    cancel();
  }, [card.id, cancel]);

  useEffect(() => {
    const handleKeyDown = (e:KeyboardEvent) => {
      if(e.key === ' ') handleFlip();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped])

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  const handleSpeech = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) {
        cancel();
    } else {
        const textToSpeak = isFlipped ? card.respuesta : card.pregunta;
        speak(textToSpeak);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto perspective" onClick={handleFlip}>
      <div className={`relative w-full h-96 md:h-[28rem] preserve-3d transition-transform duration-700 ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Front of the card */}
        <div className="absolute w-full h-full backface-hidden rounded-xl shadow-2xl bg-stone-50 border border-stone-200 flex items-center justify-center p-8 text-center">
          <h1 className="text-2xl md:text-3xl text-gray-800 leading-relaxed">{card.pregunta}</h1>
        </div>

        {/* Back of the card */}
        <div className="absolute w-full h-full backface-hidden rounded-xl shadow-2xl bg-stone-50 border border-stone-200 flex flex-col p-6 md:p-8 rotate-y-180 overflow-y-auto">
          <div className="prose prose-lg max-w-none flex-grow" dangerouslySetInnerHTML={{ __html: card.respuesta }} />
          <div className="flex-shrink-0 mt-6 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {card.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-teal-100 text-teal-800 text-sm font-medium rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      {supported && (
        <button
          onClick={handleSpeech}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          aria-label={isSpeaking ? "Stop speech" : "Read text"}
        >
          {isSpeaking ? <StopIcon className="w-6 h-6" /> : <SpeakerIcon className="w-6 h-6" />}
        </button>
      )}
    </div>
  );
};

export default FlashcardComponent;
