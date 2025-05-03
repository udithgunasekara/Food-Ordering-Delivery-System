import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from './config/stripe';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Customer Pages
import HomePage from './pages/customer/HomePage';
import RestaurantPage from './pages/customer/RestaurantPage';
import CartPage from './pages/customer/CartPage';
import OrdersPage from './pages/customer/OrdersPage';

// Restaurant Pages
import RestaurantDashboard from './pages/restaurant/RestaurantDashboard';

// Delivery Pages
import DeliveryDashboard from './pages/delivery/DeliveryDashboard';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';

// Protected Route Component
const ProtectedRoute = ({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode,
  allowedRoles?: string[] 
}) => {
  const { isAuthenticated, role } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(role as string)) {
    // Redirect to appropriate dashboard based on role
    if (role === 'restaurant') {
      return <Navigate to="/restaurant/dashboard" />;
    } else if (role === 'delivery') {
      return <Navigate to="/delivery/dashboard" />;
    } else if (role === 'admin') {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/" />;
    }
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Elements stripe={stripePromise}>
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Customer Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/restaurant/:id" element={<RestaurantPage />} />
              <Route path="/cart" element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CartPage />
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <OrdersPage />
                </ProtectedRoute>
              } />
              
              {/* Restaurant Routes */}
              <Route path="/restaurant/dashboard" element={
                <ProtectedRoute allowedRoles={['restaurant']}>
                  <RestaurantDashboard />
                </ProtectedRoute>
              } />
              
              {/* Delivery Routes */}
              <Route path="/delivery/dashboard" element={
                <ProtectedRoute allowedRoles={['delivery']}>
                  <DeliveryDashboard />
                </ProtectedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Elements>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;