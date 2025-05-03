import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Header: React.FC = () => {
  const { isAuthenticated, logout, role } = useAuth();
  const { cartItems } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getDashboardLink = () => {
    switch (role) {
      case 'restaurant':
        return '/restaurant/dashboard';
      case 'delivery':
        return '/delivery/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link 
          to={getDashboardLink()} 
          className="text-2xl font-bold text-orange-500 flex items-center"
        >
          <ShoppingBag className="mr-2" />
          FoodExpress
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {isAuthenticated ? (
            <>
              {role === 'customer' && (
                <>
                  <Link 
                    to="/"
                    className={`text-gray-700 hover:text-orange-500 transition-colors ${
                      location.pathname === '/' ? 'font-semibold text-orange-500' : ''
                    }`}
                  >
                    Restaurants
                  </Link>
                  <Link 
                    to="/orders"
                    className={`text-gray-700 hover:text-orange-500 transition-colors ${
                      location.pathname === '/orders' ? 'font-semibold text-orange-500' : ''
                    }`}
                  >
                    My Orders
                  </Link>
                </>
              )}
              
              <div className="flex items-center space-x-4">
                {role === 'customer' && (
                  <Link to="/cart" className="relative">
                    <ShoppingBag className="w-6 h-6 text-gray-700 hover:text-orange-500 transition-colors" />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItems.reduce((total, item) => total + item.quantity, 0)}
                      </span>
                    )}
                  </Link>
                )}
                <Link to="/profile" className="text-gray-700 hover:text-orange-500 transition-colors">
                  <User className="w-6 h-6" />
                </Link>
                <button 
                  onClick={logout}
                  className="text-gray-700 hover:text-orange-500 transition-colors"
                >
                  <LogOut className="w-6 h-6" />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link 
                to="/login"
                className="px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600 transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/signup"
                className="px-4 py-2 rounded-md border border-orange-500 text-orange-500 hover:bg-orange-50 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            {isAuthenticated ? (
              <>
                {role === 'customer' && (
                  <>
                    <Link 
                      to="/"
                      className={`text-gray-700 hover:text-orange-500 transition-colors ${
                        location.pathname === '/' ? 'font-semibold text-orange-500' : ''
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Restaurants
                    </Link>
                    <Link 
                      to="/orders"
                      className={`text-gray-700 hover:text-orange-500 transition-colors ${
                        location.pathname === '/orders' ? 'font-semibold text-orange-500' : ''
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <Link 
                      to="/cart"
                      className={`text-gray-700 hover:text-orange-500 transition-colors ${
                        location.pathname === '/cart' ? 'font-semibold text-orange-500' : ''
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Cart ({cartItems.reduce((total, item) => total + item.quantity, 0)})
                    </Link>
                  </>
                )}
                <Link 
                  to="/profile"
                  className={`text-gray-700 hover:text-orange-500 transition-colors ${
                    location.pathname === '/profile' ? 'font-semibold text-orange-500' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button 
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="text-left text-gray-700 hover:text-orange-500 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="text-gray-700 hover:text-orange-500 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/signup"
                  className="text-gray-700 hover:text-orange-500 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;