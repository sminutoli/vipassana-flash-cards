import { useState, useEffect, useMemo, useCallback } from 'react';
import { fullDeck as allCardIds } from './data/deck';
import { tagToIdsMap } from './data/tag-index';
import { getCardById, preloadBatchForCardId } from './data/batch-loader';
import { Flashcard } from './types';
import FlashcardComponent from './components/FlashcardComponent';
import ControlsComponent from './components/ControlsComponent';
import FilterPanelComponent from './components/FilterPanelComponent';

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

function App() {
  const [deck, setDeck] = useState<number[]>(allCardIds);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const allTags = useMemo(() => {
    return Object.keys(tagToIdsMap).sort();
  }, []);

  useEffect(() => {
    let newDeckIds: number[];
    if (activeTags.length === 0) {
      newDeckIds = allCardIds;
    } else {
      // Calculate the UNION of card IDs for the active tags.
      const union = new Set<number>();
      activeTags.forEach(tag => {
        const idsForTag = tagToIdsMap[tag] || [];
        idsForTag.forEach(id => union.add(id));
      });
      newDeckIds = Array.from(union).sort((a, b) => a - b);
    }
    setDeck(shuffleArray(newDeckIds)); // Shuffle on filter change
    setCurrentIndex(0);
  }, [activeTags]);

  useEffect(() => {
    const loadCard = async () => {
      if (deck.length > 0 && currentIndex < deck.length) {
        setIsLoading(true);
        const cardId = deck[currentIndex];
        const cardData = await getCardById(cardId);
        setCurrentCard(cardData || null);
        setIsLoading(false);

        // Preload next card's batch to make navigation smoother
        if (currentIndex + 1 < deck.length) {
          const nextCardId = deck[currentIndex + 1];
          await preloadBatchForCardId(nextCardId);
        }
      } else {
        setCurrentCard(null);
        setIsLoading(false);
      }
    };
    loadCard();
  }, [currentIndex, deck]);
  
  useEffect(() => {
    const handleKeyDown = (e:KeyboardEvent) => {
      if(e.key === 'ArrowLeft') handlePrev();
      if(e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, deck])

  const handleShuffle = useCallback(() => {
    setDeck(prev => shuffleArray(prev));
    setCurrentIndex(0);
  }, []);

  const handleNext = () => {
    if (currentIndex < deck.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleTagToggle = (tag: string) => {
    setActiveTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleClearFilters = () => {
    setActiveTags([]);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="w-full max-w-2xl mx-auto text-center h-96 md:h-[28rem] flex flex-col justify-center items-center bg-stone-50 rounded-xl shadow-2xl p-8 border border-stone-200">
          <h2 className="text-2xl font-bold">Cargando...</h2>
        </div>
      );
    }
    if (currentCard) {
      return <FlashcardComponent key={currentCard.id} card={currentCard} />;
    }
    return (
      <div className="w-full max-w-2xl mx-auto text-center h-96 md:h-[28rem] flex flex-col justify-center items-center bg-stone-50 rounded-xl shadow-2xl p-8 border border-stone-200">
        <h2 className="text-2xl font-bold mb-4">No se encontraron tarjetas</h2>
        <p className="text-gray-600">Pruebe a cambiar los filtros o a borrarlos.</p>
        <button
          onClick={handleClearFilters}
          className="mt-6 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          Limpiar Filtros
        </button>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 text-gray-900 min-h-screen flex flex-col items-center justify-center p-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold">Un almacén de respuestas</h1>
        <p className="text-lg text-gray-600 mt-2">Compilación de preguntas y respuestas de SN Goenka sobre Vipassana</p>
      </header>

      <main className="w-full flex flex-col items-center justify-center">
        {renderContent()}
      </main>

      <footer className="w-full flex justify-center mt-8">
        <ControlsComponent
          onPrev={handlePrev}
          onNext={handleNext}
          onShuffle={handleShuffle}
          onFilterToggle={() => setIsFilterPanelOpen(true)}
          currentIndex={currentIndex}
          totalCards={deck.length}
          hasCards={deck.length > 0}
        />
      </footer>

      <FilterPanelComponent
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        allTags={allTags}
        activeTags={activeTags}
        onTagToggle={handleTagToggle}
        onClearFilters={handleClearFilters}
      />
    </div>
  );
}

export default App;
