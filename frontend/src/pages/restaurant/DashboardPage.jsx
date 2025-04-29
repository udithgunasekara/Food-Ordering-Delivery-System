import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { mockRestaurants } from '../../data/restaurants';
import { mockOrders } from '../../data/orders';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp, Users, DollarSign, ShoppingBag, CheckCircle, ClipboardList, AlertCircle, DollarSign as DollarSignIcon } from 'lucide-react';

// Register ChartJS components
Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

const DashboardPage = () => {
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    averageOrder: 0,
    pendingOrders: 0
  });
  
  // Load restaurant data
  useEffect(() => {
    // Find restaurant owned by current user
    const foundRestaurant = mockRestaurants.find(r => r.ownerId === user.id);
    
    if (foundRestaurant) {
      setRestaurant(foundRestaurant);
      
      // Get orders for this restaurant
      const restaurantOrders = mockOrders.filter(o => o.restaurantId === foundRestaurant.id);
      setOrders(restaurantOrders);
      
      // Calculate stats
      const totalSales = restaurantOrders.reduce((sum, order) => sum + order.subtotal, 0);
      const pendingOrders = restaurantOrders.filter(o => o.status === 'in_progress').length;
      
      setStats({
        totalSales,
        totalOrders: restaurantOrders.length,
        averageOrder: restaurantOrders.length > 0 ? totalSales / restaurantOrders.length : 0,
        pendingOrders
      });
    }
  }, [user.id]);
  
  // Generate sales data for the past 7 days
  const generateSalesData = () => {
    const salesData = [];
    const labels = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const dateStr = date.toISOString().split('T')[0];
      labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
      
      // Filter orders for this date
      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.placedAt).toISOString().split('T')[0];
        return orderDate === dateStr;
      });
      
      // Calculate total sales for this day
      const daySales = dayOrders.reduce((sum, order) => sum + order.subtotal, 0);
      salesData.push(daySales);
    }
    
    return { labels, data: salesData };
  };
  
  const { labels, data } = generateSalesData();
  
  // Chart data
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Sales ($)',
        data,
        fill: false,
        backgroundColor: 'rgb(var(--color-primary))',
        borderColor: 'rgb(var(--color-primary))',
        tension: 0.1
      }
    ]
  };
  
  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Sales: $${context.parsed.y.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value;
          }
        }
      }
    }
  };
  
  if (!restaurant) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">No Restaurant Found</h2>
        <p className="text-gray-600 mb-6">You don't have a restaurant associated with your account.</p>
        <a href="/restaurant/register" className="btn btn-primary">
          Register a Restaurant
        </a>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Restaurant Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome back to {restaurant.name}</p>
      
      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total sales */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start">
            <div className="bg-primary bg-opacity-10 p-3 rounded-full">
              <DollarSignIcon size={24} className="text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Sales</p>
              <h3 className="text-2xl font-bold">${stats.totalSales.toFixed(2)}</h3>
            </div>
          </div>
        </div>
        
        {/* Total orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start">
            <div className="bg-secondary bg-opacity-10 p-3 rounded-full">
              <ShoppingBag size={24} className="text-secondary" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Orders</p>
              <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
            </div>
          </div>
        </div>
        
        {/* Average order */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start">
            <div className="bg-blue-100 p-3 rounded-full">
              <TrendingUp size={24} className="text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Average Order</p>
              <h3 className="text-2xl font-bold">${stats.averageOrder.toFixed(2)}</h3>
            </div>
          </div>
        </div>
        
        {/* Pending orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start">
            <div className="bg-yellow-100 p-3 rounded-full">
              <ClipboardList size={24} className="text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Pending Orders</p>
              <h3 className="text-2xl font-bold">{stats.pendingOrders}</h3>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts and tables section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales chart */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Sales Overview (Last 7 Days)</h2>
            <div className="h-80">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
        
        {/* Restaurant status */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Status</h2>
              <div>
                <label className="inline-flex items-center cursor-pointer">
                  <span className="mr-3 text-sm font-medium text-gray-900">Closed</span>
                  <div className="relative">
                    <input type="checkbox" value="" className="sr-only peer" defaultChecked={restaurant.isOpen} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary peer-focus:ring-opacity-20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-900">Open</span>
                </label>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Business Hours</span>
                <a href="#" className="text-primary hover:underline text-sm">Edit</a>
              </div>
              
              <div className="space-y-2 text-sm">
                {Object.entries(restaurant.hours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between">
                    <span className="capitalize">{day}</span>
                    <span>{hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Restaurant details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Restaurant Details</h2>
              <a href="#" className="text-primary hover:underline text-sm">Edit</a>
            </div>
            
            <div className="space-y-4">
              <div>
                <span className="text-gray-600 block">Name</span>
                <span>{restaurant.name}</span>
              </div>
              
              <div>
                <span className="text-gray-600 block">Address</span>
                <span>{restaurant.address.street}, {restaurant.address.city}, {restaurant.address.state} {restaurant.address.zipCode}</span>
              </div>
              
              <div>
                <span className="text-gray-600 block">Phone</span>
                <span>{restaurant.phone}</span>
              </div>
              
              <div>
                <span className="text-gray-600 block">Cuisine</span>
                <span>{restaurant.cuisine}</span>
              </div>
              
              <div>
                <span className="text-gray-600 block">Delivery Fee</span>
                <span>${restaurant.deliveryFee.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent orders */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.placedAt).toLocaleDateString()} {new Date(order.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.userId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${order.subtotal.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'delivered' 
                          ? 'bg-green-100 text-green-800' 
                          : order.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status.replace('_', ' ').charAt(0).toUpperCase() + order.status.replace('_', ' ').slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <a href="#" className="text-primary hover:underline">View</a>
                    </td>
                  </tr>
                ))}
                
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                      No orders yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {orders.length > 5 && (
            <div className="bg-gray-50 px-6 py-3 flex justify-center">
              <a href="#" className="text-primary hover:underline text-sm">View All Orders</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;