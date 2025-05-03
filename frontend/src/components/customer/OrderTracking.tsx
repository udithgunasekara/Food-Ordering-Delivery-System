import React, { useEffect, useRef, useState } from 'react';
import { Order, Delivery } from '../../types';

declare global {
  interface Window {
    google: any;
  }
}

interface OrderTrackingProps {
  order: Order;
}

const statusSteps = [
  { id: 1, status: 'PLACED', label: 'Order Placed', time: '15-30 minutes' },
  { id: 2, status: 'CONFIRMED', label: 'Order Confirmed', time: '15-30 minutes' },
  { id: 3, status: 'PREPARING', label: 'Preparing', time: '10-20 minutes' },
  { id: 4, status: 'PACKED', label: 'Packed', time: '5-10 minutes' },
  { id: 5, status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', time: '5-10 minutes' },
  { id: 6, status: 'DELIVERED', label: 'Delivered', time: 'Order has arrived' }
];

const OrderTracking: React.FC<OrderTrackingProps> = ({ order }) => {
  const currentStepIndex = statusSteps.findIndex(
    step => step.status === order.orderStatus.toUpperCase()
  );
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const directionsRenderer = useRef<any>(null);
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const prevDeliveryRef = useRef<Delivery | null>(null);

  // Strict check for driver assignment including coordinate validation
  const isDriverAssigned = delivery?.deliveryPersonId && 
                         delivery.deliveryPersonLatitude && 
                         delivery.deliveryPersonLongitude &&
                         !isNaN(parseFloat(delivery.deliveryPersonLatitude)) && 
                         !isNaN(parseFloat(delivery.deliveryPersonLongitude));

  // Deep comparison of delivery objects
  const hasDeliveryChanged = (prev: Delivery | null, current: Delivery | null): boolean => {
    if (prev === null && current === null) return false;
    if (prev === null || current === null) return true;
    return JSON.stringify(prev) !== JSON.stringify(current);
  };

  // Fetch delivery details
  const fetchDeliveryDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/delivery/get/order/${order.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch delivery details');
      }
      const data: Delivery = await response.json();
      
      if (hasDeliveryChanged(prevDeliveryRef.current, data)) {
        setDelivery(data);
        prevDeliveryRef.current = data;
      }
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setLoading(false);
    }
  };

  // Setup polling for delivery updates
  useEffect(() => {
    if (order.orderStatus === 'PACKED' || order.orderStatus === 'OUT_FOR_DELIVERY') {
      fetchDeliveryDetails();
      pollingIntervalRef.current = setInterval(fetchDeliveryDetails, 10000);
      
      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
      };
    }
  }, [order.id, order.orderStatus]);

  // Initialize the map and draw routes when delivery details change
  useEffect(() => {
    if ((order.orderStatus === 'PACKED' || order.orderStatus === 'OUT_FOR_DELIVERY') && 
        delivery && 
        mapRef.current) {
      
      if (mapInstance.current) {
        mapInstance.current = null;
      }
      if (directionsRenderer.current) {
        directionsRenderer.current.setMap(null);
        directionsRenderer.current = null;
      }

      if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBoJXxxWOMKdexaiud8ImxzzkaHtEIYtds&libraries=places,directions`;
        script.async = true;
        script.onload = () => initializeMapAndDrawRoute();
        document.head.appendChild(script);
      } else {
        initializeMapAndDrawRoute();
      }
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current = null;
      }
      if (directionsRenderer.current) {
        directionsRenderer.current.setMap(null);
        directionsRenderer.current = null;
      }
    };
  }, [delivery, order.orderStatus]);

  const initializeMapAndDrawRoute = () => {
    if (!delivery || !mapRef.current || !window.google) return;

    const restaurantLocation = {
      lat: parseFloat(delivery.restaurantLatitude),
      lng: parseFloat(delivery.restaurantLongitude)
    };

    const customerLocation = {
      lat: parseFloat(delivery.customerLatitude),
      lng: parseFloat(delivery.customerLongitude)
    };

    const driverLocation = isDriverAssigned ? {
      lat: parseFloat(delivery.deliveryPersonLatitude),
      lng: parseFloat(delivery.deliveryPersonLongitude)
    } : null;

    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(restaurantLocation);
    bounds.extend(customerLocation);
    if (driverLocation) bounds.extend(driverLocation);

    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    });
    mapInstance.current.fitBounds(bounds);

    directionsRenderer.current = new window.google.maps.DirectionsRenderer({
      map: mapInstance.current,
      suppressMarkers: true,
      preserveViewport: false
    });

    new window.google.maps.Marker({
      position: restaurantLocation,
      map: mapInstance.current,
      title: 'Restaurant',
      icon: {
        url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
      }
    });

    new window.google.maps.Marker({
      position: customerLocation,
      map: mapInstance.current,
      title: 'Customer',
      icon: {
        url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
      }
    });

    if (driverLocation) {
      new window.google.maps.Marker({
        position: driverLocation,
        map: mapInstance.current,
        title: 'Driver',
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        }
      });

      const directionsService = new window.google.maps.DirectionsService();
      
      if (order.orderStatus === 'OUT_FOR_DELIVERY') {
        directionsService.route(
          {
            origin: restaurantLocation,
            destination: customerLocation,
            travelMode: window.google.maps.TravelMode.DRIVING
          },
          (response: any, status: any) => {
            if (status === 'OK') {
              directionsRenderer.current.setDirections(response);
            }
          }
        );
      }
    }
  };

  const getDriverStatusMessage = () => {
    if (!isDriverAssigned) {
      return 'Searching for driver...';
    }
    return order.orderStatus === 'OUT_FOR_DELIVERY' 
      ? 'Driver is delivering your order' 
      : 'Driver assigned';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {(order.orderStatus === 'PACKED' || order.orderStatus === 'OUT_FOR_DELIVERY') && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Delivery Tracking</h3>
          {loading && <div className="text-center py-8">Loading map...</div>}
          {error && <div className="text-red-500 text-center py-8">{error}</div>}
          {!loading && !error && (
            <>
              <div 
                ref={mapRef} 
                style={{ height: '300px', width: '100%', borderRadius: '8px' }}
                className="border border-gray-200"
              />
              <div className="mt-2 text-sm text-gray-600">
                {getDriverStatusMessage()}
              </div>
            </>
          )}
        </div>
      )}

      <h2 className="text-lg font-semibold mb-6">Order Tracking</h2>

      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {statusSteps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isActive = index === currentStepIndex;
            return (
              <div
                key={step.id}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isActive
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {step.id}
              </div>
            );
          })}
        </div>

        <div className="flex justify-between px-2">
          {statusSteps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isActive = index === currentStepIndex;
            return (
              <span
                key={step.id}
                className={`text-xs text-center ${
                  isCompleted
                    ? 'text-green-700'
                    : isActive
                    ? 'text-yellow-700 font-semibold'
                    : 'text-gray-500'
                }`}
                style={{ width: `${100 / statusSteps.length}%` }}
              >
                {step.label}
              </span>
            );
          })}
        </div>

        <div className="relative mt-4">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200"></div>
          <div
            className="absolute top-0 left-0 h-1 bg-green-500 transition-all duration-300"
            style={{
              width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%`
            }}
          />
        </div>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-col items-center">
          <h3 className="text-sm font-semibold mb-1">
            {isDriverAssigned ? 'Estimated Time' : 'Driver Status'}
          </h3>
          <p className="text-lg font-bold">
            {isDriverAssigned 
              ? statusSteps[currentStepIndex]?.time || 'Calculating...'
              : getDriverStatusMessage()}
          </p>
          {isDriverAssigned && delivery?.deliveryPersonId && (
            <p className="text-sm text-gray-600 mt-1">
              Driver: {delivery.deliveryPersonId}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;