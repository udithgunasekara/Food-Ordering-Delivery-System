import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import OrderTracking from '../../components/customer/OrderTracking';
import { orders } from '../../data/mockData';
import { Order } from '../../types';

const OrdersPage: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(
    orders.find(order => order.status !== 'delivered') || null
  );

  // Group orders by status
  const activeOrders = orders.filter(order => order.status !== 'delivered' && order.status !== 'cancelled');
  const pastOrders = orders.filter(order => order.status === 'delivered' || order.status === 'cancelled');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6">My Orders</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order List */}
            <div className="lg:col-span-2">
              {/* Active Orders */}
              {activeOrders.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-4">Active Orders</h2>
                  
                  <div className="space-y-4">
                    {activeOrders.map(order => (
                      <div 
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className={`bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow ${
                          selectedOrder?.id === order.id ? 'ring-2 ring-orange-500' : ''
                        }`}
                      >
                        <div className="flex justify-between">
                          <div>
                            <p className="font-semibold">Order #{order.id}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                              {order.status.replace('-', ' ').toUpperCase()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-3 text-sm">
                          <p className="text-gray-600">
                            {order.items.reduce((acc, item) => acc + item.quantity, 0)} items • 
                            ${order.total.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Past Orders */}
              {pastOrders.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Order History</h2>
                  
                  <div className="space-y-4">
                    {pastOrders.map(order => (
                      <div 
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className={`bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow ${
                          selectedOrder?.id === order.id ? 'ring-2 ring-orange-500' : ''
                        }`}
                      >
                        <div className="flex justify-between">
                          <div>
                            <p className="font-semibold">Order #{order.id}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                              order.status === 'delivered' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {order.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-3 text-sm">
                          <p className="text-gray-600">
                            {order.items.reduce((acc, item) => acc + item.quantity, 0)} items • 
                            ${order.total.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {orders.length === 0 && (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <h2 className="text-xl font-semibold mb-3">No orders yet</h2>
                  <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
                  <Link 
                    to="/"
                    className="inline-block px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                  >
                    Browse Restaurants
                  </Link>
                </div>
              )}
            </div>
            
            {/* Order Tracking */}
            <div>
              {selectedOrder ? (
                <OrderTracking order={selectedOrder} />
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <p className="text-gray-500">Select an order to view its details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrdersPage;