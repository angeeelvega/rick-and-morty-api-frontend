export interface ApiResponse<T> {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: T[];
}

export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface CharacterCardProps {
  character: Character;
}

export interface CharacterDetailsProps {
  characterId: number;
  onClose: () => void;
}

export interface CharacterGridProps {
  characters: Character[];
  onLoadMore: () => void;
  loading?: boolean;
  hasMore?: boolean;
}

export interface MainContainerProps {
  children: React.ReactNode;
}

export interface Filters {
  name?: string;
  status?: string;
  species?: string;
  type?: string;
  gender?: string;
}

export interface FilterProps {
  onFilterChange: (key: keyof Filters, value: string) => void;
}

export type CharacterApiResponse = ApiResponse<Character>;
