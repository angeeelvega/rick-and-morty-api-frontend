export interface Character {
  id: number;
  name: string;
  species: string;
  image: string;
}

export interface ApiResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Character[];
} 