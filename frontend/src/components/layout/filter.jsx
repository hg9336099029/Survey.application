import React, { useState } from 'react';

const FilterDropdown = ({ onFilterSelect }) => {
  const filters = [
    {
      id: "All-polls",
      label: "All Polls",
      icon: "🎯",
      description: "View all available polls"
    },
    {
      id: "yesno",
      label: "Yes/No",
      icon: "👍",
      description: "Binary choice polls"
    },
    {
      id: "single choice",
      label: "Single Choice",
      icon: "✓",
      description: "Choose one option"
    },
    {
      id: "rating",
      label: "Rating",
      icon: "⭐",
      description: "Rate 1-5 stars"
    },
    {
      id: "imagebased",
      label: "Image-based",
      icon: "🖼️",
      description: "Visual options"
    },
    {
      id: "open ended",
      label: "Open-Ended",
      icon: "💬",
      description: "Share your thoughts"
    }
  ];

  const [selectedFilter, setSelectedFilter] = useState("All-polls");

  const handleFilterClick = (filterId) => {
    setSelectedFilter(filterId);
    onFilterSelect(filterId);
  };

  const selectedFilterObj = filters.find(f => f.id === selectedFilter);

  return (
    <div className="w-full">
      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg">
              🔍
            </div>
            <h3 className="text-lg font-bold text-gray-900">Filter by Poll Type</h3>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => handleFilterClick(filter.id)}
                className={`group relative px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                  selectedFilter === filter.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-400 hover:text-blue-600 hover:shadow-md'
                }`}
              >
                <span className="text-lg mr-1">{filter.icon}</span>
                <span>{filter.label}</span>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                  {filter.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile View - Horizontal Scroll */}
      <div className="md:hidden">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200 p-4 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm">
              🔍
            </div>
            <h3 className="text-base font-bold text-gray-900">Filter</h3>
          </div>
          
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 pb-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => handleFilterClick(filter.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 whitespace-nowrap ${
                    selectedFilter === filter.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-400'
                  }`}
                >
                  <span className="text-base mr-1">{filter.icon}</span>
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Filter Display */}
      <div className="mt-4 p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl border-2 border-blue-300">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{selectedFilterObj?.icon}</div>
          <div>
            <p className="text-xs text-gray-600 font-medium">Currently Viewing</p>
            <p className="text-lg font-bold text-gray-900">{selectedFilterObj?.label}</p>
            <p className="text-sm text-gray-600">{selectedFilterObj?.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterDropdown;

// Add this to your global CSS to hide scrollbar while keeping scrolling functionality
// Add to your index.css or tailwind config:
/*
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
*/