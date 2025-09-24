
import React, { useState } from 'react';
import { Filter, Search, SortAsc, SortDesc } from 'lucide-react';

interface FilterBarProps {
  filters: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  showSearch?: boolean;
  onSearch?: (value: string) => void;
  showSort?: boolean;
  onSort?: (field: string, direction: 'asc' | 'desc') => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  activeFilter,
  onFilterChange,
  showSearch = true,
  onSearch,
  showSort = false,
  onSort
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleSortDirectionToggle = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDirection);
    if (onSort) {
      onSort('default', newDirection);
    }
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            className={`px-3 py-1 text-sm rounded-full ${
              activeFilter === filter ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => onFilterChange(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
      
      <div className="flex items-center gap-2">
        {showSort && (
          <div className="relative">
            <button 
              className="p-1 hover:bg-gray-100 rounded"
              onClick={handleSortDirectionToggle}
              title={sortDirection === 'asc' ? "Sort Ascending" : "Sort Descending"}
            >
              {sortDirection === 'asc' ? 
                <SortAsc className="h-4 w-4 text-gray-500" /> : 
                <SortDesc className="h-4 w-4 text-gray-500" />
              }
            </button>
            
            {showSortMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <div className="py-1">
                  <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                    Sort by Name
                  </button>
                  <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                    Sort by Date
                  </button>
                  <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                    Sort by Status
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {showSearch && (
          <>
            <button className="p-1 hover:bg-gray-100 rounded">
              <Filter className="h-4 w-4 text-gray-500" />
            </button>
            <div className="relative">
              <Search className="h-4 w-4 text-gray-500 absolute left-2 top-1/2 transform -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-8 pr-2 py-1 text-sm border rounded-md w-40 focus:outline-none focus:border-blue-500"
                value={searchValue}
                onChange={handleSearchChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
