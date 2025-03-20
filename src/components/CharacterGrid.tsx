import React from 'react';
import CharacterCard from './CharacterCard';
import { CharacterGridProps } from '../types';

const CharacterGrid: React.FC<CharacterGridProps> = ({ 
  characters, 
  onLoadMore, 
  loading = false,
  hasMore = true
}) => {
  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
        {characters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
          />
        ))}
      </div>
      
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="px-6 py-2 bg-[#F2F9FE] text-blue rounded-md hover:bg-[#00a0b5] shadow-md"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CharacterGrid; 