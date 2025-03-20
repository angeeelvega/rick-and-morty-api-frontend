import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import CharacterGrid from "../components/CharacterGrid";
import { fetchCharacters } from "../services/api";
import { Character, Filters } from "../types";

const CharactersPage: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    name: "",
    species: "",
    gender: "",
    status: "",
  });
  const [searchTimeout, setSearchTimeout] = useState<number | null>(null);

  useEffect(() => {
    loadCharacters(1, true);
  }, []);

  const loadCharacters = async (
    pageToLoad: number,
    isNewFilter = false,
    newFilters?: Filters
  ) => {
    setLoading(true);
    try {
      const data = await fetchCharacters(pageToLoad, newFilters || filters);
      setHasNextPage(!!data.info.next);

      if (isNewFilter) {
        setCharacters(data.results);
      } else {
        setCharacters((prevCharacters) => {
          const allCharacters: Character[] = [];

          for (const character of prevCharacters) {
            allCharacters.push(character);
          }

          for (const newCharacter of data.results) {
            const characterExists = allCharacters.some(
              (existingChar) => existingChar.id === newCharacter.id
            );

            if (!characterExists) {
              allCharacters.push(newCharacter);
            } else {
              const index = allCharacters.findIndex(
                (char) => char.id === newCharacter.id
              );
              allCharacters[index] = newCharacter;
            }
          }

          return allCharacters;
        });
      }
    } catch (error) {
      console.error("Error loading characters:", error);
      setHasNextPage(false);
      setCharacters([]);
      setPage(1);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (type: string, value: string) => {
    const newFilters = {
      ...filters,
      [type]: value,
    };

    setFilters(newFilters);

    if (type === "name") {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      const timeout = window.setTimeout(() => {
        setPage(1);
        loadCharacters(1, true, {
          ...filters,
          name: value
        });
      }, 1000);

      setSearchTimeout(timeout);
    } else {
      setPage(1);
      loadCharacters(1, true, newFilters);
    }
  };

  const handleLoadMore = () => {
    if (hasNextPage && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadCharacters(nextPage);
    }
  };

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  return (
    <div className="flex flex-col min-h-screen pt-16">
      <Header onFilterChange={handleFilterChange} />
      <CharacterGrid
        characters={characters}
        onLoadMore={handleLoadMore}
        loading={loading}
        hasMore={hasNextPage}
      />
    </div>
  );
};

export default CharactersPage;
