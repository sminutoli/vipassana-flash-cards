import React from 'react';
import { CloseIcon } from '../constants';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  allTags: string[];
  activeTags: string[];
  onTagToggle: (tag: string) => void;
  onClearFilters: () => void;
}

const FilterPanelComponent: React.FC<FilterPanelProps> = ({
  isOpen,
  onClose,
  allTags,
  activeTags,
  onTagToggle,
  onClearFilters
}) => {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 z-30 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold">Filtrar por Etiqueta</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-grow p-4 overflow-y-auto">
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => {
                const isActive = activeTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => onTagToggle(tag)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-colors ${
                      isActive
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="p-4 border-t border-gray-200">
            <button
                onClick={onClearFilters}
                className="w-full py-2 px-4 text-center bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition-colors disabled:opacity-50"
                disabled={activeTags.length === 0}
            >
                Limpiar Filtros
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterPanelComponent;
