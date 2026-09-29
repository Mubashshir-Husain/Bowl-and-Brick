import React from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { openTableModal } from '../../redux/slices/customerSlice';

import { Utensils, Edit2, Search, X } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const RestaurantHeader = ({ restaurantInfo, isSearchOpen, setIsSearchOpen }) => {

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { tableNumber } = useSelector((state) => state.customer);

  const isAccepting = restaurantInfo?.isAcceptingOrders !== false;

  const name = restaurantInfo?.name || 'Bowl & Brick';

  return (

    <header className="sticky top-0 z-30 bg-[#100C09] border-b border-[#C8A96B]/25 px-3 sm:px-4 py-2 shadow-lg">

      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">

        {/* Restaurant Branding */}

        <div
          className="flex items-center gap-2.5 cursor-pointer min-w-0"
          onClick={() => navigate('/')}
        >

          <div className="w-8 h-8 rounded-lg bg-[#C8A96B] flex items-center justify-center text-[#100C09] font-black shrink-0 shadow-sm">

            <Utensils size={16} />

          </div>

          <div className="min-w-0">

            <h1 className="text-sm font-black leading-tight text-[#F7F4ED] tracking-tight truncate">

              {name}

            </h1>

            <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-[#EEEEEE]/55 font-semibold">

              <span
                className={`inline-flex items-center gap-1 font-bold px-1.5 py-0.5 rounded-full text-[9px] ${
                  isAccepting
                    ? 'bg-[#8FA28A]/15 text-[#C7D3C0] border border-[#8FA28A]/30'
                    : 'bg-red-400/10 text-red-300 border border-red-400/25'
                }`}
              >

                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isAccepting ? 'bg-[#8FA28A]' : 'bg-red-400'
                  }`}
                ></span>

                {isAccepting ? 'Accepting Orders' : 'Closed'}

              </span>

              {restaurantInfo?.openingHours && (

                <span className="hidden sm:inline-block truncate text-[10px] font-semibold text-[#EEEEEE]/50">

                  • {restaurantInfo.openingHours}

                </span>

              )}

            </div>

          </div>

        </div>


        {/* Actions: Search Toggle & Table Badge */}

        <div className="flex items-center gap-2 shrink-0">

          {/* Search Toggle Icon */}

          {setIsSearchOpen && (

            <button

              onClick={() => setIsSearchOpen(!isSearchOpen)}

              className={`p-1.5 rounded-lg text-xs font-bold transition border ${
                isSearchOpen
                  ? 'bg-[#C8A96B] text-[#100C09] border-[#C8A96B]'
                  : 'bg-[#15110E] text-[#F7F4ED] border-[#C8A96B]/25 hover:bg-[#C8A96B]/15'
              }`}

              title="Search menu"

              aria-label="Toggle search"

            >

              {isSearchOpen ? <X size={15} /> : <Search size={15} />}

            </button>

          )}


          {/* Table Badge */}

          {tableNumber ? (

            <button

              onClick={() => dispatch(openTableModal())}

              className="flex items-center gap-1 bg-[#C8A96B]/10 border border-[#C8A96B]/30 px-2 py-1 rounded-lg text-[11px] font-extrabold text-[#F7F4ED] hover:bg-[#C8A96B]/20 transition"

              title="Change table number"

            >

              <span className="hidden sm:inline text-[#EEEEEE]/60">
                Table
              </span>

              <span className="bg-[#C8A96B] text-[#100C09] px-1.5 py-0.5 rounded-md font-black text-[10px]">

                {tableNumber}

              </span>

              <Edit2
                size={11}
                className="text-[#C8A96B] opacity-80"
              />

            </button>

          ) : (

            <button

              onClick={() => dispatch(openTableModal())}

              className="bg-[#C8A96B] text-[#100C09] hover:bg-[#D8BB7C] transition text-[10px] font-black px-2.5 py-1 rounded-lg"

            >

              Set Table

            </button>

          )}

        </div>

      </div>

    </header>

  );

};

export default RestaurantHeader;