import React, { useState } from 'react';

import { useDispatch } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import { adminLogin, adminRegister } from '../../services/authService';

import { setAdminCredentials } from '../../redux/slices/adminSlice';

import {
  ShieldCheck,
  Mail,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const AdminLoginPage = () => {

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [name, setName] = useState('');

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const [successMsg, setSuccessMsg] = useState(null);

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError(null);

    setSuccessMsg(null);

    setLoading(true);

    try {

      if (isRegisterMode) {

        if (!name.trim()) throw new Error('Please enter your full name');

        const res = await adminRegister({
          name: name.trim(),
          email: email.trim(),
          password
        });

        setSuccessMsg(
          res.message || 'Admin registered successfully! You can now log in.'
        );

        setIsRegisterMode(false);

      } else {

        const res = await adminLogin({
          email: email.trim(),
          password
        });

        if (res.token) {

          dispatch(
            setAdminCredentials({
              token: res.token,
              admin: res.admin
            })
          );

          navigate('/admin/orders');

        } else {

          throw new Error('No token returned from server');

        }

      }

    } catch (err) {

      console.error(err);

      setError(
        typeof err === 'string'
          ? err
          : err.message || 'Authentication failed'
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-[#100C09] text-[#F7F4ED] flex items-center justify-center p-4">

      <div className="w-full max-w-md bg-[#15110E] text-[#F7F4ED] border border-[#C8A96B]/25 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">

        {/* subtle top accent */}

        <div className="absolute top-0 left-0 right-0 h-1 bg-[#C8A96B]" />

        {/* Header Branding */}

        <div className="text-center space-y-1.5 mb-6">

          <div className="w-12 h-12 rounded-xl bg-[#C8A96B] flex items-center justify-center mx-auto text-[#100C09] shadow-sm mb-2.5">

            <ShieldCheck size={28} />

          </div>

          <h1 className="text-xl font-black tracking-tight text-[#F7F4ED]">
            Bowl & Brick Admin
          </h1>

          <p className="text-xs font-medium text-[#EEEEEE]/50">

            {isRegisterMode
              ? 'Create initial admin account'
              : 'Sign in to access staff portal & kitchen queue'}

          </p>

        </div>

        {/* Status Alerts */}

        {error && (

          <div className="mb-4 p-3 bg-red-400/10 border border-red-400/20 text-red-300 text-xs font-bold rounded-xl flex items-center gap-2">

            <AlertCircle
              size={16}
              className="shrink-0 text-red-400"
            />

            <span>{error}</span>

          </div>

        )}

        {successMsg && (

          <div className="mb-4 p-3 bg-[#8FA28A]/10 border border-[#8FA28A]/25 text-[#C7D3C0] text-xs font-black rounded-xl flex items-center gap-2">

            <CheckCircle
              size={16}
              className="shrink-0 text-[#8FA28A]"
            />

            <span>{successMsg}</span>

          </div>

        )}

        {/* Tab Toggle */}

        <div className="flex bg-[#100C09] p-1 rounded-xl border border-[#C8A96B]/20 mb-5">

          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(false);
              setError(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-1.5 text-xs font-black rounded-lg transition ${
              !isRegisterMode
                ? 'bg-[#C8A96B] text-[#100C09] shadow-sm'
                : 'text-[#EEEEEE]/55 hover:text-[#F7F4ED] hover:bg-[#C8A96B]/10'
            }`}
          >
            Admin Login
          </button>

          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(true);
              setError(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-1.5 text-xs font-black rounded-lg transition ${
              isRegisterMode
                ? 'bg-[#C8A96B] text-[#100C09] shadow-sm'
                : 'text-[#EEEEEE]/55 hover:text-[#F7F4ED] hover:bg-[#C8A96B]/10'
            }`}
          >
            Register Account
          </button>

        </div>

        {/* Form */}

        <form onSubmit={handleSubmit} className="space-y-3.5">

          {isRegisterMode && (

            <div>

              <label className="block text-[10px] font-bold text-[#C8A96B]/80 uppercase tracking-wider mb-1">
                Full Name
              </label>

              <div className="relative">

                <input
                  type="text"
                  placeholder="Manager Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-3 bg-[#100C09] border border-[#C8A96B]/20 rounded-xl text-xs font-semibold text-[#F7F4ED] placeholder-[#EEEEEE]/25 focus:outline-none focus:border-[#C8A96B] focus:ring-2 focus:ring-[#C8A96B]/10 transition"
                  required
                />

                <User
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C8A96B]"
                />

              </div>

            </div>

          )}

          <div>

            <label className="block text-[10px] font-bold text-[#C8A96B]/80 uppercase tracking-wider mb-1">
              Email Address
            </label>

            <div className="relative">

              <input
                type="email"
                placeholder="admin@bowlandbrick.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-3 bg-[#100C09] border border-[#C8A96B]/20 rounded-xl text-xs font-semibold text-[#F7F4ED] placeholder-[#EEEEEE]/25 focus:outline-none focus:border-[#C8A96B] focus:ring-2 focus:ring-[#C8A96B]/10 transition"
                required
              />

              <Mail
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C8A96B]"
              />

            </div>

          </div>

          <div>

            <label className="block text-[10px] font-bold text-[#C8A96B]/80 uppercase tracking-wider mb-1">
              Password
            </label>

            <div className="relative">

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-3 bg-[#100C09] border border-[#C8A96B]/20 rounded-xl text-xs font-semibold text-[#F7F4ED] placeholder-[#EEEEEE]/25 focus:outline-none focus:border-[#C8A96B] focus:ring-2 focus:ring-[#C8A96B]/10 transition"
                required
              />

              <Lock
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C8A96B]"
              />

            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 bg-[#C8A96B] text-[#100C09] border border-[#C8A96B] hover:bg-[#D8BB7C] shadow-sm active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >

            {loading ? (

              <span>Authenticating...</span>

            ) : (

              <>

                <span>
                  {isRegisterMode
                    ? 'Create Admin Account'
                    : 'Sign In to Portal'}
                </span>

                <ArrowRight size={15} />

              </>

            )}

          </button>

        </form>

        <div className="mt-5 text-center">

          <button
            onClick={() => navigate('/')}
            className="text-xs text-[#EEEEEE]/45 hover:text-[#C8A96B] font-bold underline transition"
          >
            Switch to Customer View
          </button>

        </div>

      </div>

    </div>

  );

};

export default AdminLoginPage;