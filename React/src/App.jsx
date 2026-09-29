import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/customer/Home';
import MenuPage from './pages/customer/MenuPage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrderTrackingPage from './pages/customer/OrderTrackingPage';
import RestaurantInfoPage from './pages/customer/RestaurantInfoPage';
import TableNumberModal from './components/customer/TableNumberModal';
import BottomNavigation from './components/customer/BottomNavigation';
import AIChatbotWidget from './components/customer/AIChatbotWidget';

// Admin Imports
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminMenuPage from './pages/admin/AdminMenuPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 font-sans antialiased text-gray-900 dark:text-gray-100">
      {/* Customer Table Modal only on Customer routes */}
      {!isAdminRoute && <TableNumberModal />}

      {/* Customer AI Chatbot Assistant on all customer pages */}
      {!isAdminRoute && <AIChatbotWidget />}

      {/* Page Routing */}
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order/status" element={<OrderTrackingPage />} />
        <Route path="/order/:id" element={<OrderTrackingPage />} />
        <Route path="/info" element={<RestaurantInfoPage />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<Navigate to="/admin/orders" replace />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/menu" element={<AdminMenuPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
        </Route>
      </Routes>

      {/* Mobile Customer Bottom Navigation only on Customer routes */}
      {!isAdminRoute && <BottomNavigation />}
    </div>
  );
}

export default App;
