import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import AvailableOrderCard from '../../components/delivery/AvailableOrderCard';
import DeliveryMap from '../../components/delivery/DeliveryMap';
import { Order, OrderItem } from '../../types';
import { MapPin, Navigation, Clock, DollarSign, ToggleLeft } from 'lucide-react';

// Extend the Order interface to include coordinates
interface ExtendedOrder extends Order {
  customerLatitude?: string;
  customerLongitude?: string;
  restaurantLatitude?: string;
  restaurantLongitude?: string;
  deliveryId?: string;
}

const DeliveryDashboard: React.FC<{ driverId?: string }> = () => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [activeDelivery, setActiveDelivery] = useState<ExtendedOrder | null>(null);
  const [deliveryStep, setDeliveryStep] = useState(0);
  const [availableOrders, setAvailableOrders] = useState<ExtendedOrder[]>([]);

  useEffect(() => {
    if (!isAvailable) {
      setAvailableOrders([]);
      return;
    }

    const driverId = 'DRV001'; // Hardcoded driverId
    const wsUrl = `ws://localhost:3003/api/notifications?driverId=${driverId}`;
    console.log('Connecting to WebSocket:', wsUrl);
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log(`WebSocket connected for driver ${driverId}`);
    };

    ws.onmessage = (event) => {
      try {
        const notification = JSON.parse(event.data);
        console.log('Received notification:', notification);

        if (!notification.orderDetails || !notification.deliveryId) {
          console.error('Invalid notification format:', notification);
          return;
        }

        // Extract order ID from notification.orderDetails.id
        const newOrder: ExtendedOrder = {
          id: notification.orderDetails.id, // Order ID from notification (e.g., ORD987655)
          restaurantId: notification.orderDetails.restaurantId,
          deliveryAddress: notification.orderDetails.customerId,
          total: notification.orderDetails.totalPrice,
          status: notification.orderDetails.orderStatus.toLowerCase() as 'preparing' | 'confirmed' | 'delivering' | 'delivered',
          items: notification.orderDetails.items?.map((item: any) => ({
            itemId: item.itemId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            totalPrice: item.totalPrice,
          })) as OrderItem[] || [],
          customerId: notification.orderDetails.customerId,
          paymentStatus: notification.orderDetails.paymentStatus,
          placeAt: notification.orderDetails.placeAt,
          updatedAt: notification.orderDetails.updatedAt,
          deliveryId: notification.deliveryId,
          expiresAt: Date.now() + 30 * 1000,
        };

        console.log('Processed new order:', newOrder);

        if (['preparing', 'confirmed', 'delivering'].includes(newOrder.status)) {
          setAvailableOrders((prev) => {
            if (prev.some(order => order.id === newOrder.id)) {
              console.log('Order already exists:', newOrder.id);
              return prev;
            }
            console.log('Adding order to availableOrders:', newOrder.id);
            return [...prev, newOrder];
          });
        } else {
          console.log('Order ignored due to status:', newOrder.status);
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log(`WebSocket disconnected for driver ${driverId}`);
      if (isAvailable) {
        setTimeout(() => {
          console.log('Attempting to reconnect WebSocket...');
          const newWs = new WebSocket(wsUrl);
          newWs.onopen = ws.onopen;
          newWs.onmessage = ws.onmessage;
          newWs.onclose = ws.onclose;
          newWs.onerror = ws.onerror;
        }, 5000);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
      console.log(`WebSocket closed for driver ${driverId}`);
    };
  }, [isAvailable]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAvailableOrders((prev) =>
        prev.filter((order) => !order.expiresAt || order.expiresAt > Date.now())
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAcceptOrder = async (order: ExtendedOrder) => {
    try {
      const driverId = 'DRV001'; // Hardcoded driverId
      const driverDetails = {
        name: 'John Doe', // Example driver details, adjust as needed
        vehicle: 'Motorcycle',
        phone: '123-456-7890',
      };

      // Accept the order
      const acceptResponse = await fetch('http://localhost:3003/api/notifications/accept-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driverId, orderId: order.id, deliveryId: order.deliveryId, driverDetails }),
      });
      if (!acceptResponse.ok) {
        throw new Error(`HTTP error! status: ${acceptResponse.status}`);
      }

      // Fetch order details with coordinates using the order ID
      const orderDetailsResponse = await fetch(`http://localhost:8080/api/delivery/get/order/${order.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!orderDetailsResponse.ok) {
        throw new Error(`HTTP error! status: ${orderDetailsResponse.status}`);
      }
      const orderDetails = await orderDetailsResponse.json();

      // Update order with coordinates
      const updatedOrder: ExtendedOrder = {
        ...order,
        customerLatitude: orderDetails.customerLatitude,
        customerLongitude: orderDetails.customerLongitude,
        restaurantLatitude: orderDetails.restaurantLatitude,
        restaurantLongitude: orderDetails.restaurantLongitude,
      };

      setActiveDelivery(updatedOrder);
      setDeliveryStep(0);
      setAvailableOrders((prev) => prev.filter(o => o.id !== order.id));
    } catch (error) {
      console.error('Error accepting order:', error);
      alert('Failed to accept order');
    }
  };

  const handleDeclineOrder = (order: ExtendedOrder) => {
    alert('Order declined');
    setAvailableOrders((prev) => prev.filter(o => o.id !== order.id));
  };

  const handleUpdateStep = (step: number) => {
    setDeliveryStep(step);
    if (step === 4) { // Assuming 4 steps total
      setTimeout(() => {
        setActiveDelivery(null);
        setDeliveryStep(0);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-2xl font-bold">Delivery Dashboard</h1>
            <div className="mt-4 md:mt-0 flex items-center">
              <span className="mr-2 text-sm font-medium text-gray-700">Available for Deliveries</span>
              <button
                onClick={() => setIsAvailable(!isAvailable)}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
                  isAvailable ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                    isAvailable ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Today's Deliveries</p>
                  <h3 className="text-2xl font-bold mt-1">3</h3>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Navigation className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Today's Earnings</p>
                  <h3 className="text-2xl font-bold mt-1">$42.50</h3>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Hours Active</p>
                  <h3 className="text-2xl font-bold mt-1">4.5</h3>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Kilometers</p>
                  <h3 className="text-2xl font-bold mt-1">37.2</h3>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-semibold mb-4">
                {activeDelivery ? 'Current Delivery' : 'Available Orders'}
              </h2>
              {activeDelivery ? (
                <DeliveryMap order={activeDelivery} currentStep={deliveryStep} onUpdateStep={handleUpdateStep} />
              ) : isAvailable ? (
                <>
                  {availableOrders.length > 0 ? (
                    <div className="space-y-4">
                      {availableOrders.map((order) => (
                        <AvailableOrderCard
                          key={order.id}
                          order={order}
                          onAccept={handleAcceptOrder}
                          onDecline={handleDeclineOrder}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                      <p className="text-gray-500">No orders available for delivery at the moment.</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <ToggleLeft className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500">
                    You are currently set as unavailable for deliveries. Toggle your status to receive delivery requests.
                  </p>
                </div>
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4">Delivery History</h2>
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Order ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Restaurant
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Earning
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#12345</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Today, 2:30 PM</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Burger Palace</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$8.50</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#12344</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Today, 12:15 PM</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Pizza Heaven</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$7.25</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#12342</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Yesterday, 7:45 PM</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Noodle House</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$9.00</td>
                    </tr>
                  </tbody>
                </table>
                <div className="px-6 py-3 bg-gray-50 text-right text-sm">
                  <button className="text-orange-500 hover:text-orange-600 transition-colors">
                    View all history
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DeliveryDashboard;