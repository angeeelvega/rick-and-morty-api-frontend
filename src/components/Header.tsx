import React from "react";
import { FilterProps } from "../types";

const Header: React.FC<FilterProps> = ({ onFilterChange }) => {
  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto p-4 pt-10 space-y-6">
      <div className="w-full max-w-xl mb-8">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Rick_and_Morty.svg"
          alt="Rick and Morty Logo"
          className="w-full h-auto"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <input
          type="text"
          placeholder="Filter by name..."
          className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00b5cc] w-full"
          onChange={(e) => onFilterChange("name", e.target.value)}
          aria-label="Filter by name"
        />

        <select
          className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00b5cc] w-full text-gray-500"
          onChange={(e) => onFilterChange("species", e.target.value)}
          defaultValue=""
          aria-label="Filter by species"
        >
          <option value="" disabled>
            Select Species
          </option>
          <option value="human">Human</option>
          <option value="alien">Alien</option>
          <option value="robot">Robot</option>
        </select>

        <select
          className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00b5cc] w-full text-gray-500"
          onChange={(e) => onFilterChange("gender", e.target.value)}
          defaultValue=""
          aria-label="Filter by gender"
        >
          <option value="" disabled>
            Select Gender
          </option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="unknown">Unknown</option>
        </select>

        <select
          className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00b5cc] w-full text-gray-500"
          onChange={(e) => onFilterChange("status", e.target.value)}
          defaultValue=""
          aria-label="Filter by status"
        >
          <option value="" disabled>
            Select Status
          </option>
          <option value="alive">Alive</option>
          <option value="dead">Dead</option>
          <option value="unknown">Unknown</option>
        </select>
      </div>
    </div>
  );
};

export default Header;
