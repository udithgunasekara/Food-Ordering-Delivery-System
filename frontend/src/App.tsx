import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import RestaurantLayout from './layouts/RestaurantLayout';

// Public Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RestaurantsPage from './pages/RestaurantsPage';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentPage from './pages/PaymentPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import ProfilePage from './pages/ProfilePage';

// Restaurant Owner Pages
import RestaurantDashboardPage from './pages/restaurant/DashboardPage';
import RestaurantMenuPage from './pages/restaurant/MenuPage';
import RestaurantAvailabilityPage from './pages/restaurant/AvailabilityPage';
import RestaurantRegistrationPage from './pages/restaurant/RegistrationPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/DashboardPage';
import AdminUsersPage from './pages/admin/UsersPage';
import AdminRestaurantRequestsPage from './pages/admin/RestaurantRequestsPage';

// Route Guard Components
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="restaurants" element={<RestaurantsPage />} />
        <Route path="restaurants/:id" element={<RestaurantDetailPage />} />
        
        {/* Protected Customer Routes */}
        <Route path="order" element={
          <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
            <CheckoutPage />
          </ProtectedRoute>
        } />
        <Route path="payment" element={
          <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
            <PaymentPage />
          </ProtectedRoute>
        } />
        <Route path="track/:orderId" element={
          <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
            <OrderTrackingPage />
          </ProtectedRoute>
        } />
        <Route path="profile" element={
          <ProtectedRoute allowedRoles={['ROLE_CUSTOMER', 'ROLE_RESTAURANT_ADMIN', 'ROLE_SYSADMIN']}>
            <ProfilePage />
          </ProtectedRoute>
        } />
      </Route>
      
      {/* Restaurant Owner Routes */}
      <Route path="/restaurant" element={
        <ProtectedRoute allowedRoles={['ROLE_RESTAURANT_ADMIN']}>
          <RestaurantLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<RestaurantDashboardPage />} />
        <Route path="menu" element={<RestaurantMenuPage />} />
        <Route path="availability" element={<RestaurantAvailabilityPage />} />
      </Route>
      
      <Route path="/restaurant/register" element={<RestaurantRegistrationPage />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['ROLE_SYSADMIN']}>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="restaurant-requests" element={<AdminRestaurantRequestsPage />} />
      </Route>
      
      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;