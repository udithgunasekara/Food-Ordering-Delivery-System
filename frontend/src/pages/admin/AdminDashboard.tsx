import React, { useState } from 'react';
import { 
  Users, 
  Store, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  User as UserIcon,
  Settings 
} from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import StatCard from '../../components/admin/StatCard';
import UserList from '../../components/admin/UserList';
import { users, adminStats } from '../../data/mockData';

const AdminDashboard: React.FC = () => {
  const [userRoleFilter, setUserRoleFilter] = useState('all');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            
            <div className="mt-4 md:mt-0">
              <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                <Settings className="w-5 h-5 mr-1" />
                System Settings
              </button>
            </div>
          </div>
          
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <StatCard 
              title="Total Users"
              value={adminStats.totalUsers}
              icon={<Users className="w-6 h-6 text-blue-600" />}
              change="12%"
              isPositive={true}
            />
            <StatCard 
              title="Total Restaurants"
              value={adminStats.totalRestaurants}
              icon={<Store className="w-6 h-6 text-blue-600" />}
              change="8%"
              isPositive={true}
            />
            <StatCard 
              title="Monthly Revenue"
              value={`$${adminStats.monthlyRevenue.toFixed(2)}`}
              icon={<DollarSign className="w-6 h-6 text-blue-600" />}
              change="15%"
              isPositive={true}
            />
            <StatCard 
              title="Active Orders"
              value={adminStats.activeOrders}
              icon={<ShoppingBag className="w-6 h-6 text-blue-600" />}
              change="5%"
              isPositive={false}
            />
          </div>
          
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Revenue Overview</h2>
            
            <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Revenue chart would appear here</p>
            </div>
          </div>
          
          {/* User Management */}
          <UserList 
            users={users}
            roleFilter={userRoleFilter}
            onChangeRoleFilter={setUserRoleFilter}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;