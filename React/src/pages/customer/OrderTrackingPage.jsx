import React, { useEffect, useState } from 'react';

import { useParams, useLocation, useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';

import { getOrderDetails } from '../../services/orderService';

import {
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  Search,
  XCircle
} from 'lucide-react';

const STATUS_STEPS = [
  {
    key: 'PENDING',
    label: 'Order Placed',
    desc: 'Order received by kitchen'
  },
  {
    key: 'ACCEPTED',
    label: 'Accepted',
    desc: 'Kitchen accepted your order'
  },
  {
    key: 'PREPARING',
    label: 'Preparing',
    desc: 'Chef is cooking your dish'
  },
  {
    key: 'SERVED',
    label: 'Served',
    desc: 'Enjoy your meal!'
  },
];

const normalizeStatus = (statusStr) => {

  if (!statusStr) return 'PENDING';

  const s = statusStr.toUpperCase();

  if (s === 'COMPLETED') return 'SERVED';

  if (s === 'PREPARATION') return 'PREPARING';

  return s;

};

const getStatusIndex = (normalized) => {

  if (normalized === 'CANCELLED') return -1;

  const idx = STATUS_STEPS.findIndex(
    (step) => step.key === normalized
  );

  return idx > -1 ? idx : 0;

};

const OrderTrackingPage = () => {

  const { id } = useParams();

  const location = useLocation();

  const navigate = useNavigate();

  const { latestOrderId } = useSelector(
    (state) => state.customer
  );

  const activeOrderId = id || latestOrderId;

  const [searchIdInput, setSearchIdInput] = useState('');

  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchOrder = async (orderIdToFetch) => {

    if (!orderIdToFetch) return;

    setLoading(true);

    setError(null);

    try {

      const data = await getOrderDetails(orderIdToFetch);

      setOrder(data);

    } catch (err) {

      console.error('Error loading order:', err);

      setError(
        typeof err === 'string'
          ? err
          : 'Order not found.'
      );

      setOrder(null);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    if (activeOrderId) {
      fetchOrder(activeOrderId);
    }

  }, [activeOrderId]);

  useEffect(() => {

    if (!autoRefresh || !activeOrderId || !order) return;

    const currentStatus = normalizeStatus(order.status);

    if (
      currentStatus === 'SERVED' ||
      currentStatus === 'CANCELLED'
    ) {
      return;
    }

    const interval = setInterval(() => {

      getOrderDetails(activeOrderId)
        .then((data) => setOrder(data))
        .catch(() => {});

    }, 10000);

    return () => clearInterval(interval);

  }, [autoRefresh, activeOrderId, order?.status]);

  const handleSearchOrder = (e) => {

    e.preventDefault();

    const trimmed = searchIdInput.trim();

    if (trimmed) {
      navigate(`/order/${trimmed}`);
    }

  };

  const currentStatus = normalizeStatus(order?.status);

  const currentStepIndex = getStatusIndex(currentStatus);

  const isCancelled = currentStatus === 'CANCELLED';

  return (

    <div className="min-h-screen pb-24 bg-[#100C09] text-[#F7F4ED]">

      {/* Top Header */}

      <header className="sticky top-0 z-30 bg-[#100C09]/95 backdrop-blur-md border-b border-[#C8A96B]/20 px-3 sm:px-6 py-2.5 shadow-sm">

        <div className="max-w-xl mx-auto flex items-center justify-between">

          <div className="flex items-center gap-2">

            <button
              onClick={() => navigate('/')}
              className="p-1.5 rounded-lg hover:bg-[#C8A96B]/10 text-[#EEEEEE]/70 hover:text-[#C8A96B] transition"
            >
              <ChevronLeft size={18} />
            </button>

            <h1 className="text-base font-black text-[#F7F4ED]">
              Track Order
            </h1>

          </div>

          {activeOrderId && (

            <button
              onClick={() => fetchOrder(activeOrderId)}
              disabled={loading}
              className="p-1.5 rounded-lg text-[#EEEEEE]/65 hover:bg-[#C8A96B]/10 hover:text-[#C8A96B] transition flex items-center gap-1 text-xs font-bold"
              title="Refresh order status"
            >

              <RefreshCw
                size={14}
                className={loading ? 'animate-spin' : ''}
              />

              <span>
                Refresh
              </span>

            </button>

          )}

        </div>

      </header>

      <main className="max-w-xl mx-auto px-3 sm:px-6 pt-4 space-y-4">

        {/* Just placed banner notification */}

        {location.state?.justPlaced && (

          <div className="p-3.5 bg-[#8FA28A]/10 border border-[#8FA28A]/25 rounded-xl flex items-center gap-2.5 text-[#C7D3C0] text-xs font-bold shadow-sm">

            <CheckCircle2
              size={18}
              className="shrink-0 text-[#8FA28A]"
            />

            <div>

              <p className="font-black text-xs text-[#F7F4ED]">
                Order Placed Successfully!
              </p>

              <p className="text-[11px] text-[#C7D3C0]/70">
                Your order has been sent directly to the kitchen.
              </p>

            </div>

          </div>

        )}

        {/* Search / Enter Order ID if none loaded */}

        {!activeOrderId && (

          <div className="bg-[#15110E] p-5 rounded-2xl border border-[#C8A96B]/20 text-center space-y-3 shadow-sm">

            <div className="w-12 h-12 bg-[#C8A96B]/10 text-[#C8A96B] rounded-full flex items-center justify-center mx-auto border border-[#C8A96B]/20">

              <Clock size={24} />

            </div>

            <div>

              <h2 className="text-base font-black text-[#F7F4ED]">
                No Active Order Selected
              </h2>

              <p className="text-xs font-medium text-[#EEEEEE]/50 mt-0.5">
                Enter your Order ID below to track its live status.
              </p>

            </div>

            <form
              onSubmit={handleSearchOrder}
              className="flex gap-2"
            >

              <input
                type="text"
                placeholder="Enter Order ID (e.g. 65abc...)"
                value={searchIdInput}
                onChange={(e) => setSearchIdInput(e.target.value)}
                className="w-full bg-[#100C09] border border-[#C8A96B]/20 text-[#F7F4ED] placeholder:text-[#EEEEEE]/30 rounded-lg px-3 py-2.5 text-xs flex-1 outline-none focus:border-[#C8A96B] focus:ring-1 focus:ring-[#C8A96B]/20 transition"
              />

              <button
                type="submit"
                className="bg-[#C8A96B] hover:bg-[#D8BB7C] text-[#100C09] text-xs px-3.5 py-2 rounded-lg flex items-center gap-1 font-black transition"
              >
                <Search size={14} />
                Track
              </button>

            </form>

          </div>

        )}

        {/* Loading Spinner */}

        {loading && !order && (

          <div className="py-14 text-center space-y-2">

            <div className="w-8 h-8 border-3 border-[#C8A96B] border-t-transparent rounded-full animate-spin mx-auto" />

            <p className="text-xs font-bold text-[#EEEEEE]/50">
              Fetching order details...
            </p>

          </div>

        )}

        {/* Error state */}

        {error && (

          <div className="bg-[#15110E] p-5 rounded-2xl border border-red-400/20 text-center space-y-3">

            <AlertCircle
              size={28}
              className="mx-auto text-red-400"
            />

            <h3 className="font-extrabold text-sm text-[#F7F4ED]">
              Unable to load order
            </h3>

            <p className="text-xs font-medium text-[#EEEEEE]/50 max-w-xs mx-auto">
              {error}
            </p>

            <button
              onClick={() => navigate('/')}
              className="bg-[#15110E] border border-[#C8A96B]/30 text-[#C8A96B] hover:bg-[#C8A96B]/10 hover:border-[#C8A96B]/50 text-xs px-3.5 py-1.5 rounded-lg inline-block font-bold transition"
            >
              Back to Menu
            </button>

          </div>

        )}

        {/* Order Details Content */}

        {order && (

          <>

            {/* Status Timeline Card */}

            <div className="bg-[#15110E] p-4.5 rounded-2xl border border-[#C8A96B]/20 shadow-sm space-y-4">

              <div className="flex items-center justify-between border-b border-[#C8A96B]/15 pb-3">

                <div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#EEEEEE]/35">
                    Order ID
                  </span>

                  <h3 className="font-mono text-xs font-black text-[#F7F4ED]">
                    #{order._id}
                  </h3>

                </div>

                <div className="text-right">

                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#EEEEEE]/35">
                    Table
                  </span>

                  <p className="text-sm font-black text-[#C8A96B]">
                    Table {order.tableNumber}
                  </p>

                </div>

              </div>

              {/* Status Visual Tracker */}

              {isCancelled ? (

                <div className="p-3.5 bg-red-500/10 border border-red-400/25 rounded-xl flex items-center gap-2.5 text-red-200 font-bold text-xs">

                  <XCircle
                    size={24}
                    className="shrink-0 text-red-400"
                  />

                  <div>

                    <h4 className="font-black text-xs text-red-300">
                      Order Cancelled
                    </h4>

                    <p className="text-[11px] text-red-300/70 mt-0.5">
                      This order has been cancelled by the restaurant.
                    </p>

                  </div>

                </div>

              ) : (

                <div className="py-1">

                  <h4 className="text-[11px] font-extrabold text-[#C7D3C0]/45 uppercase tracking-wider mb-3">
                    Live Progress
                  </h4>

                  <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#C8A96B]/15">

                    {STATUS_STEPS.map((step, index) => {

                      const isDone =
                        index <= currentStepIndex;

                      const isCurrent =
                        index === currentStepIndex;

                      return (

                        <div
                          key={step.key}
                          className="relative flex items-start gap-3"
                        >

                          <span
                            className={`absolute -left-[23px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                              isDone
                                ? 'bg-[#C8A96B] text-[#100C09] shadow-sm'
                                : 'bg-[#100C09] text-[#EEEEEE]/35 border border-[#C8A96B]/15'
                            }`}
                          >

                            {isDone
                              ? '✓'
                              : index + 1}

                          </span>

                          <div>

                            <p
                              className={`text-xs font-extrabold ${
                                isCurrent
                                  ? 'text-[#C8A96B]'
                                  : isDone
                                  ? 'text-[#F7F4ED]'
                                  : 'text-[#EEEEEE]/35'
                              }`}
                            >

                              {step.label}

                              {isCurrent && (

                                <span className="ml-2 text-[9px] font-black bg-[#C8A96B]/10 text-[#C8A96B] px-1.5 py-0.5 rounded-full border border-[#C8A96B]/25">
                                  Current State
                                </span>

                              )}

                            </p>

                            <p className="text-[11px] font-medium text-[#EEEEEE]/45 mt-0.5">
                              {step.desc}
                            </p>

                          </div>

                        </div>

                      );

                    })}

                  </div>

                </div>

              )}

            </div>

            {/* Order Items Breakdown */}

            <div className="bg-[#15110E] p-4.5 rounded-2xl border border-[#C8A96B]/20 shadow-sm space-y-2.5">

              <h4 className="font-extrabold text-xs text-[#F7F4ED] border-b border-[#C8A96B]/15 pb-2 uppercase tracking-wider">
                Order Items Summary
              </h4>

              <div className="divide-y divide-[#C8A96B]/10">

                {order.items?.map((item, idx) => {

                  const dishName =
                    item.menuItem?.name ||
                    item.name ||
                    'Menu Item';

                  const unitPrice =
                    item.price ||
                    item.menuItem?.price ||
                    0;

                  return (

                    <div
                      key={idx}
                      className="py-2 flex items-center justify-between text-xs font-semibold"
                    >

                      <div>

                        <p className="font-bold text-[#F7F4ED]">
                          {dishName}
                        </p>

                        <p className="text-[#EEEEEE]/35 text-[11px]">
                          ₹{unitPrice} × {item.quantity}
                        </p>

                      </div>

                      <span className="font-black text-[#C8A96B]">
                        ₹{unitPrice * item.quantity}
                      </span>

                    </div>

                  );

                })}

              </div>

              <div className="pt-2 border-t border-[#C8A96B]/15 flex justify-between items-baseline">

                <div>

                  <span className="font-extrabold text-xs text-[#F7F4ED] block">
                    Total Bill
                  </span>

                  <span className="text-[10px] font-semibold text-[#EEEEEE]/40">
                    Customer: {order.customerName} ({order.customerMobile})
                  </span>

                </div>

                <span className="font-black text-xl text-[#C8A96B]">
                  ₹{order.totalAmount}
                </span>

              </div>

            </div>

          </>

        )}

      </main>

    </div>

  );

};

export default OrderTrackingPage;