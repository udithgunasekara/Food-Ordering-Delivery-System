export const mockUsers = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'customer@example.com',
    password: 'password',
    role: 'ROLE_CUSTOMER',
    phone: '123-456-7890',
    addresses: [
      {
        id: 'addr-1',
        name: 'Home',
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        isDefault: true
      },
      {
        id: 'addr-2',
        name: 'Work',
        street: '456 Office Ave',
        city: 'Businessville',
        state: 'CA',
        zipCode: '54321',
        isDefault: false
      }
    ],
    paymentMethods: [
      {
        id: 'pm-1',
        type: 'card',
        lastFour: '4242',
        expiryMonth: 12,
        expiryYear: 2024,
        isDefault: true
      }
    ],
    orderHistory: ['order-1', 'order-2', 'order-3']
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'restaurant@example.com',
    password: 'password',
    role: 'ROLE_RESTAURANT_ADMIN',
    phone: '987-654-3210',
    restaurantId: 'rest-1'
  },
  {
    id: 'user-3',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password',
    role: 'ROLE_SYSADMIN',
    phone: '555-555-5555'
  }
];