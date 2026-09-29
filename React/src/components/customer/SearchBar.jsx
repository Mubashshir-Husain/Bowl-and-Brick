import React from 'react';

import { Search, X } from 'lucide-react';

const SearchBar = ({ searchTerm, setSearchTerm, onClose }) => {

  return (

    <div className="relative w-full animate-slide-up">

      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#C8A96B]">
        <Search size={15} />
      </div>

      <input
        type="text"
        placeholder="Search dish by name, ingredients, or category..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-9 pr-8 py-2 bg-[#15110E] border border-[#C8A96B]/25 rounded-xl text-xs font-semibold text-[#F7F4ED] placeholder-[#EEEEEE]/35 focus:outline-none focus:border-[#C8A96B] focus:ring-2 focus:ring-[#C8A96B]/10 transition shadow-sm"
        autoFocus
      />

      {searchTerm ? (

        <button
          onClick={() => setSearchTerm('')}
          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#EEEEEE]/45 hover:text-[#C8A96B] transition"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>

      ) : onClose ? (

        <button
          onClick={onClose}
          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#EEEEEE]/45 hover:text-[#C8A96B] transition"
          aria-label="Close search"
        >
          <X size={14} />
        </button>

      ) : null}

    </div>

  );

};

export default SearchBar;