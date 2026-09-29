import React from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import {
  selectCartItems,
  selectCartTotalAmount,
  clearCart
} from '../../redux/slices/cartSlice';

import CartItem from '../../components/customer/CartItem';

import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  Utensils,
  ArrowLeft
} from 'lucide-react';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector(selectCartItems);
  const totalAmount = useSelector(selectCartTotalAmount);

  const { tableNumber } = useSelector((state) => state.customer);

  const isEmpty = cartItems.length === 0;

  return (
    <div className="min-h-screen pb-24 bg-[#100C09] text-[#F7F4ED]">

      {/* Top Bar */}

      <header className="sticky top-0 z-30 bg-[#100C09]/95 backdrop-blur-md border-b border-[#C8A96B]/20 px-3 sm:px-6 py-2.5 shadow-sm">

        <div className="max-w-xl mx-auto flex items-center justify-between">

          <div className="flex items-center gap-2.5">

            <button
              onClick={() => navigate('/menu')}
              className="p-1.5 rounded-lg hover:bg-[#C8A96B]/10 text-[#EEEEEE]/70 hover:text-[#C8A96B] transition"
              aria-label="Back to menu"
            >
              <ArrowLeft size={18} />
            </button>

            <h1 className="text-base font-black text-[#F7F4ED]">
              Your Cart
            </h1>

          </div>

          {!isEmpty && (

            <button
              onClick={() => {
                if (
                  window.confirm(
                    'Are you sure you want to clear your cart?'
                  )
                ) {
                  dispatch(clearCart());
                }
              }}
              className="text-xs font-bold text-red-400/80 hover:text-red-300 flex items-center gap-1 transition"
            >
              <Trash2 size={14} />
              Clear
            </button>

          )}

        </div>

      </header>

      <main className="max-w-xl mx-auto px-3 sm:px-6 pt-4 space-y-4">

        {isEmpty ? (

          /* Empty Cart */

          <div className="py-16 text-center space-y-3 bg-[#15110E] rounded-2xl border border-[#C8A96B]/15 p-6 shadow-sm">

            <div className="w-12 h-12 bg-[#C8A96B]/10 text-[#C8A96B] rounded-full flex items-center justify-center mx-auto border border-[#C8A96B]/20">

              <ShoppingBag size={24} />

            </div>

            <h2 className="text-base font-black text-[#F7F4ED]">
              Your Cart is Empty
            </h2>

            <p className="text-xs font-medium text-[#EEEEEE]/45 max-w-xs mx-auto">
              Looks like you haven't added any items to your cart yet.
              Explore our delicious menu!
            </p>

            <button
              onClick={() => navigate('/menu')}
              className="bg-[#C8A96B] hover:bg-[#D8BB7C] text-[#100C09] text-xs px-5 py-2 rounded-lg inline-flex items-center gap-1.5 font-black shadow-sm transition active:scale-95"
            >
              <Utensils size={15} />
              Browse Menu
            </button>

          </div>

        ) : (

          <>

            {/* Table Indicator */}

            {tableNumber && (

              <div className="p-3 bg-[#15110E] border border-[#C8A96B]/20 rounded-xl flex items-center justify-between text-xs text-[#EEEEEE]/70 font-bold shadow-sm">

                <span>
                  Ordering for Table:
                </span>

                <span className="bg-[#C8A96B]/10 text-[#C8A96B] font-black px-2.5 py-0.5 rounded-lg border border-[#C8A96B]/25">
                  Table {tableNumber}
                </span>

              </div>

            )}

            {/* Cart Items List */}

            <div className="space-y-2">

              {cartItems.map((item) => (

                <CartItem
                  key={item._id}
                  item={item}
                />

              ))}

            </div>

            {/* Bill Summary */}

            <div className="bg-[#15110E] p-4.5 rounded-2xl border border-[#C8A96B]/20 space-y-2.5 shadow-sm">

              <h3 className="font-black text-xs text-[#F7F4ED] border-b border-[#C8A96B]/15 pb-2 uppercase tracking-wider">
                Order Summary
              </h3>

              <div className="flex justify-between text-xs font-medium text-[#EEEEEE]/50">

                <span>
                  Items Subtotal
                </span>

                <span className="text-[#EEEEEE]/80 font-bold">
                  ₹{totalAmount}
                </span>

              </div>

              <div className="flex justify-between text-xs font-medium text-[#EEEEEE]/50">

                <span>
                  Taxes & Restaurant Charges
                </span>

                <span className="text-[#C7D3C0] font-bold">
                  Included
                </span>

              </div>

              <div className="pt-2 border-t border-[#C8A96B]/15 flex justify-between items-baseline">

                <span className="font-extrabold text-sm text-[#F7F4ED]">
                  Total Amount
                </span>

                <span className="font-black text-xl text-[#C8A96B]">
                  ₹{totalAmount}
                </span>

              </div>

            </div>

            {/* Checkout Action Button */}

            <div className="pt-1">

              <button
                onClick={() => navigate('/checkout')}
                className="bg-[#C8A96B] hover:bg-[#D8BB7C] text-[#100C09] w-full py-3.5 text-sm font-black flex items-center justify-between px-5 rounded-xl shadow-sm active:scale-[0.99] transition"
              >

                <span>
                  Proceed to Checkout
                </span>

                <div className="flex items-center gap-1">

                  <span>
                    ₹{totalAmount}
                  </span>

                  <ArrowRight size={16} />

                </div>

              </button>

            </div>

          </>

        )}

      </main>

    </div>
  );
};

export default CartPage;