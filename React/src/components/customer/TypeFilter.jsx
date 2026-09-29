import React from 'react';

import { Flame } from 'lucide-react';

const TypeFilter = ({
  typeFilter,
  setTypeFilter,
  spiceFilter,
  setSpiceFilter,
}) => {

  return (

    <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs py-0.5">

      {/* Dietary Type Filter */}

      <div className="flex items-center bg-[#15110E] p-0.5 rounded-xl border border-[#C8A96B]/20">

        {['All', 'Veg', 'Non-Veg', 'Vegan'].map((type) => {

          const isSelected = typeFilter === type;

          return (

            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                isSelected
                  ? 'bg-[#C8A96B] text-[#100C09] shadow-sm border border-[#C8A96B]'
                  : 'text-[#EEEEEE]/60 hover:text-[#F7F4ED] hover:bg-[#C8A96B]/10'
              }`}
            >

              {type === 'Veg' && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#8FA28A] mr-1" />
              )}

              {type === 'Non-Veg' && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400 mr-1" />
              )}

              {type === 'Vegan' && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#8FA28A] mr-1" />
              )}

              {type}

            </button>

          );

        })}

      </div>

      {/* Spice Filter */}

      <div className="flex items-center gap-1">

        <span className="text-[#EEEEEE]/60 flex items-center gap-1 font-bold text-[11px]">

          <Flame size={13} className="text-[#C8A96B]" /> Spice:

        </span>

        <select
          value={spiceFilter}
          onChange={(e) => setSpiceFilter(e.target.value)}
          className="bg-[#15110E] border border-[#C8A96B]/20 rounded-lg px-2 py-1 text-[11px] font-semibold text-[#F7F4ED] focus:outline-none focus:border-[#C8A96B] focus:ring-1 focus:ring-[#C8A96B]/10 transition"
        >

          <option value="All">All Levels</option>

          <option value="Low">Low</option>

          <option value="Medium">Medium</option>

          <option value="High">High</option>

        </select>

      </div>

    </div>

  );

};

export default TypeFilter;