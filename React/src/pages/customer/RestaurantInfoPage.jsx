import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { getRestaurantInfo } from '../../services/restaurantService';

import {
  Utensils,
  MapPin,
  Clock,
  Phone,
  ArrowLeft,
  CreditCard,
  ChevronRight
} from 'lucide-react';

const RestaurantInfoPage = () => {

  const navigate = useNavigate();

  const [info, setInfo] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    getRestaurantInfo()
      .then((data) => setInfo(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

  }, []);

  const isAccepting = info?.isAcceptingOrders !== false;

  return (

    <div className="min-h-screen pb-24 bg-[#100C09] text-[#F7F4ED]">

      {/* Top Header */}

      <header className="sticky top-0 z-30 bg-[#100C09]/95 backdrop-blur-md border-b border-[#C8A96B]/20 px-3 sm:px-6 py-2.5 shadow-sm">

        <div className="max-w-xl mx-auto flex items-center gap-2.5">

          <button
            onClick={() => navigate('/')}
            className="p-1.5 rounded-lg hover:bg-[#C8A96B]/10 text-[#EEEEEE]/70 hover:text-[#C8A96B] transition"
          >
            <ArrowLeft size={18} />
          </button>

          <h1 className="text-base font-black text-[#F7F4ED]">
            Restaurant Information
          </h1>

        </div>

      </header>

      <main className="max-w-xl mx-auto px-3 sm:px-6 pt-4 space-y-4">

        {loading ? (

          <div className="py-14 text-center">

            <div className="w-8 h-8 border-3 border-[#C8A96B] border-t-transparent rounded-full animate-spin mx-auto" />

            <p className="text-xs font-bold text-[#EEEEEE]/45 mt-3">
              Loading restaurant information...
            </p>

          </div>

        ) : (

          <>

            {/* Banner card */}

            <div className="bg-[#15110E] text-[#F7F4ED] p-5 rounded-2xl border border-[#C8A96B]/25 shadow-sm relative overflow-hidden">

              <div className="relative z-10 space-y-1.5">

                <div className="w-10 h-10 rounded-xl bg-[#C8A96B] flex items-center justify-center text-[#100C09] mb-2 font-bold shadow-sm">

                  <Utensils size={20} />

                </div>

                <h2 className="text-xl font-black text-[#F7F4ED]">
                  {info?.name || 'Bowl & Brick'}
                </h2>

                <p className="text-xs font-semibold text-[#EEEEEE]/45">
                  Digital QR Ordering Experience
                </p>

                <div className="pt-2">

                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${
                      isAccepting
                        ? 'bg-[#8FA28A]/15 text-[#C7D3C0] border-[#8FA28A]/30'
                        : 'bg-red-500/10 text-red-300 border-red-400/25'
                    }`}
                  >

                    <span
                      className={`w-1.5 h-1.5 rounded-full animate-ping ${
                        isAccepting
                          ? 'bg-[#8FA28A]'
                          : 'bg-red-400'
                      }`}
                    />

                    {isAccepting
                      ? 'Currently Open & Accepting Orders'
                      : 'Orders Currently Closed'}

                  </span>

                </div>

              </div>

              <div className="absolute -right-6 -bottom-6 opacity-[0.06] text-[#C8A96B] select-none pointer-events-none">

                <Utensils size={150} />

              </div>

            </div>

            {/* Info Items List */}

            <div className="bg-[#15110E] rounded-2xl border border-[#C8A96B]/20 divide-y divide-[#C8A96B]/10 shadow-sm overflow-hidden">

              {info?.address && (

                <div className="p-3.5 flex items-start gap-3">

                  <div className="w-8 h-8 rounded-lg bg-[#C8A96B]/10 text-[#C8A96B] flex items-center justify-center shrink-0 font-bold border border-[#C8A96B]/20">

                    <MapPin size={16} />

                  </div>

                  <div>

                    <h4 className="text-[10px] font-bold text-[#C7D3C0]/45 uppercase tracking-wider">
                      Address
                    </h4>

                    <p className="text-xs font-bold text-[#F7F4ED] mt-0.5">
                      {info.address}
                    </p>

                  </div>

                </div>

              )}

              {info?.openingHours && (

                <div className="p-3.5 flex items-start gap-3">

                  <div className="w-8 h-8 rounded-lg bg-[#C8A96B]/10 text-[#C8A96B] flex items-center justify-center shrink-0 font-bold border border-[#C8A96B]/20">

                    <Clock size={16} />

                  </div>

                  <div>

                    <h4 className="text-[10px] font-bold text-[#C7D3C0]/45 uppercase tracking-wider">
                      Opening Hours
                    </h4>

                    <p className="text-xs font-bold text-[#F7F4ED] mt-0.5">
                      {info.openingHours}
                    </p>

                  </div>

                </div>

              )}

              {info?.contactNumber && (

                <div className="p-3.5 flex items-start gap-3">

                  <div className="w-8 h-8 rounded-lg bg-[#C8A96B]/10 text-[#C8A96B] flex items-center justify-center shrink-0 font-bold border border-[#C8A96B]/20">

                    <Phone size={16} />

                  </div>

                  <div>

                    <h4 className="text-[10px] font-bold text-[#C7D3C0]/45 uppercase tracking-wider">
                      Contact Number
                    </h4>

                    <a
                      href={`tel:${info.contactNumber}`}
                      className="text-xs font-bold text-[#C8A96B] hover:text-[#D8BB7C] hover:underline mt-0.5 inline-block transition"
                    >
                      {info.contactNumber}
                    </a>

                  </div>

                </div>

              )}

              <div className="p-3.5 flex items-start gap-3">

                <div className="w-8 h-8 rounded-lg bg-[#C8A96B]/10 text-[#C8A96B] flex items-center justify-center shrink-0 font-bold border border-[#C8A96B]/20">

                  <CreditCard size={16} />

                </div>

                <div>

                  <h4 className="text-[10px] font-bold text-[#C7D3C0]/45 uppercase tracking-wider">
                    Payment Method
                  </h4>

                  <p className="text-xs font-bold text-[#F7F4ED] mt-0.5">
                    Pay at Counter (Cash / Card / UPI)
                  </p>

                </div>

              </div>

            </div>

            {/* Back to Menu button */}

            <button
              onClick={() => navigate('/menu')}
              className="w-full py-3 text-xs font-black flex items-center justify-center gap-1.5 bg-[#C8A96B] hover:bg-[#D8BB7C] text-[#100C09] rounded-xl shadow-sm transition"
            >

              <span>
                Back to Menu
              </span>

              <ChevronRight size={16} />

            </button>

          </>

        )}

      </main>

    </div>

  );

};

export default RestaurantInfoPage;