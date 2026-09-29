import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, selectCartItems } from '../../redux/slices/cartSlice';
import { X, Plus, Minus, Flame, Check, ShoppingBag } from 'lucide-react';

const MenuDetailsModal = ({ dish, onClose, isRestaurantOpen }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);

  const existingInCart = cartItems.find((item) => item._id === dish?._id);
  const [qty, setQty] = useState(existingInCart ? existingInCart.quantity : 1);
  const [addedNotice, setAddedNotice] = useState(false);

  if (!dish) return null;

  const isAvailable = dish.available !== false;
  const canOrder = isAvailable && isRestaurantOpen;

  const handleAddToCart = () => {
    if (!canOrder) return;
    dispatch(addToCart({ ...dish, quantity: qty }));
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      onClose();
    }, 600);
  };

  return (
    <div className="modal-backdrop z-50">
      <div className="modal-card max-w-lg p-0 bg-white border border-slate-200 overflow-hidden relative shadow-2xl">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition"
          aria-label="Close details"
        >
          <X size={18} />
        </button>

        {/* Dish Banner Image / Solid Fallback */}
        <div className="relative h-44 w-full bg-slate-100 flex items-center justify-center border-b border-slate-200">
          {dish.imageUrl || dish.image ? (
            <img
              src={dish.imageUrl || dish.image}
              alt={dish.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="text-center">
              <span className="text-5xl select-none">
                {dish.type === 'Non-Veg' ? '🍗' : dish.category === 'Beverage' ? '🍹' : dish.category === 'Dessert' ? '🍰' : '🍲'}
              </span>
            </div>
          )}

          <div className="absolute bottom-3 left-4 flex items-center gap-2">
            <span className="bg-slate-900 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-xs">
              {dish.category}
            </span>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                dish.type === 'Veg'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : dish.type === 'Non-Veg'
                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                  : 'bg-green-50 text-green-800 border-green-200'
              }`}
            >
              {dish.type}
            </span>
          </div>
        </div>

        {/* Dish Body */}
        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                {dish.name}
              </h2>
              {dish.spiceLevel && (
                <p className="text-xs text-slate-500 font-bold flex items-center gap-1 mt-1">
                  <Flame size={14} className="text-slate-700" /> Spice Level: <span className="font-extrabold text-slate-900">{dish.spiceLevel}</span>
                </p>
              )}
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-slate-900">
                ₹{dish.price}
              </span>
            </div>
          </div>

          {dish.description && (
            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Description
              </h4>
              <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                {dish.description}
              </p>
            </div>
          )}

          {/* Ingredients list */}
          {dish.ingredients && dish.ingredients.length > 0 && (
            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Ingredients
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {dish.ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {!isAvailable && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl text-center">
              ⚠️ This item is currently unavailable and cannot be ordered.
            </div>
          )}

          {!isRestaurantOpen && isAvailable && (
            <div className="p-3 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl text-center">
              🔒 The restaurant is currently closed for orders.
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-1 shadow-xs">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={!canOrder}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold disabled:opacity-40 transition"
              aria-label="Decrease quantity"
            >
              <Minus size={15} />
            </button>
            <span className="font-bold text-sm w-6 text-center text-slate-900">
              {qty}
            </span>
            <button
              onClick={() => setQty((q) => q + 1)}
              disabled={!canOrder}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold disabled:opacity-40 transition"
              aria-label="Increase quantity"
            >
              <Plus size={15} />
            </button>
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleAddToCart}
            disabled={!canOrder}
            className={`btn-primary flex-1 py-3 text-xs font-black flex items-center justify-center gap-2 ${
              addedNotice ? '!bg-emerald-600 !border-emerald-600 !text-white' : ''
            }`}
          >
            {addedNotice ? (
              <>
                <Check size={16} /> Added to Cart!
              </>
            ) : (
              <>
                <ShoppingBag size={16} /> Add {qty} to Cart • ₹{dish.price * qty}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuDetailsModal;
