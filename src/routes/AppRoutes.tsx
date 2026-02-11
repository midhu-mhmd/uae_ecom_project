import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// User components
import Home from '../features/user/home'; 
import Register from '../features/user/register';
import Login from '../features/user/login';

// Admin components
import Dashboard from '../features/admin/dashboard'; 
import AdminLayout from '../components/layout/AdminLayout';
import OrderManagement from '../features/admin/orders';
import CartManagement from '../features/admin/cart';
import CustomerManagement from '../features/admin/customers';
import ReviewsManagement from '../features/admin/reviews';
import PaymentManagement from '../features/admin/payments';
import SettingsPage from '../features/admin/settings';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* --- USER ROUTES --- */}
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* --- ADMIN ROUTES (Nested) --- */}
      {/* AdminLayout is the "Parent". It contains the Sidebar and Header */}
      <Route path="/admin" element={<AdminLayout />}>
        
        {/* Redirect /admin to /admin/dashboard automatically */}
        <Route index element={<Navigate to="dashboard" replace />} />
        
        {/* These children will render inside the <Outlet /> of AdminLayout */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="cart" element={<CartManagement />} />
        <Route path="customers" element={<CustomerManagement />} />
        <Route path="reviews" element={<ReviewsManagement />} />
        <Route path="payments" element={<PaymentManagement />} />
        <Route path="settings" element={<SettingsPage />} />
        
        {/* You can add your other pages here later like this: */}
        {/* <Route path="orders" element={<OrdersPage />} /> */}
        {/* <Route path="products" element={<ProductsPage />} /> */}
      </Route>

      {/* Fallback for 404 - Redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};