import React, { useEffect, useState } from 'react';

import { NavLink, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import { logoutAdmin } from '../../redux/slices/adminSlice';

import { getRestaurantInfo, updateRestaurantInfo } from '../../services/restaurantService';

import { Utensils, ClipboardList, Settings, LogOut, Power } from 'lucide-react';

const AdminHeader = () => {

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { admin } = useSelector((state) => state.admin);

  const [restaurantInfo, setRestaurantInfo] = useState(null);

  const [toggling, setToggling] = useState(false);

  const fetchInfo = async () => {

    try {

      const data = await getRestaurantInfo();

      setRestaurantInfo(data);

    } catch (err) {

      console.error('Failed to load restaurant status:', err);

    }

  };

  useEffect(() => {

    fetchInfo();

  }, []);

  const handleToggleAccepting = async () => {

    if (!restaurantInfo) return;

    setToggling(true);

    const newStatus = !restaurantInfo.isAcceptingOrders;

    try {

      const updated = await updateRestaurantInfo({

        ...restaurantInfo,

        isAcceptingOrders: newStatus,

      });

      setRestaurantInfo(updated);

    } catch (err) {

      alert(typeof err === 'string' ? err : 'Failed to update order acceptance status');

    } finally {

      setToggling(false);

    }

  };

  const handleLogout = () => {

    dispatch(logoutAdmin());

    navigate('/admin/login');

  };

  const isAccepting = restaurantInfo?.isAcceptingOrders !== false;

  return (

    <header className="bg-[#100C09] text-[#F7F4ED] border-b border-[#C8A96B]/25 sticky top-0 z-40 shadow-lg">

      <div className="max-w-6xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">

        {/* Brand & Admin Badge */}

        <div className="flex items-center gap-2.5">

          <div className="w-8 h-8 rounded-lg bg-[#C8A96B] text-[#100C09] flex items-center justify-center font-black shrink-0 shadow-sm">

            <Utensils size={16} />

          </div>

          <div>

            <h1 className="text-sm font-black leading-tight flex items-center gap-1.5">

              <span>Bowl & Brick Admin</span>

              <span className="bg-[#C8A96B]/10 text-[#C7D3C0] text-[9px] font-black px-2 py-0.5 rounded-full border border-[#C8A96B]/25">

                Portal

              </span>

            </h1>

            <p className="text-[10px] text-[#EEEEEE]/50 font-semibold">

              {admin?.name || 'Manager'} ({admin?.email || 'admin'})

            </p>

          </div>

        </div>


        {/* Emergency Stop Toggle */}

        <div className="flex items-center gap-2.5">

          <button

            onClick={handleToggleAccepting}

            disabled={toggling}

            className={`px-3 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition border ${
              isAccepting
                ? 'bg-[#8FA28A]/10 text-[#C7D3C0] border-[#8FA28A]/30 hover:bg-[#8FA28A]/20'
                : 'bg-red-400/10 text-red-300 border-red-400/25 hover:bg-red-400/20 animate-pulse'
            }`}

            title="Toggle customer order acceptance"

          >

            <Power size={13} />

            <span>{isAccepting ? 'Orders OPEN' : 'Orders STOPPED'}</span>

          </button>

          <button

            onClick={handleLogout}

            className="p-1.5 text-[#EEEEEE]/45 hover:text-[#F7F4ED] hover:bg-[#C8A96B]/10 rounded-lg transition text-xs flex items-center gap-1 font-bold"

            title="Log out from admin"

          >

            <LogOut size={15} />

            <span className="hidden sm:inline">Logout</span>

          </button>

        </div>

      </div>


      {/* Navigation Tabs */}

      <div className="bg-[#0B0806] border-t border-[#C8A96B]/15 px-4">

        <div className="max-w-6xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar py-1.5 text-xs font-bold">

          <NavLink

            to="/admin/orders"

            className={({ isActive }) =>
              `px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                isActive
                  ? 'bg-[#C8A96B] text-[#100C09] font-black shadow-sm'
                  : 'text-[#EEEEEE]/50 hover:text-[#F7F4ED] hover:bg-[#C8A96B]/10'
              }`
            }

          >

            <ClipboardList size={15} />

            <span>Live Kitchen Orders</span>

          </NavLink>


          <NavLink

            to="/admin/menu"

            className={({ isActive }) =>
              `px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                isActive
                  ? 'bg-[#C8A96B] text-[#100C09] font-black shadow-sm'
                  : 'text-[#EEEEEE]/50 hover:text-[#F7F4ED] hover:bg-[#C8A96B]/10'
              }`
            }

          >

            <Utensils size={15} />

            <span>Menu Items Manager</span>

          </NavLink>


          <NavLink

            to="/admin/settings"

            className={({ isActive }) =>
              `px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                isActive
                  ? 'bg-[#C8A96B] text-[#100C09] font-black shadow-sm'
                  : 'text-[#EEEEEE]/50 hover:text-[#F7F4ED] hover:bg-[#C8A96B]/10'
              }`
            }

          >

            <Settings size={15} />

            <span>Restaurant Profile</span>

          </NavLink>

        </div>

      </div>

    </header>

  );

};

export default AdminHeader;