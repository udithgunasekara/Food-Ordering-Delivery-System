import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import OrderTracking from '../../components/customer/OrderTracking';
import { Order } from '../../types';
import axios from 'axios';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const selectedOrderIdRef = useRef<string | null>(null);

  const customerId = '681521470a1fe0512b136ab5'; // Replace with dynamic ID if you have auth context or params

  // Function to fetch orders from the backend
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/order/getAll/${customerId}`);
      setOrders(response.data);
      
      // Update selected order based on the ref
      if (selectedOrderIdRef.current) {
        const updatedSelectedOrder = response.data.find((o: Order) => o.id === selectedOrderIdRef.current);
        if (updatedSelectedOrder) {
          setSelectedOrder(updatedSelectedOrder);
          return;
        }
      }
      
      // If no order is selected or the selected order is no longer in the data,
      // select the first active order (if any)
      const firstActive = response.data.find((o: Order) => o.orderStatus !== 'DELIVERED' && o.orderStatus !== 'CANCELLED');
      setSelectedOrder(firstActive || null);
      if (firstActive) {
        selectedOrderIdRef.current = firstActive.id;
      } else {
        selectedOrderIdRef.current = null;
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update the ref when selectedOrder changes
  useEffect(() => {
    if (selectedOrder) {
      selectedOrderIdRef.current = selectedOrder.id;
    } else {
      selectedOrderIdRef.current = null;
    }
  }, [selectedOrder]);

  // Fetch orders on component mount and then every 2 seconds
  useEffect(() => {
    fetchOrders(); // Initial fetch on mount

    const intervalId = setInterval(() => {
      fetchOrders(); // Fetch orders every 2 seconds
    }, 2000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [customerId]);

  const activeOrders = orders.filter(o => o.orderStatus !== 'DELIVERED' && o.orderStatus !== 'CANCELLED');
  const pastOrders = orders.filter(o => o.orderStatus === 'DELIVERED' || o.orderStatus === 'CANCELLED');

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-24 pb-12 text-center text-gray-500">Loading orders...</main>
        <Footer />
      </div>
    );
  }

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
                              {new Date(order.placeAt).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                              {order.orderStatus.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 text-sm text-gray-600">
                          {order.items.reduce((acc, item) => acc + item.quantity, 0)} items • Rs.{' '}
                          {order.totalPrice.toFixed(2)}
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
                              {new Date(order.placeAt).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span
                              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                                order.orderStatus === 'DELIVERED'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {order.orderStatus.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 text-sm text-gray-600">
                          {order.items.reduce((acc, item) => acc + item.quantity, 0)} items • Rs.{' '}
                          {order.totalPrice.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Orders */}
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

            {/* Order Tracking Panel */}
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