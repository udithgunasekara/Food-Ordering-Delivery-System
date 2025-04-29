import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BarChart2, Users, FileCheck, Menu, X, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const navItems = [
    { 
      path: '/admin/dashboard', 
      name: 'Dashboard', 
      icon: <BarChart2 size={20} /> 
    },
    { 
      path: '/admin/users', 
      name: 'User Management', 
      icon: <Users size={20} /> 
    },
    { 
      path: '/admin/restaurant-requests', 
      name: 'Restaurant Requests', 
      icon: <FileCheck size={20} /> 
    }
  ];
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-20">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-primary text-white"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-10 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          {/* Admin logo */}
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold text-primary">Admin Dashboard</h1>
          </div>
          
          {/* Nav items */}
          <nav className="flex-1 py-4 overflow-y-auto">
            <ul className="space-y-2 px-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 text-gray-700 rounded-md ${isActive(item.path) ? 'bg-primary bg-opacity-10 text-primary' : 'hover:bg-gray-100'}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Bottom actions */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
            >
              <LogOut size={20} className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="lg:ml-64 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;