import { CharacterApiResponse, Filters, Character } from "../types";

const BASE_URL = "https://rickandmortyapi.com/api";

export const fetchCharacters = async (
  page: number,
  filters: Filters
): Promise<CharacterApiResponse> => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      ...(filters.name && { name: filters.name }),
      ...(filters.species && { species: filters.species }),
      ...(filters.gender && { gender: filters.gender }),
      ...(filters.status && { status: filters.status }),
    });

    const response = await fetch(`${BASE_URL}/character?${queryParams}`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching characters:", error);
    throw error;
  }
};

export const fetchCharacterById = async (id: number): Promise<Character> => {
  try {
    const response = await fetch(`${BASE_URL}/character/${id}`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching character:", error);
    throw error;
  }
};
