import React, { useEffect, useState, useMemo } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import { getAllOrders, updateOrderStatus } from '../../services/orderService';
import { RefreshCw, Search, Clock, Flame, DollarSign, Utensils } from 'lucide-react';

const STATUS_OPTIONS = ['ALL', 'PENDING', 'ACCEPTED', 'PREPARING', 'SERVED', 'CANCELLED'];

const getStatusBadgeStyle = (status) => {
  const s = status ? status.toUpperCase() : 'PENDING';

  switch (s) {
    case 'PENDING':
      return 'bg-[#C8A96B]/10 text-[#C8A96B] border-[#C8A96B]/30 font-bold';

    case 'ACCEPTED':
      return 'bg-blue-400/10 text-blue-300 border-blue-400/25 font-bold';

    case 'PREPARING':
      return 'bg-purple-400/10 text-purple-300 border-purple-400/25 font-bold';

    case 'SERVED':
    case 'COMPLETED':
      return 'bg-[#8FA28A]/15 text-[#C7D3C0] border-[#8FA28A]/30 font-bold';

    case 'CANCELLED':
      return 'bg-red-400/10 text-red-300 border-red-400/25 font-bold';

    default:
      return 'bg-[#EEEEEE]/5 text-[#EEEEEE]/60 border-[#EEEEEE]/15';
  }
};

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const data = await getAllOrders();
      setOrders(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Fetch orders error:', err);
      setError(typeof err === 'string' ? err : 'Failed to fetch orders from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      getAllOrders()
        .then((data) => setOrders(Array.isArray(data) ? data : []))
        .catch(() => {});
    }, 7000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);

    try {
      const updated = await updateOrderStatus(orderId, newStatus);

      setOrders((prev) =>
        prev.map((ord) =>
          ord._id === orderId
            ? { ...ord, status: updated.status || newStatus }
            : ord
        )
      );
    } catch (err) {
      alert(typeof err === 'string' ? err : 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const metrics = useMemo(() => {
    const totalCount = orders.length;

    const activeCount = orders.filter((o) => {
      const s = o.status?.toUpperCase();
      return s === 'PENDING' || s === 'ACCEPTED' || s === 'PREPARING';
    }).length;

    const totalRevenue = orders
      .filter((o) => o.status?.toUpperCase() !== 'CANCELLED')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    return { totalCount, activeCount, totalRevenue };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      if (selectedStatus !== 'ALL') {
        const s = ord.status?.toUpperCase();
        const target =
          selectedStatus === 'SERVED'
            ? ['SERVED', 'COMPLETED']
            : [selectedStatus];

        if (!target.includes(s)) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();

        const nameMatch = ord.customerName?.toLowerCase().includes(q);
        const phoneMatch = ord.customerMobile?.toLowerCase().includes(q);
        const tableMatch = ord.tableNumber?.toString().includes(q);
        const idMatch = ord._id?.toLowerCase().includes(q);

        if (!nameMatch && !phoneMatch && !tableMatch && !idMatch) {
          return false;
        }
      }

      return true;
    });
  }, [orders, selectedStatus, searchQuery]);

  return (
    <div className="min-h-screen bg-[#100C09] text-[#F7F4ED] pb-20">

      <AdminHeader />

      <main className="max-w-6xl mx-auto px-4 pt-5 space-y-5">

        {/* Metrics Banner */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">

          {/* Active Kitchen Queue */}

          <div className="bg-[#15110E] border border-[#C8A96B]/20 p-4 rounded-xl flex items-center justify-between shadow-sm">

            <div>
              <p className="text-[10px] text-[#C8A96B]/70 font-extrabold uppercase tracking-wider">
                Active Kitchen Queue
              </p>

              <p className="text-xl font-black text-[#F7F4ED] mt-0.5">
                {metrics.activeCount} Orders
              </p>
            </div>

            <div className="w-9 h-9 rounded-lg bg-[#C8A96B]/10 text-[#C8A96B] flex items-center justify-center font-black border border-[#C8A96B]/20">
              <Flame size={18} />
            </div>

          </div>

          {/* Total Received */}

          <div className="bg-[#15110E] border border-[#C8A96B]/20 p-4 rounded-xl flex items-center justify-between shadow-sm">

            <div>
              <p className="text-[10px] text-[#C8A96B]/70 font-extrabold uppercase tracking-wider">
                Total Received
              </p>

              <p className="text-xl font-black text-[#F7F4ED] mt-0.5">
                {metrics.totalCount} Orders
              </p>
            </div>

            <div className="w-9 h-9 rounded-lg bg-[#100C09] text-[#EEEEEE]/70 flex items-center justify-center font-black border border-[#C8A96B]/15">
              <Clock size={18} />
            </div>

          </div>

          {/* Total Revenue */}

          <div className="bg-[#15110E] border border-[#C8A96B]/20 p-4 rounded-xl flex items-center justify-between shadow-sm">

            <div>
              <p className="text-[10px] text-[#C8A96B]/70 font-extrabold uppercase tracking-wider">
                Total Sales Revenue
              </p>

              <p className="text-xl font-black text-[#C8A96B] mt-0.5">
                ₹{metrics.totalRevenue}
              </p>
            </div>

            <div className="w-9 h-9 rounded-lg bg-[#8FA28A]/10 text-[#8FA28A] flex items-center justify-center font-black border border-[#8FA28A]/20">
              <DollarSign size={18} />
            </div>

          </div>

        </div>

        {/* Filter Toolbar */}

        <div className="bg-[#15110E] border border-[#C8A96B]/20 p-3.5 rounded-xl space-y-3 shadow-sm">

          <div className="flex flex-wrap items-center justify-between gap-3">

            <div className="relative flex-1 min-w-[240px]">

              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C8A96B]"
              />

              <input
                type="text"
                placeholder="Search by table #, name, mobile, order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#100C09] border border-[#C8A96B]/20 rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#F7F4ED] placeholder-[#EEEEEE]/30 focus:outline-none focus:border-[#C8A96B] focus:ring-2 focus:ring-[#C8A96B]/10 transition"
              />

            </div>

            <div className="flex items-center gap-3">

              <label className="flex items-center gap-2 text-xs text-[#EEEEEE]/70 font-bold cursor-pointer">

                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded border-[#C8A96B]/30 text-[#C8A96B] focus:ring-[#C8A96B] bg-[#100C09]"
                />

                <span>Auto-refresh (7s)</span>

              </label>

              <button
                onClick={fetchOrders}
                className="bg-[#100C09] border border-[#C8A96B]/20 hover:border-[#C8A96B]/50 hover:bg-[#C8A96B]/10 text-[#EEEEEE]/70 hover:text-[#F7F4ED] text-xs py-1.5 px-3 rounded-lg flex items-center gap-1.5 font-bold transition"
                title="Refresh orders list"
              >

                <RefreshCw
                  size={13}
                  className={loading ? 'animate-spin' : ''}
                />

                <span className="hidden sm:inline">
                  Refresh
                </span>

              </button>

            </div>

          </div>

          {/* Status Filters */}

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">

            {STATUS_OPTIONS.map((st) => {

              const isSelected = selectedStatus === st;

              return (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap border ${
                    isSelected
                      ? 'bg-[#C8A96B] text-[#100C09] border-[#C8A96B] shadow-sm'
                      : 'bg-[#100C09] text-[#EEEEEE]/60 border-[#C8A96B]/15 hover:bg-[#C8A96B]/10 hover:text-[#F7F4ED] hover:border-[#C8A96B]/35'
                  }`}
                >
                  {st}
                </button>
              );

            })}

          </div>

        </div>

        {/* Loading State */}

        {loading && orders.length === 0 && (

          <div className="py-14 text-center space-y-2">

            <div className="w-8 h-8 border-3 border-[#C8A96B] border-t-transparent rounded-full animate-spin mx-auto"></div>

            <p className="text-xs font-bold text-[#EEEEEE]/45">
              Loading live order queue...
            </p>

          </div>

        )}

        {/* Error State */}

        {error && (

          <div className="bg-[#15110E] border border-red-400/20 p-5 rounded-xl text-center space-y-3">

            <p className="text-xs font-bold text-red-300">
              {error}
            </p>

            <button
              onClick={fetchOrders}
              className="bg-[#C8A96B] hover:bg-[#D8BB7C] text-[#100C09] text-xs py-2 px-4 rounded-lg font-black transition"
            >
              Retry
            </button>

          </div>

        )}

        {/* Empty State */}

        {!loading && !error && filteredOrders.length === 0 && (

          <div className="bg-[#15110E] border border-[#C8A96B]/15 p-10 rounded-xl text-center space-y-2.5 shadow-sm">

            <Utensils
              size={36}
              className="mx-auto text-[#C8A96B]/50"
            />

            <h3 className="text-sm font-black text-[#F7F4ED]">
              No Orders Found
            </h3>

            <p className="text-xs font-medium text-[#EEEEEE]/45">

              {searchQuery || selectedStatus !== 'ALL'
                ? 'No orders match your current filters.'
                : 'There are currently no orders in the system.'}

            </p>

          </div>

        )}

        {/* Orders Queue Cards */}

        <div className="space-y-3.5">

          {filteredOrders.map((ord) => {

            const currentStatus = ord.status?.toUpperCase() || 'PENDING';
            const isUpdating = updatingId === ord._id;

            return (

              <div
                key={ord._id}
                className="bg-[#15110E] border border-[#C8A96B]/15 rounded-2xl p-4 shadow-sm space-y-3 hover:border-[#C8A96B]/35 transition"
              >

                {/* Header: Table & Status Badge */}

                <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-[#C8A96B]/10 pb-2.5">

                  <div className="flex items-center gap-2.5">

                    <span className="bg-[#C8A96B]/10 text-[#C8A96B] font-black text-xs px-2.5 py-1 rounded-lg border border-[#C8A96B]/25">
                      Table {ord.tableNumber}
                    </span>

                    <div>

                      <h4 className="font-extrabold text-xs text-[#F7F4ED]">
                        {ord.customerName}
                      </h4>

                      <p className="text-[11px] font-semibold text-[#EEEEEE]/40">

                        📞 {ord.customerMobile} • ID:{' '}

                        <span className="font-mono text-[#EEEEEE]/60">
                          #{ord._id}
                        </span>

                      </p>

                    </div>

                  </div>

                  <div className="flex items-center gap-2">

                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full border ${getStatusBadgeStyle(
                        currentStatus
                      )}`}
                    >
                      {currentStatus}
                    </span>

                    <span className="text-[10px] font-bold text-[#EEEEEE]/35">
                      {new Date(ord.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>

                  </div>

                </div>

                {/* Items Breakdown */}

                <div className="bg-[#100C09] p-3 rounded-xl border border-[#C8A96B]/10 divide-y divide-[#C8A96B]/10">

                  {ord.items?.map((item, idx) => {

                    const itemName =
                      item.menuItem?.name || item.name || 'Menu Item';

                    const itemPrice =
                      item.price || item.menuItem?.price || 0;

                    return (

                      <div
                        key={idx}
                        className="py-1 flex items-center justify-between text-xs font-semibold"
                      >

                        <div className="flex items-center gap-2">

                          <span className="font-black text-[#C8A96B]">
                            {item.quantity}x
                          </span>

                          <span className="font-bold text-[#F7F4ED]">
                            {itemName}
                          </span>

                        </div>

                        <span className="font-extrabold text-[#EEEEEE]/80">
                          ₹{itemPrice * item.quantity}
                        </span>

                      </div>

                    );

                  })}

                  <div className="pt-2 flex justify-between items-center text-xs font-extrabold">

                    <span className="text-[#EEEEEE]/45">
                      Total Order Bill
                    </span>

                    <span className="text-[#C8A96B] text-sm font-black">
                      ₹{ord.totalAmount}
                    </span>

                  </div>

                </div>

                {/* Quick Status Action Buttons */}

                <div className="flex flex-wrap items-center justify-end gap-2 pt-0.5">

                  <span className="text-[11px] text-[#EEEEEE]/40 font-bold mr-auto">
                    Advance Status:
                  </span>

                  {currentStatus === 'PENDING' && (

                    <button
                      onClick={() =>
                        handleStatusUpdate(ord._id, 'ACCEPTED')
                      }
                      disabled={isUpdating}
                      className="bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-400/20 text-xs font-bold px-3 py-1.5 rounded-lg transition disabled:opacity-40"
                    >
                      Accept Order
                    </button>

                  )}

                  {(currentStatus === 'PENDING' ||
                    currentStatus === 'ACCEPTED') && (

                    <button
                      onClick={() =>
                        handleStatusUpdate(ord._id, 'PREPARING')
                      }
                      disabled={isUpdating}
                      className="bg-[#C8A96B] hover:bg-[#D8BB7C] text-[#100C09] text-xs font-bold px-3 py-1.5 rounded-lg transition disabled:opacity-40"
                    >
                      Start Preparing
                    </button>

                  )}

                  {currentStatus !== 'SERVED' &&
                    currentStatus !== 'CANCELLED' && (

                    <button
                      onClick={() =>
                        handleStatusUpdate(ord._id, 'SERVED')
                      }
                      disabled={isUpdating}
                      className="bg-[#8FA28A]/20 hover:bg-[#8FA28A]/30 text-[#C7D3C0] border border-[#8FA28A]/25 text-xs font-bold px-3 py-1.5 rounded-lg transition disabled:opacity-40"
                    >
                      Mark Served
                    </button>

                  )}

                  {currentStatus !== 'CANCELLED' &&
                    currentStatus !== 'SERVED' && (

                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            'Cancel this customer order?'
                          )
                        ) {
                          handleStatusUpdate(
                            ord._id,
                            'CANCELLED'
                          );
                        }
                      }}
                      disabled={isUpdating}
                      className="bg-red-400/10 hover:bg-red-400/20 text-red-300 border border-red-400/20 text-xs font-bold px-3 py-1.5 rounded-lg transition disabled:opacity-40"
                    >
                      Cancel Order
                    </button>

                  )}

                </div>

              </div>

            );

          })}

        </div>

      </main>

    </div>
  );
};

export default AdminOrdersPage;