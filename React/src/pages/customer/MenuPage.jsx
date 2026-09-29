import React, { useEffect, useState, useMemo } from 'react';

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

    <div className="min-h-screen pb-24 text-[#F7F4ED] bg-[#100C09]">

      {/* Compact Navbar with Search Icon toggle */}

      <RestaurantHeader
        restaurantInfo={restaurantInfo}
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
      />

      <main className="max-w-6xl mx-auto px-3 sm:px-4 pt-3 space-y-3">

        {/* Closed Banner if not accepting orders */}

        {!isRestaurantOpen && !loading && (

          <div className="p-3 bg-red-500/10 border border-red-400/25 rounded-xl flex items-start gap-2.5 text-red-200">

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

        <div className="space-y-2 sticky top-[14px] z-20 bg-[#100C09]/95 backdrop-blur-md pt-1.5 pb-2.5 border-b border-[#C8A96B]/20 shadow-sm rounded-b-xl px-2">

          {/* Expandable Search Bar */}

          {(isSearchOpen || searchTerm) && (

            <div className="pt-0.5">

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

          <div className="py-14 text-center space-y-2">

            <div className="w-8 h-8 border-3 border-[#C8A96B] border-t-transparent rounded-full animate-spin mx-auto" />

            <p className="text-xs font-black text-[#C7D3C0]">
              Loading menu...
            </p>

          </div>

        )}

        {/* Error State */}

        {error && !loading && (

          <div className="py-10 px-4 text-center bg-[#15110E] rounded-2xl border border-[#C8A96B]/15 space-y-3 shadow-sm">

            <div className="w-10 h-10 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto border border-red-400/20">

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
              className="bg-[#15110E] border border-[#C8A96B]/30 text-[#C8A96B] hover:bg-[#C8A96B]/10 hover:border-[#C8A96B]/50 text-xs px-3.5 py-1.5 rounded-lg inline-flex items-center gap-1.5 font-bold transition"
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

            <div className="py-14 text-center space-y-3 bg-[#15110E] rounded-2xl border border-[#C8A96B]/15 p-6 shadow-sm">

              <div className="w-12 h-12 bg-[#C8A96B]/10 text-[#C8A96B] rounded-full flex items-center justify-center mx-auto border border-[#C8A96B]/20">

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
                  className="bg-[#15110E] border border-[#C8A96B]/30 text-[#C8A96B] hover:bg-[#C8A96B]/10 hover:border-[#C8A96B]/50 text-xs px-3.5 py-1.5 rounded-lg font-bold transition"
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

              {filteredMenuItems.map((dish) => (

                <MenuCard
                  key={dish._id}
                  dish={dish}
                  onSelectDish={(d) => setSelectedDish(d)}
                  isRestaurantOpen={isRestaurantOpen}
                />

              ))}

            </div>

          )}

      </main>

      {/* Floating Bottom Cart Bar */}

      {cartTotalCount > 0 && (

        <div className="fixed bottom-14 left-3 right-3 z-30 max-w-md mx-auto animate-bounce-short">

          <div
            onClick={() => navigate('/cart')}
            className="bg-[#15110E] text-[#F7F4ED] p-3.5 rounded-2xl shadow-2xl flex items-center justify-between cursor-pointer transition-all active:scale-[0.98] border border-[#C8A96B]/30 backdrop-blur-md"
          >

            <div className="flex items-center gap-3">

              <div className="w-9 h-9 rounded-xl bg-[#C8A96B] text-[#100C09] flex items-center justify-center font-black shadow-sm">

                <ShoppingBag size={18} />

              </div>

              <div>

                <p className="text-[11px] text-[#EEEEEE]/50 font-bold">

                  {cartTotalCount}{' '}

                  {cartTotalCount === 1
                    ? 'Item'
                    : 'Items'} added

                </p>

                <p className="text-sm font-black text-[#C8A96B]">
                  ₹{cartTotalAmount}
                </p>

              </div>

            </div>

            <div className="flex items-center gap-1.5 text-xs font-black bg-[#C8A96B] text-[#100C09] px-3.5 py-1.5 rounded-xl shadow-sm hover:bg-[#D8BB7C] transition">

              <span>
                View Cart
              </span>

              <ArrowRight size={14} />

            </div>

          </div>

        </div>

      )}

      {/* Dish Detail Modal */}

      {selectedDish && (

        <MenuDetailsModal
          dish={selectedDish}
          onClose={() => setSelectedDish(null)}
          isRestaurantOpen={isRestaurantOpen}
        />

      )}

    </div>

  );

};

export default MenuPage;