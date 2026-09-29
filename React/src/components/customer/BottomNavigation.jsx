import React from 'react';

import { NavLink } from 'react-router-dom';

import { useSelector } from 'react-redux';

import { selectCartTotalCount, selectCartTotalAmount } from '../../redux/slices/cartSlice';

import { UtensilsCrossed, ShoppingBag, Clock, Info } from 'lucide-react';

const BottomNavigation = () => {

  const totalCount = useSelector(selectCartTotalCount);

  const totalAmount = useSelector(selectCartTotalAmount);

  const { latestOrderId } = useSelector((state) => state.customer);

  const orderPath = latestOrderId ? `/order/${latestOrderId}` : '/order/status';

  return (

    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#100C09] border-t border-[#C8A96B]/25 py-1.5 px-4 shadow-lg">

      <div className="max-w-md mx-auto flex items-center justify-around">

        <NavLink

          to="/menu"

          end

          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[10px] font-black transition ${
              isActive
                ? 'text-[#C8A96B] font-extrabold'
                : 'text-[#EEEEEE]/55 font-semibold hover:text-[#F7F4ED]'
            }`
          }

        >

          <UtensilsCrossed size={17} />

          <span>Menu</span>

        </NavLink>


        <NavLink

          to="/cart"

          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[10px] font-black relative transition ${
              isActive
                ? 'text-[#C8A96B] font-extrabold'
                : 'text-[#EEEEEE]/55 font-semibold hover:text-[#F7F4ED]'
            }`
          }

        >

          <div className="relative">

            <ShoppingBag size={17} />

            {totalCount > 0 && (

              <span className="absolute -top-1.5 -right-2 bg-[#C8A96B] text-[#100C09] text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-[#100C09] shadow-sm">

                {totalCount}

              </span>

            )}

          </div>

          <span>

            Cart {totalCount > 0 ? `(₹${totalAmount})` : ''}

          </span>

        </NavLink>


        <NavLink

          to={orderPath}

          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[10px] font-black relative transition ${
              isActive
                ? 'text-[#C8A96B] font-extrabold'
                : 'text-[#EEEEEE]/55 font-semibold hover:text-[#F7F4ED]'
            }`
          }

        >

          <div className="relative">

            <Clock size={17} />

            {latestOrderId && (

              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#8FA28A] shadow-[0_0_6px_rgba(143,162,138,0.7)]"></span>

            )}

          </div>

          <span>My Order</span>

        </NavLink>


        <NavLink

          to="/info"

          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[10px] font-black transition ${
              isActive
                ? 'text-[#C8A96B] font-extrabold'
                : 'text-[#EEEEEE]/55 font-semibold hover:text-[#F7F4ED]'
            }`
          }

        >

          <Info size={17} />

          <span>Info</span>

        </NavLink>

      </div>

    </nav>

  );

};

export default BottomNavigation;