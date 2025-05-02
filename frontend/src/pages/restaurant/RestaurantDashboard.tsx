import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Settings, LogOut } from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import RestaurantStats from '../../components/restaurant/RestaurantStats';
import OrderCard from '../../components/restaurant/OrderCard';
import FoodItemForm from '../../components/restaurant/FoodItemForm';
import { orders } from '../../data/mockData';
import { Order, FoodItem } from '../../types';
import { useAuth } from '../../context/AuthContext';

const RestaurantDashboard: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const { logout } = useAuth();

  // Filter for orders from this restaurant
  const restaurantOrders = orders.filter(order => order.restaurantId === '1');
  
  // Group orders by status
  const pendingOrders = restaurantOrders.filter(order => 
    order.status === 'pending' || order.status === 'confirmed'
  );
  const activeOrders = restaurantOrders.filter(order => 
    order.status === 'preparing' || order.status === 'out-for-delivery'
  );
  const completedOrders = restaurantOrders.filter(order => 
    order.status === 'delivered' || order.status === 'cancelled'
  );

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleAddItem = (item: Partial<FoodItem>) => {
    // In a real app, this would make an API call to add the item
    alert('Item added successfully!');
    setIsAddingItem(false);
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
                    {pendingOrders.map(order => (
                      <OrderCard 
                        key={order.id} 
                        order={order} 
                        onClick={handleOrderClick}
                      />
                    ))}
                    
                    {pendingOrders.length === 0 && (
                      <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                        No pending orders at the moment.
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Active Orders */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-4">Active Orders</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeOrders.map(order => (
                      <OrderCard 
                        key={order.id} 
                        order={order} 
                        onClick={handleOrderClick}
                      />
                    ))}
                    
                    {activeOrders.length === 0 && (
                      <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                        No active orders at the moment.
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Completed Orders */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">Completed Orders</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {completedOrders.slice(0, 4).map(order => (
                      <OrderCard 
                        key={order.id} 
                        order={order} 
                        onClick={handleOrderClick}
                      />
                    ))}
                    
                    {completedOrders.length === 0 && (
                      <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                        No completed orders yet.
                      </div>
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
                      Order #{selectedOrder.id}
                    </h2>
                    
                    <div className="mb-4">
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedOrder.status === 'delivered' 
                          ? 'bg-green-100 text-green-800' 
                          : selectedOrder.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                      }`}>
                        {selectedOrder.status.replace('-', ' ').toUpperCase()}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(selectedOrder.createdAt).toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Customer Information</h3>
                      <p className="text-sm">John Doe</p>
                      <p className="text-sm">555-123-4567</p>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Delivery Address</h3>
                      <p className="text-sm">{selectedOrder.deliveryAddress}</p>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Items</h3>
                      <ul className="divide-y">
                        {selectedOrder.items.map((item, index) => (
                          <li key={index} className="py-2">
                            <div className="flex justify-between">
                              <span>{item.quantity}x {item.item.name}</span>
                              <span>${(item.item.price * item.quantity).toFixed(2)}</span>
                            </div>
                            {item.customizations && item.customizations.length > 0 && (
                              <p className="text-xs text-gray-500 mt-1">
                                {item.customizations.map(c => c.choiceName).join(', ')}
                              </p>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>${selectedOrder.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span>Delivery Fee</span>
                        <span>${selectedOrder.deliveryFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span>Tax</span>
                        <span>${selectedOrder.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold mt-2">
                        <span>Total</span>
                        <span>${selectedOrder.total.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    {selectedOrder.status === 'pending' && (
                      <div className="mt-6 grid grid-cols-2 gap-3">
                        <button className="py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors">
                          Reject
                        </button>
                        <button className="py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
                          Accept
                        </button>
                      </div>
                    )}
                    
                    {selectedOrder.status === 'confirmed' && (
                      <button className="mt-6 w-full py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors">
                        Start Preparing
                      </button>
                    )}
                    
                    {selectedOrder.status === 'preparing' && (
                      <button className="mt-6 w-full py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors">
                        Ready for Pickup
                      </button>
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