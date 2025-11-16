import React from 'react';
import { ArrowLeftIcon, ArrowRightIcon, ShuffleIcon, FilterIcon } from '../constants';

interface ControlsProps {
  onPrev: () => void;
  onNext: () => void;
  onShuffle: () => void;
  onFilterToggle: () => void;
  currentIndex: number;
  totalCards: number;
  hasCards: boolean;
}

const ControlsComponent: React.FC<ControlsProps> = ({
  onPrev,
  onNext,
  onShuffle,
  onFilterToggle,
  currentIndex,
  totalCards,
  hasCards
}) => {
  return (
    <div className="flex items-center justify-center space-x-2 md:space-x-4 mt-8">
      <button
        onClick={onShuffle}
        disabled={!hasCards}
        className="p-3 rounded-full bg-white text-gray-700 shadow-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Shuffle deck"
      >
        <ShuffleIcon className="w-6 h-6" />
      </button>

      <button
        onClick={onPrev}
        disabled={!hasCards || currentIndex === 0}
        className="p-3 rounded-full bg-white text-gray-700 shadow-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous card"
      >
        <ArrowLeftIcon className="w-6 h-6" />
      </button>

      <div className="font-semibold text-lg text-gray-700 w-24 text-center">
        {hasCards ? `${currentIndex + 1} / ${totalCards}` : '0 / 0'}
      </div>

      <button
        onClick={onNext}
        disabled={!hasCards || currentIndex === totalCards - 1}
        className="p-3 rounded-full bg-white text-gray-700 shadow-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next card"
      >
        <ArrowRightIcon className="w-6 h-6" />
      </button>

      <button
        onClick={onFilterToggle}
        className="p-3 rounded-full bg-white text-gray-700 shadow-md hover:bg-gray-100 transition-colors"
        aria-label="Filter cards"
      >
        <FilterIcon className="w-6 h-6" />
      </button>
    </div>
  );
};

export default ControlsComponent;
