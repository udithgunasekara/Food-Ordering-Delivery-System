export const mockOrders = [
  {
    id: 'order-1',
    userId: 'user-1',
    restaurantId: 'rest-1',
    items: [
      {
        id: 'item-1-1',
        name: 'Classic Burger',
        price: 9.99,
        quantity: 2,
        options: [
          {
            name: 'Cheese Type',
            choice: 'Cheddar',
            price: 0.99
          },
          {
            name: 'Add-ons',
            choice: 'Bacon',
            price: 1.99
          }
        ]
      },
      {
        id: 'item-1-4',
        name: 'French Fries',
        price: 3.99,
        quantity: 1,
        options: [
          {
            name: 'Size',
            choice: 'Large',
            price: 1.50
          }
        ]
      }
    ],
    subtotal: 28.45,
    tax: 2.56,
    deliveryFee: 2.99,
    tip: 5.00,
    total: 39.00,
    status: 'delivered',
    paymentMethod: {
      type: 'card',
      last4: '4242'
    },
    deliveryAddress: {
      name: 'Home',
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345'
    },
    placedAt: '2023-04-15T18:30:00Z',
    estimatedDelivery: '2023-04-15T19:10:00Z',
    deliveredAt: '2023-04-15T19:05:00Z',
    driver: {
      id: 'driver-1',
      name: 'Michael Johnson',
      phone: '(555) 123-7890',
      rating: 4.8
    },
    rating: 5,
    review: 'The burger was amazing and arrived earlier than expected!'
  },
  {
    id: 'order-2',
    userId: 'user-1',
    restaurantId: 'rest-2',
    items: [
      {
        id: 'item-2-1',
        name: 'Margherita Pizza',
        price: 16.99, // Medium size price
        quantity: 1,
        options: [
          {
            name: 'Size',
            choice: 'Medium (14")',
            price: 4.00
          },
          {
            name: 'Crust Type',
            choice: 'Hand Tossed',
            price: 0
          }
        ]
      },
      {
        id: 'item-2-3',
        name: 'Garlic Knots',
        price: 5.99,
        quantity: 1,
        options: []
      }
    ],
    subtotal: 22.98,
    tax: 2.07,
    deliveryFee: 1.99,
    tip: 4.00,
    total: 31.04,
    status: 'delivered',
    paymentMethod: {
      type: 'card',
      last4: '4242'
    },
    deliveryAddress: {
      name: 'Home',
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345'
    },
    placedAt: '2023-05-20T19:15:00Z',
    estimatedDelivery: '2023-05-20T20:00:00Z',
    deliveredAt: '2023-05-20T19:55:00Z',
    driver: {
      id: 'driver-2',
      name: 'Sarah Williams',
      phone: '(555) 987-6543',
      rating: 4.9
    },
    rating: 4,
    review: 'Pizza was good but a bit cold on arrival.'
  },
  {
    id: 'order-3',
    userId: 'user-1',
    restaurantId: 'rest-1',
    items: [
      {
        id: 'item-1-2',
        name: 'BBQ Bacon Burger',
        price: 12.99,
        quantity: 1,
        options: [
          {
            name: 'Cooking Preference',
            choice: 'Medium',
            price: 0
          }
        ]
      },
      {
        id: 'item-1-5',
        name: 'Chocolate Milkshake',
        price: 5.99,
        quantity: 1,
        options: []
      }
    ],
    subtotal: 18.98,
    tax: 1.71,
    deliveryFee: 2.99,
    tip: 3.50,
    total: 27.18,
    status: 'in_progress',
    paymentMethod: {
      type: 'card',
      last4: '4242'
    },
    deliveryAddress: {
      name: 'Work',
      street: '456 Office Ave',
      city: 'Businessville',
      state: 'CA',
      zipCode: '54321'
    },
    placedAt: new Date(Date.now() - 25 * 60000).toISOString(), // 25 minutes ago
    estimatedDelivery: new Date(Date.now() + 15 * 60000).toISOString(), // 15 minutes from now
    driver: {
      id: 'driver-3',
      name: 'David Chen',
      phone: '(555) 456-1234',
      rating: 4.7
    },
    currentLocation: {
      lat: 34.0522,
      lng: -118.2437,
      updatedAt: new Date(Date.now() - 2 * 60000).toISOString() // 2 minutes ago
    }
  }
];

// Mock driver location updates for tracking
export const mockDriverLocations = {
  'driver-3': [
    { lat: 34.0522, lng: -118.2437, timestamp: new Date(Date.now() - 20 * 60000).toISOString() },
    { lat: 34.0530, lng: -118.2450, timestamp: new Date(Date.now() - 15 * 60000).toISOString() },
    { lat: 34.0540, lng: -118.2460, timestamp: new Date(Date.now() - 10 * 60000).toISOString() },
    { lat: 34.0550, lng: -118.2470, timestamp: new Date(Date.now() - 5 * 60000).toISOString() },
    { lat: 34.0560, lng: -118.2480, timestamp: new Date(Date.now() - 2 * 60000).toISOString() }
  ]
};

// Mock order statuses for simulation
export const mockOrderStatuses = [
  'placed', // Initial status when order is created
  'confirmed', // Restaurant confirms order
  'preparing', // Restaurant is preparing the food
  'ready_for_pickup', // Food is ready for driver pickup
  'picked_up', // Driver has picked up the food
  'in_progress', // Driver is on the way
  'delivered', // Order has been delivered
  'cancelled' // Order was cancelled
];