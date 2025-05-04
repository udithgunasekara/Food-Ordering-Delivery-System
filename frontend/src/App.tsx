import React, { useEffect } from 'react';
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
import ProfilePage from './pages/profile/ProfilePage';

// Restaurant Pages
import RestaurantDashboard from './pages/restaurant/RestaurantDashboard';

// Delivery Pages
import DeliveryDashboard from './pages/delivery/DeliveryDashboard';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import RestaurantRequests from './pages/admin/RestaurantRequests';
import UserManagement from './pages/admin/UserManagement';
import AdminLayout from './pages/admin/AdminLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import RestaurantRegisterPage from './pages/auth/RestaurantRegisterPage';
import RestaurantMenuPage from './pages/customer/RestaurantMenuPage';

// Protected Route Component
const ProtectedRoute = ({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode,
  allowedRoles?: string[] 
}) => {
  const { isAuthenticated, role } = useAuth();

  useEffect(() => {
    console.log("ProtectedRoute check - Auth:", isAuthenticated, "Role:", role, "Allowed:", allowedRoles);
  },[isAuthenticated,role,allowedRoles]);
  
  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // Redirect to appropriate dashboard based on role
    console.log(`Role ${role} not allowed, redirecting`);
    
    if (role === 'ROLE_RESTAURANT_ADMIN') return <Navigate to="/restaurant/dashboard" />;
    if (role === 'ROLE_DELIVERY_AGENT') return <Navigate to="/delivery/dashboard" />;
    if (role === 'ROLE_SYSADMIN') return <Navigate to="/admin/dashboard" />;
    return <Navigate to="/" />;
  }

  console.log("Access granted to protected route");  
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
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/restaurant/register" element={<RestaurantRegisterPage />} />
              
              {/* Customer Routes */}
              <Route path="/" element={<HomePage />} />
            {/* //  <Route path="/restaurant/:id" element={<RestaurantPage />} /> */}
              <Route path="/cart" element={
                <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
                  <CartPage />
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
                  <OrdersPage />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute allowedRoles={['ROLE_CUSTOMER', 'ROLE_RESTAURANT_ADMIN', 'ROLE_DELIVERY_AGENT', 'ROLE_SYSADMIN']}>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              
              {/* Restaurant Routes */}
              <Route path="/restaurant/dashboard" element={
                <ProtectedRoute allowedRoles={['ROLE_RESTAURANT_ADMIN']}>
                  <RestaurantDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/restaurant/:id" element={<RestaurantMenuPage />} />



              {/* Delivery Routes */}
              <Route path="/delivery/dashboard" element={
                <ProtectedRoute allowedRoles={['ROLE_DELIVERY_AGENT']} >
                  <DeliveryDashboard />
                </ProtectedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['ROLE_SYSADMIN']}>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="restaurant-requests" element={<RestaurantRequests />} />
                <Route path="user-management" element={<UserManagement />} />
              </Route>
              
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