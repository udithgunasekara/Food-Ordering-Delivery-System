import React, { useState } from 'react';
import { Chart, LineController, LineElement, PointElement, BarController, BarElement, ArcElement, PieController, DoughnutController, LinearScale, CategoryScale, RadialLinearScale, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { TrendingUp, Users, DollarSign, ShoppingBag, ArrowUp, ArrowDown, Store, UserPlus, Calendar } from 'lucide-react';
import { mockPlatformMetrics, mockDailySales, mockUserAcquisition, mockOrderStatusDistribution, mockCuisinePopularity, mockRestaurantPerformance } from '../../data/analytics';

// Register ChartJS components
Chart.register(
  LineController, LineElement, PointElement, 
  BarController, BarElement, 
  ArcElement, PieController, DoughnutController,
  LinearScale, CategoryScale, RadialLinearScale, 
  Title, Tooltip, Legend
);

const DashboardPage = () => {
  const [dateRange, setDateRange] = useState('30d');
  
  // Prepare daily sales data
  const salesChartData = {
    labels: mockDailySales.map(day => day.date),
    datasets: [
      {
        label: 'Sales ($)',
        data: mockDailySales.map(day => day.sales),
        fill: false,
        backgroundColor: 'rgba(var(--color-primary), 1)',
        borderColor: 'rgba(var(--color-primary), 1)',
        tension: 0.4
      },
      {
        label: 'Orders',
        data: mockDailySales.map(day => day.orders * 20), // Scale for visualization
        fill: false,
        backgroundColor: 'rgba(var(--color-secondary), 1)',
        borderColor: 'rgba(var(--color-secondary), 1)',
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  };
  
  const salesChartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Sales ($)'
        },
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Orders'
        },
        // Grid lines to match the left axis
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function(value) {
            return (value / 20).toFixed(0); // Convert back for display
          }
        }
      },
    }
  };
  
  // Prepare user acquisition data
  const userChartData = {
    labels: mockUserAcquisition.map(month => month.month),
    datasets: [
      {
        label: 'New Users',
        data: mockUserAcquisition.map(month => month.newUsers),
        backgroundColor: 'rgba(var(--color-primary), 0.8)',
        borderColor: 'rgba(var(--color-primary), 1)',
        borderWidth: 1
      },
      {
        label: 'Active Users',
        data: mockUserAcquisition.map(month => month.activeUsers),
        backgroundColor: 'rgba(var(--color-secondary), 0.8)',
        borderColor: 'rgba(var(--color-secondary), 1)',
        borderWidth: 1
      }
    ]
  };
  
  const userChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
  
  // Prepare order status distribution data
  const orderStatusChartData = {
    labels: mockOrderStatusDistribution.map(status => status.status),
    datasets: [
      {
        data: mockOrderStatusDistribution.map(status => status.percentage),
        backgroundColor: [
          'rgba(var(--color-success), 0.8)',
          'rgba(var(--color-error), 0.8)',
          'rgba(var(--color-warning), 0.8)'
        ],
        borderColor: [
          'rgba(var(--color-success), 1)',
          'rgba(var(--color-error), 1)',
          'rgba(var(--color-warning), 1)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  const orderStatusChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      }
    }
  };
  
  // Prepare cuisine popularity data
  const cuisineChartData = {
    labels: mockCuisinePopularity.map(cuisine => cuisine.cuisine),
    datasets: [
      {
        data: mockCuisinePopularity.map(cuisine => cuisine.percentage),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  const cuisineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      }
    }
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-gray-600 mb-8">Platform overview and analytics</p>
      
      {/* Date range selector */}
      <div className="flex justify-end mb-6">
        <div className="bg-white rounded-lg shadow-sm border inline-flex">
          <button 
            className={`px-4 py-2 text-sm ${dateRange === '7d' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            onClick={() => setDateRange('7d')}
          >
            7D
          </button>
          <button 
            className={`px-4 py-2 text-sm ${dateRange === '30d' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            onClick={() => setDateRange('30d')}
          >
            30D
          </button>
          <button 
            className={`px-4 py-2 text-sm ${dateRange === '90d' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            onClick={() => setDateRange('90d')}
          >
            90D
          </button>
          <button 
            className={`px-4 py-2 text-sm ${dateRange === '1y' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            onClick={() => setDateRange('1y')}
          >
            1Y
          </button>
        </div>
      </div>
      
      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total revenue */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <h3 className="text-2xl font-bold">${mockPlatformMetrics.totalRevenue.toLocaleString()}</h3>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <ArrowUp size={14} className="mr-1" />
                <span>8.2% from last month</span>
              </div>
            </div>
            <div className="bg-primary bg-opacity-10 p-3 rounded-full">
              <DollarSign size={24} className="text-primary" />
            </div>
          </div>
        </div>
        
        {/* Total orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Orders</p>
              <h3 className="text-2xl font-bold">{mockPlatformMetrics.totalOrders.toLocaleString()}</h3>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <ArrowUp size={14} className="mr-1" />
                <span>12.3% from last month</span>
              </div>
            </div>
            <div className="bg-secondary bg-opacity-10 p-3 rounded-full">
              <ShoppingBag size={24} className="text-secondary" />
            </div>
          </div>
        </div>
        
        {/* Total users */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Users</p>
              <h3 className="text-2xl font-bold">{mockPlatformMetrics.totalUsers.toLocaleString()}</h3>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <ArrowUp size={14} className="mr-1" />
                <span>5.7% from last month</span>
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
        
        {/* Total restaurants */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Restaurants</p>
              <h3 className="text-2xl font-bold">{mockPlatformMetrics.totalRestaurants}</h3>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <ArrowUp size={14} className="mr-1" />
                <span>3.5% from last month</span>
              </div>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Store size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Sales and orders chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">Sales & Orders</h2>
          <div className="h-80">
            <Line data={salesChartData} options={salesChartOptions} />
          </div>
        </div>
        
        {/* Order status distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">Order Status</h2>
          <div className="h-80 flex items-center justify-center">
            <Doughnut data={orderStatusChartData} options={orderStatusChartOptions} />
          </div>
        </div>
      </div>
      
      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* User acquisition */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">User Acquisition</h2>
          <div className="h-80">
            <Bar data={userChartData} options={userChartOptions} />
          </div>
        </div>
        
        {/* Cuisine popularity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">Cuisine Popularity</h2>
          <div className="h-80 flex items-center justify-center">
            <Pie data={cuisineChartData} options={cuisineChartOptions} />
          </div>
        </div>
      </div>
      
      {/* Top performing restaurants */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-6">Top Performing Restaurants</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Restaurant
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sales
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Growth
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockRestaurantPerformance.map((restaurant, index) => (
                <tr key={restaurant.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                        {restaurant.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{restaurant.name}</div>
                        <div className="text-sm text-gray-500">ID: {restaurant.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${restaurant.sales.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{restaurant.orders}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900">{restaurant.rating}</span>
                      <span className="ml-1">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center text-sm ${index % 2 === 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {index % 2 === 0 ? (
                        <ArrowUp size={14} className="mr-1" />
                      ) : (
                        <ArrowDown size={14} className="mr-1" />
                      )}
                      <span>{(5 + index * 3).toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Additional metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active users */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Active Users</h3>
            <div className="bg-blue-100 rounded-full p-2">
              <UserPlus size={18} className="text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-2">{mockPlatformMetrics.activeUsers.toLocaleString()}</div>
          <div className="text-sm text-gray-600">
            {((mockPlatformMetrics.activeUsers / mockPlatformMetrics.totalUsers) * 100).toFixed(1)}% of total users
          </div>
        </div>
        
        {/* Average order value */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Average Order Value</h3>
            <div className="bg-green-100 rounded-full p-2">
              <DollarSign size={18} className="text-green-600" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-2">${mockPlatformMetrics.averageOrderValue.toFixed(2)}</div>
          <div className="text-sm text-gray-600">
            3.5% increase from last month
          </div>
        </div>
        
        {/* Active restaurants */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Active Restaurants</h3>
            <div className="bg-yellow-100 rounded-full p-2">
              <Store size={18} className="text-yellow-600" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-2">{mockPlatformMetrics.activeRestaurants}</div>
          <div className="text-sm text-gray-600">
            {((mockPlatformMetrics.activeRestaurants / mockPlatformMetrics.totalRestaurants) * 100).toFixed(1)}% of total restaurants
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;