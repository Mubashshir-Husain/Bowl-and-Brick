import React, { useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import {
  selectCartItems,
  selectCartTotalAmount,
  clearCart
} from '../../redux/slices/cartSlice';

import {
  setLatestOrderId,
  saveCustomerDetails
} from '../../redux/slices/customerSlice';

import { placeOrder } from '../../services/orderService';

import { validateCheckoutForm } from '../../utils/validation';

import {
  ArrowLeft,
  User,
  Phone,
  QrCode,
  ShoppingBag,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

const CheckoutPage = () => {

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const cartItems = useSelector(selectCartItems);

  const totalAmount = useSelector(selectCartTotalAmount);

  const customerState = useSelector((state) => state.customer);

  const [name, setName] = useState(customerState.customerName || '');

  const [mobile, setMobile] = useState(customerState.customerMobile || '');

  const [tableNum, setTableNum] = useState(customerState.tableNumber || '');

  const [errors, setErrors] = useState({});

  const [submitting, setSubmitting] = useState(false);

  const [apiError, setApiError] = useState(null);

  const handleSubmitOrder = async (e) => {

    e.preventDefault();

    setApiError(null);

    const validation = validateCheckoutForm({
      customerName: name,
      customerMobile: mobile,
      tableNumber: tableNum,
      cartItems,
    });

    if (!validation.isValid) {

      setErrors(validation.errors);

      return;
    }

    setSubmitting(true);

    try {

      const payload = {
        customerName: name.trim(),
        customerMobile: mobile.trim(),
        tableNumber: tableNum.toString().trim(),
        items: cartItems.map((item) => ({
          menuItem: item._id,
          quantity: item.quantity,
        })),
        totalAmount,
      };

      const createdOrder = await placeOrder(payload);

      dispatch(
        saveCustomerDetails({
          name: name.trim(),
          mobile: mobile.trim()
        })
      );

      dispatch(clearCart());

      const orderId = createdOrder._id || createdOrder.id;

      if (orderId) {

        dispatch(setLatestOrderId(orderId));

        navigate(`/order/${orderId}`, {
          state: { justPlaced: true }
        });

      } else {

        throw new Error('Invalid response from order server');

      }

    } catch (err) {

      console.error('Order placement failed:', err);

      setApiError(
        typeof err === 'string'
          ? err
          : err.message || 'Failed to place order.'
      );

    } finally {

      setSubmitting(false);

    }

  };

  if (cartItems.length === 0) {

    return (

      <div className="min-h-screen bg-[#100C09] p-6 flex items-center justify-center">

        <div className="text-center space-y-3 max-w-sm bg-[#15110E] border border-[#C8A96B]/20 p-6 rounded-2xl shadow-sm">

          <ShoppingBag
            size={40}
            className="mx-auto text-[#C8A96B]"
          />

          <h2 className="text-base font-black text-[#F7F4ED]">
            Your cart is empty
          </h2>

          <p className="text-xs font-medium text-[#EEEEEE]/50">
            Please add items to your cart before proceeding to checkout.
          </p>

          <button
            onClick={() => navigate('/')}
            className="bg-[#C8A96B] hover:bg-[#D8BB7C] text-[#100C09] w-full py-2.5 text-xs font-black rounded-lg transition active:scale-95"
          >
            Return to Menu
          </button>

        </div>

      </div>

    );

  }

  return (

    <div className="min-h-screen pb-24 bg-[#100C09] text-[#F7F4ED]">

      {/* Top Bar */}

      <header className="sticky top-0 z-30 bg-[#100C09]/95 backdrop-blur-md border-b border-[#C8A96B]/20 px-3 sm:px-6 py-2.5 shadow-sm">

        <div className="max-w-xl mx-auto flex items-center gap-2.5">

          <button
            onClick={() => navigate('/cart')}
            className="p-1.5 rounded-lg hover:bg-[#C8A96B]/10 text-[#EEEEEE]/70 hover:text-[#C8A96B] transition"
            aria-label="Back to cart"
          >
            <ArrowLeft size={18} />
          </button>

          <h1 className="text-base font-black text-[#F7F4ED]">
            Checkout & Place Order
          </h1>

        </div>

      </header>

      <main className="max-w-xl mx-auto px-3 sm:px-6 pt-4 space-y-4">

        {apiError && (

          <div className="p-3 bg-red-500/10 border border-red-400/25 rounded-xl flex items-start gap-2 text-red-300 text-xs font-semibold">

            <AlertCircle
              size={16}
              className="shrink-0 text-red-400 mt-0.5"
            />

            <div>

              <p className="font-bold">
                Order Error
              </p>

              <p className="text-red-300/80">
                {apiError}
              </p>

            </div>

          </div>

        )}

        <form
          onSubmit={handleSubmitOrder}
          className="space-y-4"
        >

          {/* Customer Info Card */}

          <div className="bg-[#15110E] p-4.5 rounded-2xl border border-[#C8A96B]/20 shadow-sm space-y-3.5">

            <h3 className="font-extrabold text-xs text-[#F7F4ED] flex items-center gap-1.5 border-b border-[#C8A96B]/15 pb-2 uppercase tracking-wider">

              <User
                size={15}
                className="text-[#C8A96B]"
              />

              Customer Information

            </h3>

            <div>

              <label className="block text-[11px] font-bold text-[#C7D3C0] mb-1">

                Your Name{' '}

                <span className="text-red-400">
                  *
                </span>

              </label>

              <div className="relative">

                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => {

                    setName(e.target.value);

                    if (errors.customerName)
                      setErrors({
                        ...errors,
                        customerName: null
                      });

                  }}
                  className="w-full bg-[#100C09] border border-[#C8A96B]/20 text-[#F7F4ED] placeholder:text-[#EEEEEE]/30 rounded-lg pl-9 pr-3 py-2.5 text-xs outline-none focus:border-[#C8A96B] focus:ring-1 focus:ring-[#C8A96B]/20 transition"
                />

                <User
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C8A96B]"
                />

              </div>

              {errors.customerName && (

                <p className="text-[11px] text-red-400 mt-1 font-bold">
                  {errors.customerName}
                </p>

              )}

            </div>

            <div>

              <label className="block text-[11px] font-bold text-[#C7D3C0] mb-1">

                Mobile Number{' '}

                <span className="text-red-400">
                  *
                </span>

              </label>

              <div className="relative">

                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={mobile}
                  onChange={(e) => {

                    setMobile(e.target.value);

                    if (errors.customerMobile)
                      setErrors({
                        ...errors,
                        customerMobile: null
                      });

                  }}
                  className="w-full bg-[#100C09] border border-[#C8A96B]/20 text-[#F7F4ED] placeholder:text-[#EEEEEE]/30 rounded-lg pl-9 pr-3 py-2.5 text-xs outline-none focus:border-[#C8A96B] focus:ring-1 focus:ring-[#C8A96B]/20 transition"
                  maxLength={10}
                />

                <Phone
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C8A96B]"
                />

              </div>

              {errors.customerMobile && (

                <p className="text-[11px] text-red-400 mt-1 font-bold">
                  {errors.customerMobile}
                </p>

              )}

            </div>

            <div>

              <label className="block text-[11px] font-bold text-[#C7D3C0] mb-1">

                Table Number{' '}

                <span className="text-red-400">
                  *
                </span>

              </label>

              <div className="relative">

                <input
                  type="text"
                  placeholder="Table number"
                  value={tableNum}
                  onChange={(e) => {

                    setTableNum(e.target.value);

                    if (errors.tableNumber)
                      setErrors({
                        ...errors,
                        tableNumber: null
                      });

                  }}
                  className="w-full bg-[#100C09] border border-[#C8A96B]/20 text-[#F7F4ED] placeholder:text-[#EEEEEE]/30 rounded-lg pl-9 pr-3 py-2.5 text-xs font-black outline-none focus:border-[#C8A96B] focus:ring-1 focus:ring-[#C8A96B]/20 transition"
                />

                <QrCode
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C8A96B]"
                />

              </div>

              {errors.tableNumber && (

                <p className="text-[11px] text-red-400 mt-1 font-bold">
                  {errors.tableNumber}
                </p>

              )}

            </div>

          </div>

          {/* Items Summary Card */}

          <div className="bg-[#15110E] p-4.5 rounded-2xl border border-[#C8A96B]/20 shadow-sm space-y-3">

            <h3 className="font-extrabold text-xs text-[#F7F4ED] flex items-center justify-between border-b border-[#C8A96B]/15 pb-2 uppercase tracking-wider">

              <span>
                Order Items (
                {cartItems.reduce(
                  (a, b) => a + b.quantity,
                  0
                )}
                )
              </span>

              <button
                type="button"
                onClick={() => navigate('/cart')}
                className="text-xs text-[#C8A96B] hover:text-[#D8BB7C] hover:underline font-bold transition"
              >
                Edit Cart
              </button>

            </h3>

            <div className="divide-y divide-[#C8A96B]/10 max-h-48 overflow-y-auto">

              {cartItems.map((item) => (

                <div
                  key={item._id}
                  className="py-2 flex items-center justify-between text-xs"
                >

                  <div>

                    <span className="font-bold text-[#F7F4ED]">
                      {item.name}
                    </span>

                    <span className="text-[#EEEEEE]/35 ml-2">
                      x {item.quantity}
                    </span>

                  </div>

                  <span className="font-extrabold text-[#C8A96B]">
                    ₹{item.price * item.quantity}
                  </span>

                </div>

              ))}

            </div>

            <div className="pt-2 border-t border-[#C8A96B]/15 flex justify-between items-baseline">

              <span className="font-extrabold text-xs text-[#F7F4ED]">
                Total Amount
              </span>

              <span className="font-black text-xl text-[#C8A96B]">
                ₹{totalAmount}
              </span>

            </div>

          </div>

          {/* Payment Note */}

          <div className="p-3 bg-[#8FA28A]/10 border border-[#8FA28A]/25 rounded-xl text-xs text-[#C7D3C0] font-bold flex items-center gap-2">

            <CheckCircle
              size={15}
              className="shrink-0 text-[#8FA28A]"
            />

            <span>
              Pay directly at the restaurant counter after your meal.
            </span>

          </div>

          {/* Place Order Submit */}

          <button
            type="submit"
            disabled={submitting}
            className="bg-[#C8A96B] hover:bg-[#D8BB7C] text-[#100C09] w-full py-3.5 text-sm font-black flex items-center justify-center gap-2 rounded-xl shadow-sm active:scale-[0.99] disabled:opacity-50 transition"
          >

            {submitting ? (

              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />

                Placing Order...
              </>

            ) : (

              <>
                Confirm & Place Order • ₹{totalAmount}
              </>

            )}

          </button>

        </form>

      </main>

    </div>
  );
};

export default CheckoutPage;