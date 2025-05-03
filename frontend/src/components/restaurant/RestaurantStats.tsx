import React from 'react';
import { CreditCard, TrendingUp, ShoppingBag } from 'lucide-react';
import { restaurantStats } from '../../data/mockData';

const RestaurantStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white rounded-lg shadow-md p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-500 text-sm">Today's Orders</p>
            <h3 className="text-2xl font-bold mt-1">{restaurantStats.dailyOrders}</h3>
            <p className="text-sm text-green-500 mt-1">
              +{Math.round((restaurantStats.dailyOrders / restaurantStats.weeklyOrders) * 100)}% from last week
            </p>
          </div>
          <div className="p-3 bg-blue-100 rounded-lg">
            <ShoppingBag className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-500 text-sm">Today's Revenue</p>
            <h3 className="text-2xl font-bold mt-1">${restaurantStats.dailyRevenue.toFixed(2)}</h3>
            <p className="text-sm text-green-500 mt-1">
              +{Math.round((restaurantStats.dailyRevenue / restaurantStats.weeklyRevenue) * 100)}% from last week
            </p>
          </div>
          <div className="p-3 bg-green-100 rounded-lg">
            <CreditCard className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-500 text-sm">Monthly Revenue</p>
            <h3 className="text-2xl font-bold mt-1">${restaurantStats.monthlyRevenue.toFixed(2)}</h3>
            <p className="text-sm text-green-500 mt-1">
              +12% from last month
            </p>
          </div>
          <div className="p-3 bg-purple-100 rounded-lg">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantStats;