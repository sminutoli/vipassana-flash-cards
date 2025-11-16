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
    utterance.lang = 'es-AR'; // Set language to Argentinian Spanish

    // --- Voice Selection Logic ---
    // 1. Prioritize Argentinian Spanish voices
    let preferredVoices = voices.filter(voice => ['es-AR', 'es-MX', 'es-CO', 'es-LA'].includes(voice.lang) );

    // 2. If no specific 'es-AR' voice, fall back to any Spanish voice
    if (preferredVoices.length === 0) {
        preferredVoices = voices.filter(voice => voice.lang.startsWith('es-'));
    }

    // 3. From the available list, prefer a higher quality 'Google' voice
    const googleVoice = preferredVoices.find(voice => voice.name.includes('Google'));
    const selectedVoice = googleVoice || preferredVoices[0]; // Fallback to the first available in the list

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang; // Ensure utterance lang matches the selected voice
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
