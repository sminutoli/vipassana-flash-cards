
import { useState, useEffect, useCallback } from 'react';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const populateVoiceList = useCallback(() => {
    const newVoices = window.speechSynthesis.getVoices();
    setVoices(newVoices);
  }, []);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      setSupported(true);
      populateVoiceList();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = populateVoiceList;
      }
    }
  }, [populateVoiceList]);

  const speak = useCallback((text: string) => {
    if (!supported || isSpeaking) return;

    // Clean up HTML tags for better speech synthesis
    const plainText = text.replace(/<[^>]*>?/gm, '');

    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.lang = 'es-ES'; // Set language to Spanish

    // Find a preferred, more natural-sounding voice
    const spanishVoices = voices.filter(voice => voice.lang.startsWith('es-'));
    const googleVoice = spanishVoices.find(voice => voice.name.includes('Google'));
    const preferredVoice = googleVoice || spanishVoices[0]; // Fallback to the first available Spanish voice

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [supported, isSpeaking, voices]);

  const cancel = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [supported]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (supported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [supported]);


  return { speak, cancel, isSpeaking, supported };
};
