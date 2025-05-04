
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Settings, LogOut } from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import RestaurantStats from '../../components/restaurant/RestaurantStats';
import OrderCard from '../../components/restaurant/OrderCard';
import FoodItemForm from '../../components/restaurant/FoodItemForm';
import { FoodItem } from '../../types';
import { useAuth } from '../../context/AuthContext';

const RestaurantDashboard: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const { logout } = useAuth();

  const restaurantId = sessionStorage.getItem('restID') || "6814ecaf4025e84bc778108c";
  
  useEffect(() => {
    // Fetch orders from API
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Fetch orders from the real API endpoint
        const response = await fetch(`http://localhost:8080/api/order/getAll/restaurant/6814ecaf4025e84bc778108c`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch orders: ${response.statusText}`);
        }
        
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        alert('Failed to load orders. Please refresh the page to try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    
    // Set up a polling interval to periodically refresh orders
    const intervalId = setInterval(fetchOrders, 30000); // Refresh every 30 seconds
    
    // Clean up the interval when component unmounts
    return () => clearInterval(intervalId);
  }, [restaurantId]);

  // Filter restaurant orders (not needed if API already filters by restaurant)
  const restaurantOrders = orders.filter(order => order.restaurantId === restaurantId);
  
  // Group orders by status based on the complete OrderStatus enum
  const pendingOrders = restaurantOrders.filter(order => 
    order.orderStatus === 'PLACED' || order.orderStatus === 'CONFIRMED'
  );
  
  const activeOrders = restaurantOrders.filter(order => 
    order.orderStatus === 'PREPARING' || order.orderStatus === 'PACKED'
  );
  
  const completedOrders = restaurantOrders.filter(order => 
    order.orderStatus === 'OUT_FOR_DELIVERY' || order.orderStatus === 'DELIVERED'
  );

  // Cancelled orders are not shown in any of the three main sections

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleAddItem = (item: Partial<FoodItem>) => {
    // In a real app, this would make an API call to add the item
    alert('Item added successfully!');
    setIsAddingItem(false);
  };

  // Function to update order status
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrderId(orderId);
      
      // Find the order by ID
      const orderToUpdate = orders.find(order => order.id === orderId);
      
      if (!orderToUpdate) {
        throw new Error(`Order with ID ${orderId} not found`);
      }
      
      // Create a copy of the order with updated status
      const updatedOrderDTO = {
        ...orderToUpdate,
        orderStatus: newStatus
      };
      
      // Call the API to update the order
      const response = await fetch(`http://localhost:8080/api/order/update/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedOrderDTO)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update order: ${response.statusText}`);
      }
      
      const updatedOrder = await response.json();
      
      // Update local state to reflect the change
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? updatedOrder : order
        )
      );
      
      // If the updated order is the selected one, update it too
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updatedOrder);
      }
      
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Function to get the next status for an order
  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'PLACED':
        return 'CONFIRMED';
      case 'CONFIRMED':
        return 'PREPARING';
      case 'PREPARING':
        return 'PACKED';
      case 'PACKED':
        return 'OUT_FOR_DELIVERY';
      default:
        return null;
    }
  };

  // Function to get button text based on current status
  const getActionButtonText = (currentStatus: string) => {
    switch (currentStatus) {
      case 'PLACED':
        return 'Confirm Order';
      case 'CONFIRMED':
        return 'Start Preparing';
      case 'PREPARING':
        return 'Mark as Packed';
      case 'PACKED':
        return 'Send for Delivery';
      default:
        return '';
    }
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Function to get color class for status badge
  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'OUT_FOR_DELIVERY':
        return 'bg-blue-100 text-blue-800';
      case 'PACKED':
        return 'bg-indigo-100 text-indigo-800';
      case 'PREPARING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-orange-100 text-orange-800';
      case 'PLACED':
        return 'bg-purple-100 text-purple-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-2xl font-bold">Restaurant Dashboard</h1>
            
            <div className="mt-4 md:mt-0 flex space-x-2">
              <button 
                onClick={() => setIsAddingItem(true)}
                className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
              >
                <Plus className="w-5 h-5 mr-1" />
                Add Menu Item
              </button>
              <Link 
                to="/restaurant/settings"
                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-5 h-5 mr-1" />
                Settings
              </Link>
              <button 
                onClick={logout}
                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-1" />
                Logout
              </button>
            </div>
          </div>
          
          {/* Stats */}
          <RestaurantStats />
          
          {isAddingItem ? (
            <FoodItemForm 
              onSubmit={handleAddItem}
              onCancel={() => setIsAddingItem(false)}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Orders Lists */}
              <div className="lg:col-span-2">
                {/* Pending Orders */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-4">Pending Orders</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {loading ? (
                      <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                        Loading orders...
                      </div>
                    ) : (
                      <>
                        {pendingOrders.map(order => (
                          <OrderCard
                            key={order.id}
                            order={order}
                            onClick={handleOrderClick}
                            statusColorClass={getStatusColorClass(order.orderStatus)}
                          />
                        ))}
                        
                        {pendingOrders.length === 0 && (
                          <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                            No pending orders at the moment.
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                
                {/* Active Orders */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-4">Active Orders</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {loading ? (
                      <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                        Loading orders...
                      </div>
                    ) : (
                      <>
                        {activeOrders.map(order => (
                          <OrderCard
                            key={order.id}
                            order={order}
                            onClick={handleOrderClick}
                            statusColorClass={getStatusColorClass(order.orderStatus)}
                          />
                        ))}
                        
                        {activeOrders.length === 0 && (
                          <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                            No active orders at the moment.
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                
                {/* Completed Orders */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">Completed Orders</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {loading ? (
                      <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                        Loading orders...
                      </div>
                    ) : (
                      <>
                        {completedOrders.slice(0, 4).map(order => (
                          <OrderCard
                            key={order.id}
                            order={order}
                            onClick={handleOrderClick}
                            statusColorClass={getStatusColorClass(order.orderStatus)}
                          />
                        ))}
                        
                        {completedOrders.length === 0 && (
                          <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                            No completed orders yet.
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  
                  {completedOrders.length > 4 && (
                    <div className="mt-4 text-center">
                      <Link 
                        to="/restaurant/orders/history"
                        className="text-orange-500 hover:text-orange-600 transition-colors"
                      >
                        View all completed orders
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Order Details */}
              <div>
                {selectedOrder ? (
                  <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                    <h2 className="text-lg font-semibold mb-3">
                      Order #{selectedOrder.id.substring(0, 8)}
                    </h2>
                    
                    <div className="mb-4">
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        getStatusColorClass(selectedOrder.orderStatus)
                      }`}>
                        {selectedOrder.orderStatus}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(selectedOrder.placeAt)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Last updated: {formatDate(selectedOrder.updatedAt)}
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Payment Status</h3>
                      <p className={`text-sm ${selectedOrder.paymentStatus === 'PAID' ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedOrder.paymentStatus}
                      </p>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Items</h3>
                      <ul className="divide-y">
                        {selectedOrder.items.map((item, index) => (
                          <li key={index} className="py-2">
                            <div className="flex justify-between">
                              <span>{item.quantity}x {item.name}</span>
                              <span>${item.totalPrice.toFixed(2)}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between font-semibold mt-2">
                        <span>Total</span>
                        <span>${selectedOrder.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    {/* Action buttons based on order status */}
                    {(['PLACED', 'CONFIRMED', 'PREPARING', 'PACKED'].includes(selectedOrder.orderStatus)) && (
                      <div className="mt-6 grid grid-cols-1 gap-3">
                        <button 
                          className="py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => updateOrderStatus(selectedOrder.id, getNextStatus(selectedOrder.orderStatus))}
                          disabled={updatingOrderId === selectedOrder.id}
                        >
                          {updatingOrderId === selectedOrder.id ? 'Updating...' : getActionButtonText(selectedOrder.orderStatus)}
                        </button>
                        
                        {selectedOrder.orderStatus !== 'CANCELLED' && (
                          <button 
                            className="py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => updateOrderStatus(selectedOrder.id, 'CANCELLED')}
                            disabled={updatingOrderId === selectedOrder.id}
                          >
                            {updatingOrderId === selectedOrder.id ? 'Updating...' : 'Cancel Order'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-md p-6 text-center sticky top-24">
                    <p className="text-gray-500">Select an order to view its details</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RestaurantDashboard;