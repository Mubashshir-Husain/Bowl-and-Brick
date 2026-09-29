import React from 'react';

import { useDispatch } from 'react-redux';

import { updateQuantity, removeFromCart } from '../../redux/slices/cartSlice';

import { Plus, Minus, Trash2 } from 'lucide-react';

const CartItem = ({ item }) => {

  const dispatch = useDispatch();

  const handleIncrement = () => {

    dispatch(updateQuantity({ id: item._id, quantity: item.quantity + 1 }));

  };

  const handleDecrement = () => {

    dispatch(updateQuantity({ id: item._id, quantity: item.quantity - 1 }));

  };

  const handleRemove = () => {

    dispatch(removeFromCart(item._id));

  };

  const itemSubtotal = item.price * item.quantity;

  return (

    <div className="flex items-center justify-between p-3.5 bg-[#15110E] rounded-xl border border-[#C8A96B]/20 shadow-sm gap-3">

      {/* Dish info & subtotal */}

      <div className="flex-1 min-w-0">

        <div className="flex items-center gap-2">

          {item.type === 'Veg' && (
            <span className="w-2 h-2 rounded-full bg-[#8FA28A] shrink-0"></span>
          )}

          {item.type === 'Non-Veg' && (
            <span className="w-2 h-2 rounded-full bg-red-400 shrink-0"></span>
          )}

          {item.type === 'Vegan' && (
            <span className="w-2 h-2 rounded-full bg-[#8FA28A] shrink-0"></span>
          )}

          <h4 className="font-extrabold text-[#F7F4ED] text-xs truncate">

            {item.name}

          </h4>

        </div>

        <div className="flex items-center gap-2 text-[11px] text-[#EEEEEE]/55 mt-0.5 font-semibold">

          <span>
            ₹{item.price} × {item.quantity}
          </span>

          <span className="font-black text-[#C8A96B]">

            = ₹{itemSubtotal}

          </span>

        </div>

      </div>

      {/* Quantity & Actions */}

      <div className="flex items-center gap-2">

        <div className="flex items-center gap-1 bg-[#100C09] rounded-lg p-0.5 border border-[#C8A96B]/20">

          <button

            onClick={handleDecrement}

            className="w-6 h-6 rounded bg-[#C8A96B]/10 flex items-center justify-center text-[#C8A96B] font-bold hover:bg-[#C8A96B] hover:text-[#100C09] transition"

            aria-label="Decrease quantity"

          >

            <Minus size={13} />

          </button>

          <span className="font-bold text-xs min-w-[16px] text-center text-[#F7F4ED]">

            {item.quantity}

          </span>

          <button

            onClick={handleIncrement}

            className="w-6 h-6 rounded bg-[#C8A96B]/10 flex items-center justify-center text-[#C8A96B] font-bold hover:bg-[#C8A96B] hover:text-[#100C09] transition"

            aria-label="Increase quantity"

          >

            <Plus size={13} />

          </button>

        </div>

        <button

          onClick={handleRemove}

          className="p-1.5 text-[#EEEEEE]/40 hover:text-red-400 transition"

          aria-label="Remove item"

          title="Remove item"

        >

          <Trash2 size={15} />

        </button>

      </div>

    </div>

  );

};

export default CartItem;