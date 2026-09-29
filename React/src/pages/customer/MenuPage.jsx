import React, { useEffect, useRef, useState, useMemo } from 'react';

import { useSelector } from 'react-redux';

import { getRestaurantInfo } from '../../services/restaurantService';

import { getMenuItems } from '../../services/menuService';

import RestaurantHeader from '../../components/customer/RestaurantHeader';

import SearchBar from '../../components/customer/SearchBar';

import CategoryFilter from '../../components/customer/CategoryFilter';

import TypeFilter from '../../components/customer/TypeFilter';

import MenuCard from '../../components/customer/MenuCard';

import MenuDetailsModal from '../../components/customer/MenuDetailsModal';

import {
  selectCartTotalCount,
  selectCartTotalAmount
} from '../../redux/slices/cartSlice';

import { useNavigate } from 'react-router-dom';

import {
  ShoppingBag,
  ArrowRight,
  AlertTriangle,
  RefreshCw,
  UtensilsCrossed
} from 'lucide-react';

/* =========================================================
   ANIMATION STYLES (no Tailwind config changes needed)
========================================================= */
const animationStyles = `
  :root { --ease-out: cubic-bezier(0.22, 1, 0.36, 1); }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeOnly {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes cartBarIn {
    from { opacity: 0; transform: translateY(40px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes bump {
    0%   { transform: scale(1); }
    40%  { transform: scale(1.25); }
    100% { transform: scale(1); }
  }
  @keyframes softPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(200, 169, 107, 0.4); }
    50%      { box-shadow: 0 0 0 9px rgba(200, 169, 107, 0); }
  }
  @keyframes gentleFloat {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(-5px); }
  }

  /* ---- Page load ---- */
  .page-fade   { animation: fadeOnly 0.7s ease-out both; }
  .filters-in  { animation: fadeDown 0.7s var(--ease-out) 0.15s both; }
  .banner-in   { animation: fadeDown 0.6s var(--ease-out) both; }
  .state-in    { animation: fadeUp 0.7s var(--ease-out) both; }
  .modal-fade  { animation: fadeOnly 0.3s ease-out backwards; }

  /* ---- Scroll / mount reveal for menu cards ---- */
  .reveal {
    opacity: 0;
    transform: translateY(26px) scale(0.97);
    transition: opacity 0.7s var(--ease-out), transform 0.7s var(--ease-out);
    will-change: opacity, transform;
  }
  .reveal.is-visible { opacity: 1; transform: none; }

  /* Card hover (desktop only, so touch devices don't get stuck states) */
  .card-wrap { transition: transform 0.45s var(--ease-out), filter 0.45s ease; }
  @media (hover: hover) {
    .card-wrap:hover { transform: translateY(-6px); filter: drop-shadow(0 18px 24px rgba(0,0,0,0.55)); }
  }
  .card-wrap:active { transform: scale(0.98); }

  /* ---- Cart bar ---- */
  .cart-bar-in { animation: cartBarIn 0.6s var(--ease-out) both; }
  .cart-bar    { transition: transform 0.3s var(--ease-out), box-shadow 0.3s ease, border-color 0.3s ease; }
  @media (hover: hover) {
    .cart-bar:hover { transform: translateY(-3px); border-color: rgba(200,169,107,0.6); box-shadow: 0 18px 40px -12px rgba(200,169,107,0.35); }
  }
  .cart-icon-pulse { animation: softPulse 2.6s ease-in-out infinite; }
  .cart-bump       { display: inline-block; animation: bump 0.4s var(--ease-out); }
  .cart-arrow      { transition: transform 0.3s var(--ease-out); }
  .cart-bar:hover .cart-arrow { transform: translateX(4px); }

  /* ---- Buttons & icons ---- */
  .btn-soft { transition: transform 0.3s var(--ease-out), background-color 0.3s ease, border-color 0.3s ease; }
  .btn-soft:hover  { transform: translateY(-2px); }
  .btn-soft:active { transform: scale(0.97); }
  .spin-on-hover:hover svg { transform: rotate(180deg); }
  .spin-on-hover svg { transition: transform 0.6s var(--ease-out); }
  .icon-float { animation: gentleFloat 3.2s ease-in-out infinite; }

  a:focus-visible, button:focus-visible {
    outline: 2px solid #C8A96B;
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    .page-fade, .filters-in, .banner-in, .state-in, .modal-fade, .cart-bar-in,
    .cart-icon-pulse, .cart-bump, .icon-float, .reveal, .card-wrap {
      animation: none !important;
      transition: none !important;
      opacity: 1 !important;
      transform: none !important;
    }
  }
`;

/* =========================================================
   ANIMATION HELPERS (UI only — no data logic)
========================================================= */
function useInView(threshold = 0.1) {

  const ref = useRef(null);

  const [inView, setInView] = useState(false);

  useEffect(() => {

    const el = ref.current;

    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // animate once
        }
      },
      { threshold, rootMargin: '0px 0px -30px 0px' }
    );

    observer.observe(el);

    return () => observer.disconnect();

  }, [threshold]);

  return [ref, inView];

}

function Reveal({ children, className = '', delay = 0 }) {

  const [ref, inView] = useInView();

  return (

    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal ${inView ? 'is-visible' : ''} ${className}`}
    >
      {children}
    </div>

  );

}

/* =========================================================
   PAGE
========================================================= */
const MenuPage = () => {

  const navigate = useNavigate();

  const [restaurantInfo, setRestaurantInfo] = useState(null);

  const [menuItems, setMenuItems] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  // Search Toggle State: Hidden by default, opened when clicking Search Icon in header
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [typeFilter, setTypeFilter] = useState('All');

  const [spiceFilter, setSpiceFilter] = useState('All');

  // Selected dish for modal detail view
  const [selectedDish, setSelectedDish] = useState(null);

  const cartTotalCount = useSelector(selectCartTotalCount);

  const cartTotalAmount = useSelector(selectCartTotalAmount);

  const fetchData = async () => {

    setLoading(true);

    setError(null);

    try {

      const [infoRes, menuRes] = await Promise.allSettled([
        getRestaurantInfo(),
        getMenuItems(),
      ]);

      if (infoRes.status === 'fulfilled') {
        setRestaurantInfo(infoRes.value);
      }

      if (menuRes.status === 'fulfilled') {

        setMenuItems(
          Array.isArray(menuRes.value)
            ? menuRes.value
            : []
        );

      } else {

        setError(
          menuRes.reason || 'Failed to load menu items.'
        );

      }

    } catch (err) {

      setError('Error connecting to restaurant server.');

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    fetchData();
  }, []);

  // Compute available categories dynamically
  const categories = useMemo(() => {

    const counts = {};

    menuItems.forEach((item) => {

      if (item.category) {

        counts[item.category] =
          (counts[item.category] || 0) + 1;

      }

    });

    const catList = [
      {
        name: 'All',
        count: menuItems.length
      }
    ];

    Object.keys(counts).forEach((cat) => {

      catList.push({
        name: cat,
        count: counts[cat]
      });

    });

    return catList;

  }, [menuItems]);

  // Filtered menu items
  const filteredMenuItems = useMemo(() => {

    return menuItems.filter((dish) => {

      if (
        selectedCategory !== 'All' &&
        dish.category !== selectedCategory
      ) {
        return false;
      }

      if (
        typeFilter !== 'All' &&
        dish.type !== typeFilter
      ) {
        return false;
      }

      if (
        spiceFilter !== 'All' &&
        dish.spiceLevel !== spiceFilter
      ) {
        return false;
      }

      if (searchTerm.trim()) {

        const query = searchTerm.toLowerCase();

        const nameMatch =
          dish.name?.toLowerCase().includes(query);

        const descMatch =
          dish.description?.toLowerCase().includes(query);

        const ingMatch =
          dish.ingredients?.some((ing) =>
            ing.toLowerCase().includes(query)
          );

        if (!nameMatch && !descMatch && !ingMatch) {
          return false;
        }

      }

      return true;

    });

  }, [
    menuItems,
    selectedCategory,
    typeFilter,
    spiceFilter,
    searchTerm
  ]);

  const isRestaurantOpen =
    restaurantInfo?.isAcceptingOrders !== false;

  return (

    <div className="page-fade min-h-screen pb-24 text-[#F7F4ED] bg-[#100C09]">

      <style>{animationStyles}</style>

      {/* Compact Navbar with Search Icon toggle */}

      <RestaurantHeader
        restaurantInfo={restaurantInfo}
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
      />

      <main className="max-w-6xl mx-auto px-3 sm:px-4 pt-3 space-y-3">

        {/* Closed Banner if not accepting orders */}

        {!isRestaurantOpen && !loading && (

          <div className="banner-in p-3 bg-red-500/10 border border-red-400/25 rounded-xl flex items-start gap-2.5 text-red-200">

            <AlertTriangle
              size={18}
              className="shrink-0 text-red-400 mt-0.5"
            />

            <div>

              <h3 className="font-black text-xs text-red-300">
                Ordering Currently Disabled
              </h3>

              <p className="text-[11px] font-bold text-red-300/70 mt-0.5">
                The restaurant is currently closed for orders.
                You may browse the menu below.
              </p>

            </div>

          </div>

        )}

        {/* Sticky Filters & Expandable Search Bar */}

        <div className="filters-in space-y-2 sticky top-[14px] z-20 bg-[#100C09]/95 backdrop-blur-md pt-1.5 pb-2.5 border-b border-[#C8A96B]/20 shadow-sm rounded-b-xl px-2">

          {/* Expandable Search Bar */}

          {(isSearchOpen || searchTerm) && (

            <div className="banner-in pt-0.5">

              <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onClose={() => {
                  setIsSearchOpen(false);
                  setSearchTerm('');
                }}
              />

            </div>

          )}

          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          <TypeFilter
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            spiceFilter={spiceFilter}
            setSpiceFilter={setSpiceFilter}
          />

        </div>

        {/* Loading State */}

        {loading && (

          <div className="state-in py-14 text-center space-y-2">

            <div className="w-8 h-8 border-3 border-[#C8A96B] border-t-transparent rounded-full animate-spin mx-auto" />

            <p className="text-xs font-black text-[#C7D3C0] animate-pulse">
              Loading menu...
            </p>

          </div>

        )}

        {/* Error State */}

        {error && !loading && (

          <div className="state-in py-10 px-4 text-center bg-[#15110E] rounded-2xl border border-[#C8A96B]/15 space-y-3 shadow-sm">

            <div className="icon-float w-10 h-10 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto border border-red-400/20">

              <AlertTriangle size={20} />

            </div>

            <h3 className="font-black text-sm text-[#F7F4ED]">
              Unable to Load Menu
            </h3>

            <p className="text-xs font-bold text-[#EEEEEE]/50 max-w-xs mx-auto">
              {error}
            </p>

            <button
              onClick={fetchData}
              className="btn-soft spin-on-hover bg-[#15110E] border border-[#C8A96B]/30 text-[#C8A96B] hover:bg-[#C8A96B]/10 hover:border-[#C8A96B]/50 text-xs px-3.5 py-1.5 rounded-lg inline-flex items-center gap-1.5 font-bold"
            >
              <RefreshCw size={13} />
              Try Again
            </button>

          </div>

        )}

        {/* Empty State */}

        {!loading &&
          !error &&
          filteredMenuItems.length === 0 && (

            <div className="state-in py-14 text-center space-y-3 bg-[#15110E] rounded-2xl border border-[#C8A96B]/15 p-6 shadow-sm">

              <div className="icon-float w-12 h-12 bg-[#C8A96B]/10 text-[#C8A96B] rounded-full flex items-center justify-center mx-auto border border-[#C8A96B]/20">

                <UtensilsCrossed size={24} />

              </div>

              <h3 className="font-black text-sm text-[#F7F4ED]">
                No dishes found
              </h3>

              <p className="text-xs font-bold text-[#EEEEEE]/50 max-w-xs mx-auto">

                {searchTerm
                  ? `No items match "${searchTerm}". Try resetting search or filters.`
                  : 'No menu items available in this category.'}

              </p>

              {(searchTerm ||
                selectedCategory !== 'All' ||
                typeFilter !== 'All' ||
                spiceFilter !== 'All') && (

                <button
                  onClick={() => {

                    setSearchTerm('');

                    setIsSearchOpen(false);

                    setSelectedCategory('All');

                    setTypeFilter('All');

                    setSpiceFilter('All');

                  }}
                  className="btn-soft bg-[#15110E] border border-[#C8A96B]/30 text-[#C8A96B] hover:bg-[#C8A96B]/10 hover:border-[#C8A96B]/50 text-xs px-3.5 py-1.5 rounded-lg font-bold"
                >
                  Reset All Filters
                </button>

              )}

            </div>

          )}

        {/* Menu Items Grid */}

        {!loading &&
          !error &&
          filteredMenuItems.length > 0 && (

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">

              {filteredMenuItems.map((dish, index) => (

                <Reveal
                  key={dish._id}
                  delay={(index % 4) * 80}
                  className="card-wrap"
                >

                  <MenuCard
                    dish={dish}
                    onSelectDish={(d) => setSelectedDish(d)}
                    isRestaurantOpen={isRestaurantOpen}
                  />

                </Reveal>

              ))}

            </div>

          )}

      </main>

      {/* Floating Bottom Cart Bar */}

      {cartTotalCount > 0 && (

        <div className="cart-bar-in fixed bottom-14 left-3 right-3 z-30 max-w-md mx-auto">

          <div
            onClick={() => navigate('/cart')}
            className="cart-bar bg-[#15110E] text-[#F7F4ED] p-3.5 rounded-2xl shadow-2xl flex items-center justify-between cursor-pointer active:scale-[0.98] border border-[#C8A96B]/30 backdrop-blur-md"
          >

            <div className="flex items-center gap-3">

              <div className="cart-icon-pulse w-9 h-9 rounded-xl bg-[#C8A96B] text-[#100C09] flex items-center justify-center font-black shadow-sm">

                <ShoppingBag size={18} />

              </div>

              <div>

                <p className="text-[11px] text-[#EEEEEE]/50 font-bold">

                  <span key={cartTotalCount} className="cart-bump">
                    {cartTotalCount}
                  </span>{' '}

                  {cartTotalCount === 1
                    ? 'Item'
                    : 'Items'} added

                </p>

                <p className="text-sm font-black text-[#C8A96B]">
                  <span key={cartTotalAmount} className="cart-bump">
                    ₹{cartTotalAmount}
                  </span>
                </p>

              </div>

            </div>

            <div className="flex items-center gap-1.5 text-xs font-black bg-[#C8A96B] text-[#100C09] px-3.5 py-1.5 rounded-xl shadow-sm hover:bg-[#D8BB7C] transition">

              <span>
                View Cart
              </span>

              <ArrowRight size={14} className="cart-arrow" />

            </div>

          </div>

        </div>

      )}

      {/* Dish Detail Modal */}

      {selectedDish && (

        <div className="modal-fade">

          <MenuDetailsModal
            dish={selectedDish}
            onClose={() => setSelectedDish(null)}
            isRestaurantOpen={isRestaurantOpen}
          />

        </div>

      )}

    </div>

  );

};

export default MenuPage;