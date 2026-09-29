import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { addToCart, updateQuantity, selectCartItems } from '../../redux/slices/cartSlice';

import { Plus, Minus, Info } from 'lucide-react';

const getDietaryBadge = (type) => {

  if (type === 'Veg') {

    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#8FA28A] bg-[#100C09]/90 border border-[#8FA28A]/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-[#8FA28A]"></span> Veg
      </span>
    );

  } else if (type === 'Non-Veg') {

    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-300 bg-[#100C09]/90 border border-red-400/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span> Non-Veg
      </span>
    );

  } else if (type === 'Vegan') {

    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#C7D3C0] bg-[#100C09]/90 border border-[#8FA28A]/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-[#8FA28A]"></span> Vegan
      </span>
    );

  }

  return null;
};

const getSpiceIcons = (spiceLevel) => {

  if (spiceLevel === 'High') return 'High Spice';
  if (spiceLevel === 'Medium') return 'Medium Spice';
  if (spiceLevel === 'Low') return 'Low Spice';

  return null;
};

const MenuCard = ({ dish, onSelectDish, isRestaurantOpen }) => {

  const dispatch = useDispatch();

  const cartItems = useSelector(selectCartItems);

  const cartItem = cartItems.find((item) => item._id === dish._id);

  const currentQuantity = cartItem ? cartItem.quantity : 0;

  const isAvailable = dish.available !== false;

  const canOrder = isAvailable && isRestaurantOpen;

  const handleAdd = (e) => {

    e.stopPropagation();

    if (canOrder) {

      dispatch(addToCart({ ...dish, quantity: 1 }));

    }

  };

  const handleIncrement = (e) => {

    e.stopPropagation();

    if (canOrder) {

      dispatch(updateQuantity({ id: dish._id, quantity: currentQuantity + 1 }));

    }

  };

  const handleDecrement = (e) => {

    e.stopPropagation();

    dispatch(updateQuantity({ id: dish._id, quantity: currentQuantity - 1 }));

  };

  return (

    <div
      onClick={() => onSelectDish(dish)}
      className="card hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden group border border-[#C8A96B]/15 hover:border-[#C8A96B]/40 bg-[#15110E] rounded-2xl"
    >

      <div>

        {/* Banner image or food gradient fallback */}

        <div className="relative h-36 w-full overflow-hidden bg-[#100C09] flex items-center justify-center border-b border-[#C8A96B]/15">

          {dish.imageUrl || dish.image ? (

            <img
              src={dish.imageUrl || dish.image}
              alt={dish.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />

          ) : (

            <div className="text-center p-3">

              <span className="text-4xl select-none">
                {dish.type === 'Non-Veg'
                  ? '🍗'
                  : dish.category === 'Beverage'
                    ? '🍹'
                    : dish.category === 'Dessert'
                      ? '🍰'
                      : '🍲'}
              </span>

            </div>

          )}

          {/* Badges on Top */}

          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 flex-wrap">
            {getDietaryBadge(dish.type)}
          </div>

          <div className="absolute top-2.5 right-2.5">

            <span className="text-[10px] font-bold bg-[#100C09]/90 text-[#F7F4ED] px-2.5 py-0.5 rounded-full shadow-sm border border-[#C8A96B]/20 backdrop-blur-sm">
              {dish.category}
            </span>

          </div>

          {!isAvailable && (

            <div className="absolute inset-0 bg-[#100C09]/85 flex items-center justify-center p-2 text-center">

              <span className="bg-red-400/15 text-red-300 border border-red-400/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                Currently Unavailable
              </span>

            </div>

          )}

        </div>

        {/* Dish Info */}

        <div className="p-3.5">

          <div className="flex items-start justify-between gap-1.5">

            <h3 className="font-bold text-[#F7F4ED] text-sm leading-snug group-hover:text-[#C8A96B] transition">
              {dish.name}
            </h3>

            {dish.spiceLevel && (

              <span
                className="text-[11px] shrink-0 text-[#C8A96B]"
                title={`Spice Level: ${dish.spiceLevel}`}
              >
                {getSpiceIcons(dish.spiceLevel)}
              </span>

            )}

          </div>

          <div className="mt-1 flex items-baseline justify-between">

            <span className="text-sm font-black text-[#C8A96B]">
              ₹{dish.price}
            </span>

          </div>

          {dish.description && (

            <p className="text-[11px] font-medium text-[#EEEEEE]/50 mt-1.5 line-clamp-2 leading-tight">
              {dish.description}
            </p>

          )}

        </div>

      </div>

      {/* Card Footer Actions */}

      <div className="p-3.5 pt-0 mt-auto flex items-center justify-between gap-2">

        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectDish(dish);
          }}
          className="text-[11px] font-bold text-[#EEEEEE]/50 hover:text-[#C8A96B] flex items-center gap-1 transition"
        >

          <Info size={13} /> Details

        </button>

        {!isAvailable ? (

          <span className="text-[10px] font-bold text-red-300 bg-red-400/10 px-2 py-1 rounded-lg border border-red-400/20">
            Unavailable
          </span>

        ) : !isRestaurantOpen ? (

          <span className="text-[10px] font-bold text-[#EEEEEE]/50 bg-[#100C09] px-2 py-1 rounded-lg border border-[#C8A96B]/10">
            Closed
          </span>

        ) : currentQuantity > 0 ? (

          <div className="flex items-center gap-1.5 bg-[#100C09] text-[#F7F4ED] rounded-lg px-2 py-0.5 font-bold text-xs border border-[#C8A96B]/20">

            <button
              onClick={handleDecrement}
              className="p-0.5 hover:bg-[#C8A96B]/15 hover:text-[#C8A96B] rounded transition"
              aria-label="Decrease quantity"
            >
              <Minus size={13} />
            </button>

            <span className="font-bold text-xs min-w-[16px] text-center text-[#C8A96B]">
              {currentQuantity}
            </span>

            <button
              onClick={handleIncrement}
              className="p-0.5 hover:bg-[#C8A96B]/15 hover:text-[#C8A96B] rounded transition"
              aria-label="Increase quantity"
            >
              <Plus size={13} />
            </button>

          </div>

        ) : (

          <button
            onClick={handleAdd}
            className="bg-[#C8A96B] hover:bg-[#D8BB7C] text-[#100C09] text-[11px] py-1.5 px-3 rounded-lg flex items-center gap-1 shadow-sm active:scale-95 font-bold transition"
          >
            <Plus size={13} /> Add
          </button>

        )}

      </div>

    </div>

  );

};

export default MenuCard;