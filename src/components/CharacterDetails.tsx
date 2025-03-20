import React, { useEffect, useState } from "react";
import { Character, CharacterDetailsProps } from "../types";
import { fetchCharacterById } from "../services/api";

const CharacterDetails: React.FC<CharacterDetailsProps> = ({
  characterId,
  onClose,
}) => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCharacter = async () => {
      try {
        setLoading(true);
        const data = await fetchCharacterById(characterId);
        setCharacter(data);
      } catch {
        setError("Failed to load character details");
      } finally {
        setLoading(false);
      }
    };

    loadCharacter();
  }, [characterId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading character details...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">{error}</div>
        ) : character ? (
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2">
              <img
                src={character.image}
                alt={character.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 md:w-1/2">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {character.name}
              </h2>

              <div className="space-y-3">
                <div>
                  <span className="font-semibold text-gray-600">Status: </span>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      character.status.toLowerCase() === "alive"
                        ? "bg-green-100 text-green-800"
                        : character.status.toLowerCase() === "dead"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {character.status}
                  </span>
                </div>

                <div>
                  <span className="font-semibold text-gray-600">Species: </span>
                  <span className="text-gray-800">{character.species}</span>
                </div>

                <div>
                  <span className="font-semibold text-gray-600">Gender: </span>
                  <span className="text-gray-800">{character.gender}</span>
                </div>

                <div>
                  <span className="font-semibold text-gray-600">Origin: </span>
                  <span className="text-gray-800">{character.origin.name}</span>
                </div>

                <div>
                  <span className="font-semibold text-gray-600">
                    Location:{" "}
                  </span>
                  <span className="text-gray-800">
                    {character.location.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CharacterDetails;
