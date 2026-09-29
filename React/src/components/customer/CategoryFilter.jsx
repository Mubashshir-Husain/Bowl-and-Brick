import React from 'react';

const CategoryFilter = ({ categories, selectedCategory, setSelectedCategory }) => {

  return (

    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">

      {categories.map((cat) => {

        const isSelected = selectedCategory === cat.name;

        return (

          <button

            key={cat.name}

            onClick={() => setSelectedCategory(cat.name)}

            className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
              isSelected
                ? 'bg-[#C8A96B] text-[#100C09] border-[#C8A96B] shadow-sm'
                : 'bg-[#15110E] text-[#EEEEEE]/70 border-[#C8A96B]/20 hover:bg-[#C8A96B]/10 hover:text-[#F7F4ED] hover:border-[#C8A96B]/40'
            }`}

          >

            <span>{cat.name}</span>

            {cat.count !== undefined && (

              <span

                className={`px-1.5 py-0.5 rounded-md text-[9px] font-black ${
                  isSelected
                    ? 'bg-[#100C09]/15 text-[#100C09]'
                    : 'bg-[#C8A96B]/10 text-[#C8A96B]'
                }`}

              >

                {cat.count}

              </span>

            )}

          </button>

        );

      })}

    </div>

  );

};

export default CategoryFilter;