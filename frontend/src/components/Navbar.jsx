import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { Home, LogOut, ShoppingBag, User, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartItemCount = getItemCount();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-10">
      <div className="container-custom mx-auto flex justify-between items-center py-4">
        {/* Logo and brand */}
        <Link to="/" className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
            <Home size={20} />
          </div>
          <span className="ml-2 text-xl font-bold text-primary">TastyEats</span>
        </Link>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button 
            onClick={toggleMenu}
            className="text-gray-600 hover:text-primary focus:outline-none"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-600 hover:text-primary">Home</Link>
          <Link to="/restaurants" className="text-gray-600 hover:text-primary">Restaurants</Link>
          
          {isAuthenticated ? (
            <>
              {user.role === 'ROLE_RESTAURANT_ADMIN' && (
                <Link to="/restaurant/dashboard" className="text-gray-600 hover:text-primary">Restaurant Dashboard</Link>
              )}
              
              {user.role === 'ROLE_SYSADMIN' && (
                <Link to="/admin/dashboard" className="text-gray-600 hover:text-primary">Admin Dashboard</Link>
              )}
              
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="text-gray-600 hover:text-primary">
                  <User size={20} />
                </Link>
                
                {user.role === 'ROLE_CUSTOMER' && (
                  <Link to="/order" className="text-gray-600 hover:text-primary relative">
                    <ShoppingBag size={20} />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                )}
                
                <button onClick={handleLogout} className="text-gray-600 hover:text-primary">
                  <LogOut size={20} />
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary">Login / Register</Link>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4 shadow-inner fade-in">
          <div className="container-custom flex flex-col space-y-4">
            <Link to="/" className="text-gray-600 hover:text-primary py-2" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/restaurants" className="text-gray-600 hover:text-primary py-2" onClick={() => setIsMenuOpen(false)}>Restaurants</Link>
            
            {isAuthenticated ? (
              <>
                {user.role === 'ROLE_RESTAURANT_ADMIN' && (
                  <Link to="/restaurant/dashboard" className="text-gray-600 hover:text-primary py-2" onClick={() => setIsMenuOpen(false)}>Restaurant Dashboard</Link>
                )}
                
                {user.role === 'ROLE_SYSADMIN' && (
                  <Link to="/admin/dashboard" className="text-gray-600 hover:text-primary py-2" onClick={() => setIsMenuOpen(false)}>Admin Dashboard</Link>
                )}
                
                <Link to="/profile" className="text-gray-600 hover:text-primary py-2" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                
                {user.role === 'ROLE_CUSTOMER' && (
                  <Link to="/order" className="text-gray-600 hover:text-primary py-2 flex items-center" onClick={() => setIsMenuOpen(false)}>
                    Cart
                    {cartItemCount > 0 && (
                      <span className="ml-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                )}
                
                <button onClick={handleLogout} className="text-gray-600 hover:text-primary py-2 text-left">Logout</button>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary mt-2 w-full text-center" onClick={() => setIsMenuOpen(false)}>Login / Register</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;