import React, { useState } from 'react';

const FilterDropdown = ({ onFilterSelect }) => {
  const filters = ["All-polls","Yes/No", "Single choice", "Rating", "Image-based", "Open-Ended"];
  const [selectedFilter, setSelectedFilter] = useState("All-polls");

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
    onFilterSelect(filter);
  };

  return (
    <div className="flex flex-row justify-center items-center mx-auto w-auto mt-5">
      {/* For greater than medium size screen show options */}
      <div className="hidden sm:block rounded-2xl border border-gray-300 bg-sky-50 py-2 px-3 shadow-2xl">
        <nav className="flex flex-wrap gap-4">
          {filters.map((name, index) => (
            <a
              key={index}
              href="#"
              onClick={() => handleFilterClick(name)}
              className={`whitespace-nowrap inline-flex rounded-2xl py-2 px-3 text-sm font-medium transition-all duration-200 ease-in-out ${
                selectedFilter === name ? "bg-sky-400 text-gray-50" : "text-sky-400 hover:bg-sky-400 hover:text-gray-50"
              }`}
            >
              {name}
            </a>
          ))}
        </nav>
      </div>

      {/* Dropdown for small to medium size screen */}
      <div className="relative sm:hidden w-full m-3">
        <details className="border border-gray-300 bg-sky-50 py-2 px-3 rounded-2xl shadow-2xl mt-2">
          <summary className="flex flex-row w-auto h-auto gap-3 p-2 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Poll Type
          </summary>
          <nav className="absolute left-0 right-0 bg-sky-50 border border-gray-300 rounded-2xl shadow-2xl mt-2 p-2 ">
            {filters.map((name, index) => (
              <a
                key={index}
                href="#"
                onClick={() => handleFilterClick(name)}
                className={`block whitespace-nowrap rounded-2xl py-2 px-3 text-sm font-medium transition-all duration-200 ease-in-out  ${
                  selectedFilter === name ? "bg-sky-400 text-gray-50" : "text-sky-400 hover:bg-sky-400 hover:text-gray-50"
                }`}
              >
                {name}
              </a>
            ))}
          </nav>
        </details>
      </div>
    </div>
  );
};

export default FilterDropdown;