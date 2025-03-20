import React, { useState } from "react";
import { CharacterCardProps } from "../types";
import CharacterDetails from "./CharacterDetails";

const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 cursor-pointer" 
        onClick={() => setShowDetails(true)}
      >
        <div className="relative">
          <img src={character.image} alt={character.name} className="w-full h-64 object-cover" />
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">{character.name}</h2>
          <p className="text-gray-600">{character.species}</p>
        </div>
      </div>

      {showDetails && (
        <CharacterDetails
          characterId={character.id}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
};

export default CharacterCard;
