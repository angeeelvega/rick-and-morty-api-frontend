import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import * as apiService from "../../services/api";
import CharactersPage from "../../pages/CharactersPage";

const mockCharacters = {
  info: {
    count: 2,
    pages: 1,
    next: "https://rickandmortyapi.com/api/character?page=2",
    prev: null,
  },
  results: [
    {
      id: 1,
      name: "Rick Sanchez",
      status: "Alive",
      species: "Human",
      type: "",
      gender: "Male",
      origin: { name: "Earth", url: "" },
      location: { name: "Earth", url: "" },
      image: "rick.jpg",
      episode: ["1", "2"],
      url: "",
      created: "2023-01-01",
    },
    {
      id: 2,
      name: "Morty Smith",
      status: "Alive",
      species: "Human",
      type: "",
      gender: "Male",
      origin: { name: "Earth", url: "" },
      location: { name: "Earth", url: "" },
      image: "morty.jpg",
      episode: ["1", "2"],
      url: "",
      created: "2023-01-01",
    },
  ],
};

jest.mock("../../services/api", () => ({
  fetchCharacters: jest.fn(),
}));

describe("CharactersPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    (apiService.fetchCharacters as jest.Mock).mockResolvedValue(mockCharacters);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("renders initial characters", async () => {
    render(<CharactersPage />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Rick Sanchez")).toBeInTheDocument();
      expect(screen.getByText("Morty Smith")).toBeInTheDocument();
    });

    expect(apiService.fetchCharacters).toHaveBeenCalledWith(1, {
      name: "",
      species: "",
      gender: "",
      status: "",
    });
  });

  test("filters characters by name with debounce", async () => {
    render(<CharactersPage />);

    await waitFor(() => {
      expect(screen.getByText("Rick Sanchez")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/filter by name/i);
    fireEvent.change(searchInput, { target: { value: "Rick" } });

    expect(apiService.fetchCharacters).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(apiService.fetchCharacters).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          name: "Rick",
        })
      );
    });
  });

  test("handles no results found", async () => {
    const emptyResponse = {
      info: { count: 0, pages: 0, next: null, prev: null },
      results: [],
    };
    (apiService.fetchCharacters as jest.Mock).mockResolvedValueOnce(
      emptyResponse
    );

    render(<CharactersPage />);

    const searchInput = screen.getByPlaceholderText(/filter by name/i);
    fireEvent.change(searchInput, { target: { value: "NotFound" } });

    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(screen.queryByText("Rick Sanchez")).not.toBeInTheDocument();
      expect(apiService.fetchCharacters).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          name: "NotFound",
        })
      );
    });
  });

  test("loads more characters when clicking load more", async () => {
    render(<CharactersPage />);

    await waitFor(() => {
      expect(screen.getByText("Rick Sanchez")).toBeInTheDocument();
    });

    const loadMoreButton = screen.getByRole("button", { name: /load more/i });
    fireEvent.click(loadMoreButton);

    await waitFor(() => {
      expect(apiService.fetchCharacters).toHaveBeenCalledWith(2, {
        name: "",
        species: "",
        gender: "",
        status: "",
      });
    });
  });

  test("applies filters immediately (non-name filters)", async () => {
    render(<CharactersPage />);

    await waitFor(() => {
      expect(screen.getByText("Rick Sanchez")).toBeInTheDocument();
    });

    const statusSelect = screen.getByRole("combobox", {
      name: /filter by status/i,
    });
    fireEvent.change(statusSelect, { target: { value: "alive" } });

    await waitFor(() => {
      expect(apiService.fetchCharacters).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          status: "alive",
        })
      );
    });
  });

  test("handles API error", async () => {
    (apiService.fetchCharacters as jest.Mock).mockRejectedValueOnce(
      new Error("API Error")
    );

    render(<CharactersPage />);

    await waitFor(() => {
      expect(screen.queryByText("Rick Sanchez")).not.toBeInTheDocument();
      expect(apiService.fetchCharacters).toHaveBeenCalled();
    });

    expect(
      screen.queryByRole("button", { name: /load more/i })
    ).not.toBeInTheDocument();
  });

  test("cleans up search timeout on unmount", () => {
    const { unmount } = render(<CharactersPage />);

    const searchInput = screen.getByPlaceholderText(/filter by name/i);
    fireEvent.change(searchInput, { target: { value: "Rick" } });

    unmount();

    jest.advanceTimersByTime(1000);

    expect(apiService.fetchCharacters).toHaveBeenCalledTimes(1);
  });

  test("updates existing characters and adds new ones when loading more", async () => {
    const initialCharacters = {
      info: {
        count: 4,
        pages: 2,
        next: "https://rickandmortyapi.com/api/character?page=2",
        prev: null,
      },
      results: [
        {
          id: 1,
          name: "Rick Sanchez",
          status: "Alive",
          species: "Human",
          type: "",
          gender: "Male",
          origin: { name: "Earth", url: "" },
          location: { name: "Earth", url: "" },
          image: "rick.jpg",
          episode: ["1"],
          url: "",
          created: "2023-01-01",
        },
        {
          id: 2,
          name: "Morty Smith",
          status: "Alive",
          species: "Human",
          type: "",
          gender: "Male",
          origin: { name: "Earth", url: "" },
          location: { name: "Earth", url: "" },
          image: "morty.jpg",
          episode: ["1"],
          url: "",
          created: "2023-01-01",
        },
      ],
    };

    const secondPageCharacters = {
      info: {
        count: 4,
        pages: 2,
        next: null,
        prev: "https://rickandmortyapi.com/api/character?page=1",
      },
      results: [
        {
          id: 1,
          name: "Rick Sanchez",
          status: "Dead",
          species: "Human",
          type: "",
          gender: "Male",
          origin: { name: "Earth", url: "" },
          location: { name: "Earth", url: "" },
          image: "rick-updated.jpg",
          episode: ["1", "2"],
          url: "",
          created: "2023-01-01",
        },
        {
          id: 3,
          name: "Summer Smith",
          status: "Alive",
          species: "Human",
          type: "",
          gender: "Female",
          origin: { name: "Earth", url: "" },
          location: { name: "Earth", url: "" },
          image: "summer.jpg",
          episode: ["1"],
          url: "",
          created: "2023-01-01",
        },
      ],
    };

    (apiService.fetchCharacters as jest.Mock)
      .mockResolvedValueOnce(initialCharacters)
      .mockResolvedValueOnce(secondPageCharacters);

    render(<CharactersPage />);

    await waitFor(() => {
      expect(screen.getByText("Rick Sanchez")).toBeInTheDocument();
      expect(screen.getByText("Morty Smith")).toBeInTheDocument();
    });

    const initialRickElements = screen.getAllByText("Rick Sanchez");
    expect(initialRickElements).toHaveLength(1);

    const loadMoreButton = screen.getByRole("button", { name: /load more/i });
    fireEvent.click(loadMoreButton);

    await waitFor(() => {
      expect(screen.getByText("Summer Smith")).toBeInTheDocument();

      expect(screen.getByText("Morty Smith")).toBeInTheDocument();

      const finalRickElements = screen.getAllByText("Rick Sanchez");
      expect(finalRickElements).toHaveLength(1);
    });

    expect(apiService.fetchCharacters).toHaveBeenCalledTimes(2);
    expect(apiService.fetchCharacters).toHaveBeenLastCalledWith(2, {
      name: "",
      species: "",
      gender: "",
      status: "",
    });
  });

  test("clears previous timeout when typing multiple times", async () => {
    render(<CharactersPage />);

    await waitFor(() => {
      expect(screen.getByText("Rick Sanchez")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/filter by name/i);

    fireEvent.change(searchInput, { target: { value: "Ri" } });

    jest.advanceTimersByTime(500);

    fireEvent.change(searchInput, { target: { value: "Rick" } });

    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(apiService.fetchCharacters).toHaveBeenCalledTimes(2);
      expect(apiService.fetchCharacters).toHaveBeenLastCalledWith(
        1,
        expect.objectContaining({
          name: "Rick",
        })
      );
    });
  });

  test("handles multiple filter changes with different types", async () => {
    render(<CharactersPage />);

    await waitFor(() => {
      expect(screen.getByText("Rick Sanchez")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/filter by name/i);
    const statusSelect = screen.getByRole("combobox", {
      name: /filter by status/i,
    });

    fireEvent.change(statusSelect, { target: { value: "alive" } });

    await waitFor(() => {
      expect(apiService.fetchCharacters).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          status: "alive",
          name: "",
        })
      );
    });

    fireEvent.change(searchInput, { target: { value: "Rick" } });

    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(apiService.fetchCharacters).toHaveBeenLastCalledWith(
        1,
        expect.objectContaining({
          name: "Rick",
          status: "alive",
        })
      );
    });

    expect(apiService.fetchCharacters).toHaveBeenCalledTimes(3);
  });
});
