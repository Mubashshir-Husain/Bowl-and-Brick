import React, { useEffect, useState } from 'react';

import AdminHeader from '../../components/admin/AdminHeader';

import {
  getRestaurantInfo,
  updateRestaurantInfo
} from '../../services/restaurantService';

import {
  Settings,
  Save,
  CheckCircle2,
  AlertCircle,
  Utensils,
  MapPin,
  Clock,
  Phone,
  Power
} from 'lucide-react';

const AdminSettingsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    openingHours: '',
    contactNumber: '',
    isAcceptingOrders: true,
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchInfo = async () => {
    setLoading(true);

    try {
      const data = await getRestaurantInfo();

      if (data) {
        setFormData({
          name: data.name || '',
          address: data.address || '',
          openingHours: data.openingHours || '',
          contactNumber: data.contactNumber || '',
          isAcceptingOrders: data.isAcceptingOrders !== false,
        });
      }

      setError(null);
    } catch (err) {
      console.error(err);
      setError(
        typeof err === 'string'
          ? err
          : 'Failed to fetch restaurant settings.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setSuccess(null);

    if (!formData.name.trim()) {
      return setError('Restaurant name is required');
    }

    if (!formData.address.trim()) {
      return setError('Address is required');
    }

    setSubmitting(true);

    try {
      const updated = await updateRestaurantInfo({
        name: formData.name.trim(),
        address: formData.address.trim(),
        openingHours: formData.openingHours.trim(),
        contactNumber: formData.contactNumber.trim(),
        isAcceptingOrders: formData.isAcceptingOrders,
      });

      setSuccess(
        'Restaurant profile & operating settings updated successfully!'
      );

      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      console.error(err);

      setError(
        typeof err === 'string'
          ? err
          : 'Failed to update settings'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#100C09] text-[#F7F4ED] pb-20">

      <AdminHeader />

      <main className="max-w-2xl mx-auto px-4 pt-5 space-y-5">

        {/* Page Header */}

        <div className="flex items-center gap-3 bg-[#15110E] border border-[#C8A96B]/20 p-3.5 rounded-xl shadow-sm">

          <div className="w-9 h-9 rounded-lg bg-[#C8A96B]/10 text-[#C8A96B] flex items-center justify-center font-black border border-[#C8A96B]/20">

            <Settings size={18} />

          </div>

          <div>

            <h2 className="text-base font-black text-[#F7F4ED]">
              Restaurant Profile & Controls
            </h2>

            <p className="text-xs font-semibold text-[#EEEEEE]/45">
              Manage public restaurant information and order intake controls.
            </p>

          </div>

        </div>

        {/* Error */}

        {error && (

          <div className="p-3 bg-red-400/10 border border-red-400/20 text-red-300 text-xs font-extrabold rounded-xl flex items-center gap-2">

            <AlertCircle
              size={16}
              className="shrink-0 text-red-400"
            />

            <span>{error}</span>

          </div>

        )}

        {/* Success */}

        {success && (

          <div className="p-3 bg-[#8FA28A]/10 border border-[#8FA28A]/25 text-[#C7D3C0] text-xs font-black rounded-xl flex items-center gap-2 animate-bounce-short shadow-sm">

            <CheckCircle2
              size={16}
              className="shrink-0 text-[#8FA28A]"
            />

            <span>{success}</span>

          </div>

        )}

        {/* Loading */}

        {loading ? (

          <div className="py-14 text-center">

            <div className="w-8 h-8 border-3 border-[#C8A96B] border-t-transparent rounded-full animate-spin mx-auto" />

          </div>

        ) : (

          <form
            onSubmit={handleSubmit}
            className="bg-[#15110E] border border-[#C8A96B]/20 p-5 rounded-2xl space-y-4 shadow-sm"
          >

            {/* Emergency Stop Switch Card */}

            <div className="p-3.5 bg-[#100C09] border border-[#C8A96B]/15 rounded-xl flex items-center justify-between gap-3">

              <div>

                <h4 className="font-extrabold text-xs text-[#F7F4ED] flex items-center gap-1.5">

                  <Power
                    size={15}
                    className={
                      formData.isAcceptingOrders
                        ? 'text-[#8FA28A]'
                        : 'text-red-400'
                    }
                  />

                  <span>Order Intake Status</span>

                </h4>

                <p className="text-[11px] font-semibold text-[#EEEEEE]/45 mt-0.5">

                  {formData.isAcceptingOrders
                    ? 'Customers are currently allowed to place orders.'
                    : 'Emergency Stop active: Customers cannot place orders.'}

                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    isAcceptingOrders: !formData.isAcceptingOrders
                  })
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition shadow-sm ${
                  formData.isAcceptingOrders
                    ? 'bg-[#8FA28A] text-[#100C09] hover:bg-[#9EAF99]'
                    : 'bg-red-500/90 text-white animate-pulse'
                }`}
              >
                {formData.isAcceptingOrders
                  ? 'Orders OPEN'
                  : 'Orders STOPPED'}
              </button>

            </div>

            {/* Restaurant Name */}

            <div>

              <label className="block text-[10px] font-bold text-[#C8A96B]/80 uppercase tracking-wider mb-1">
                Restaurant Name *
              </label>

              <div className="relative">

                <input
                  type="text"
                  placeholder="Bowl & Brick"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value
                    })
                  }
                  className="w-full bg-[#100C09] border border-[#C8A96B]/20 rounded-xl pl-9 pr-3 py-2.5 text-xs font-black text-[#F7F4ED] placeholder-[#EEEEEE]/25 focus:outline-none focus:border-[#C8A96B] focus:ring-2 focus:ring-[#C8A96B]/10 transition"
                  required
                />

                <Utensils
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C8A96B]"
                />

              </div>

            </div>

            {/* Address */}

            <div>

              <label className="block text-[10px] font-bold text-[#C8A96B]/80 uppercase tracking-wider mb-1">
                Full Address *
              </label>

              <div className="relative">

                <input
                  type="text"
                  placeholder="123 Food Street, Downtown"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: e.target.value
                    })
                  }
                  className="w-full bg-[#100C09] border border-[#C8A96B]/20 rounded-xl pl-9 pr-3 py-2.5 text-xs font-black text-[#F7F4ED] placeholder-[#EEEEEE]/25 focus:outline-none focus:border-[#C8A96B] focus:ring-2 focus:ring-[#C8A96B]/10 transition"
                  required
                />

                <MapPin
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C8A96B]"
                />

              </div>

            </div>

            {/* Opening Hours + Contact */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">

              {/* Opening Hours */}

              <div>

                <label className="block text-[10px] font-bold text-[#C8A96B]/80 uppercase tracking-wider mb-1">
                  Opening Hours
                </label>

                <div className="relative">

                  <input
                    type="text"
                    placeholder="11:00 AM - 11:00 PM"
                    value={formData.openingHours}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        openingHours: e.target.value
                      })
                    }
                    className="w-full bg-[#100C09] border border-[#C8A96B]/20 rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold text-[#F7F4ED] placeholder-[#EEEEEE]/25 focus:outline-none focus:border-[#C8A96B] focus:ring-2 focus:ring-[#C8A96B]/10 transition"
                  />

                  <Clock
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C8A96B]"
                  />

                </div>

              </div>

              {/* Contact Number */}

              <div>

                <label className="block text-[10px] font-bold text-[#C8A96B]/80 uppercase tracking-wider mb-1">
                  Contact Number
                </label>

                <div className="relative">

                  <input
                    type="text"
                    placeholder="+91 9876543210"
                    value={formData.contactNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contactNumber: e.target.value
                      })
                    }
                    className="w-full bg-[#100C09] border border-[#C8A96B]/20 rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold text-[#F7F4ED] placeholder-[#EEEEEE]/25 focus:outline-none focus:border-[#C8A96B] focus:ring-2 focus:ring-[#C8A96B]/10 transition"
                  />

                  <Phone
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C8A96B]"
                  />

                </div>

              </div>

            </div>

            {/* Save Button */}

            <div className="pt-3 border-t border-[#C8A96B]/15">

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#C8A96B] hover:bg-[#D8BB7C] text-[#100C09] py-3 text-xs font-black flex items-center justify-center gap-1.5 rounded-xl shadow-sm active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >

                <Save size={16} />

                <span>
                  {submitting
                    ? 'Updating Settings...'
                    : 'Save Profile Changes'}
                </span>

              </button>

            </div>

          </form>

        )}

      </main>

    </div>
  );
};

export default AdminSettingsPage;