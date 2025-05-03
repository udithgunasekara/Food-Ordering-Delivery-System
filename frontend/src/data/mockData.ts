import { Restaurant, FoodItem, Category, Order, User, DeliveryPerson } from '../types';
import { ShoppingBag, Coffee, Pizza, Utensils, Sandwich, Salad, IceCream, Fish } from 'lucide-react';

export const categories: Category[] = [
  { id: '1', name: 'Fast Food', icon: 'ShoppingBag' },
  { id: '2', name: 'Cafe', icon: 'Coffee' },
  { id: '3', name: 'Pizza', icon: 'Pizza' },
  { id: '4', name: 'Fine Dining', icon: 'Utensils' },
  { id: '5', name: 'Sandwiches', icon: 'Sandwich' },
  { id: '6', name: 'Salads', icon: 'Salad' },
  { id: '7', name: 'Desserts', icon: 'IceCream' },
  { id: '8', name: 'Seafood', icon: 'Fish' },
];

export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Burger Palace',
    cuisineType: 'Fast Food',
    rating: 4.5,
    estimatedDeliveryTime: '25-35 min',
    deliveryFee: '$2.99',
    imageUrl: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    coverImageUrl: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    isOpen: true,
    operatingHours: '10:00 AM - 10:00 PM'
  },
  {
    id: '2',
    name: 'Pizza Heaven',
    cuisineType: 'Italian',
    rating: 4.3,
    estimatedDeliveryTime: '30-45 min',
    deliveryFee: '$1.99',
    imageUrl: 'https://images.pexels.com/photos/4394612/pexels-photo-4394612.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    coverImageUrl: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    isOpen: true,
    operatingHours: '11:00 AM - 11:00 PM'
  },
  {
    id: '3',
    name: 'Sushi Master',
    cuisineType: 'Japanese',
    rating: 4.8,
    estimatedDeliveryTime: '40-55 min',
    deliveryFee: '$3.99',
    imageUrl: 'https://images.pexels.com/photos/3298037/pexels-photo-3298037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    coverImageUrl: 'https://images.pexels.com/photos/3298037/pexels-photo-3298037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    isOpen: true,
    operatingHours: '12:00 PM - 9:00 PM'
  },
  {
    id: '4',
    name: 'Taco Fiesta',
    cuisineType: 'Mexican',
    rating: 4.2,
    estimatedDeliveryTime: '25-40 min',
    deliveryFee: '$2.49',
    imageUrl: 'https://images.pexels.com/photos/2092897/pexels-photo-2092897.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    coverImageUrl: 'https://images.pexels.com/photos/2092897/pexels-photo-2092897.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    isOpen: false,
    operatingHours: '10:00 AM - 9:00 PM'
  },
  {
    id: '5',
    name: 'Noodle House',
    cuisineType: 'Chinese',
    rating: 4.6,
    estimatedDeliveryTime: '35-50 min',
    deliveryFee: '$2.99',
    imageUrl: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    coverImageUrl: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    isOpen: true,
    operatingHours: '11:00 AM - 10:00 PM'
  },
  {
    id: '6',
    name: 'Healthy Greens',
    cuisineType: 'Salads',
    rating: 4.4,
    estimatedDeliveryTime: '20-30 min',
    deliveryFee: '$1.99',
    imageUrl: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    coverImageUrl: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    isOpen: true,
    operatingHours: '9:00 AM - 8:00 PM'
  }
];

export const foodItems: FoodItem[] = [
  {
    id: '1',
    restaurantId: '1',
    name: 'Classic Cheeseburger',
    description: 'Juicy beef patty with melted cheese, lettuce, tomato, and special sauce',
    price: 8.99,
    imageUrl: 'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Burgers',
    isAvailable: true,
    customizationOptions: [
      {
        id: '1',
        name: 'Cheese Type',
        options: [
          { id: '1', name: 'American', price: 0 },
          { id: '2', name: 'Swiss', price: 0.5 },
          { id: '3', name: 'Cheddar', price: 0.5 }
        ],
        required: true
      },
      {
        id: '2',
        name: 'Add Extras',
        options: [
          { id: '1', name: 'Bacon', price: 1.5 },
          { id: '2', name: 'Avocado', price: 2 },
          { id: '3', name: 'Fried Egg', price: 1 }
        ],
        required: false
      }
    ]
  },
  {
    id: '2',
    restaurantId: '1',
    name: 'Chicken Tenders',
    description: 'Crispy fried chicken tenders served with your choice of dipping sauce',
    price: 7.99,
    imageUrl: 'https://images.pexels.com/photos/7963146/pexels-photo-7963146.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Chicken',
    isAvailable: true
  },
  {
    id: '3',
    restaurantId: '1',
    name: 'French Fries',
    description: 'Crispy golden fries seasoned with sea salt',
    price: 3.99,
    imageUrl: 'https://images.pexels.com/photos/115740/pexels-photo-115740.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Sides',
    isAvailable: true
  },
  {
    id: '4',
    restaurantId: '2',
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
    price: 12.99,
    imageUrl: 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Pizzas',
    isAvailable: true
  },
  {
    id: '5',
    restaurantId: '2',
    name: 'Pepperoni Pizza',
    description: 'Pizza topped with tomato sauce, mozzarella, and pepperoni',
    price: 14.99,
    imageUrl: 'https://images.pexels.com/photos/803290/pexels-photo-803290.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Pizzas',
    isAvailable: true
  }
];

export const orders: Order[] = [
  {
    id: '1',
    customerId: '1',
    restaurantId: '1',
    items: [
      { 
        item: foodItems[0], 
        quantity: 2,
        customizations: [
          { optionId: '1', choiceId: '1', choiceName: 'American', price: 0 },
          { optionId: '2', choiceId: '1', choiceName: 'Bacon', price: 1.5 }
        ]
      },
      { item: foodItems[2], quantity: 1 }
    ],
    status: 'confirmed',
    subtotal: 21.97,
    deliveryFee: 2.99,
    tax: 2.50,
    total: 27.46,
    deliveryAddress: '123 Main St, Anytown, USA',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    estimatedDeliveryTime: '25-35 min'
  },
  {
    id: '2',
    customerId: '1',
    restaurantId: '2',
    items: [
      { item: foodItems[3], quantity: 1 },
      { item: foodItems[4], quantity: 1 }
    ],
    status: 'preparing',
    subtotal: 27.98,
    deliveryFee: 1.99,
    tax: 3.00,
    total: 32.97,
    deliveryAddress: '123 Main St, Anytown, USA',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    estimatedDeliveryTime: '30-45 min'
  },
  {
    id: '3',
    customerId: '1',
    restaurantId: '1',
    items: [
      { item: foodItems[1], quantity: 2 },
      { item: foodItems[2], quantity: 1 }
    ],
    status: 'delivered',
    subtotal: 19.97,
    deliveryFee: 2.99,
    tax: 2.30,
    total: 25.26,
    deliveryAddress: '123 Main St, Anytown, USA',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  }
];

export const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '555-123-4567',
    role: 'customer',
    addresses: ['123 Main St, Anytown, USA', '456 Work Ave, Anytown, USA']
  },
  {
    id: '2',
    name: 'Restaurant Owner',
    email: 'owner@burgerpalace.com',
    phone: '555-987-6543',
    role: 'restaurant'
  },
  {
    id: '3',
    name: 'Delivery Driver',
    email: 'driver@delivery.com',
    phone: '555-456-7890',
    role: 'delivery'
  },
  {
    id: '4',
    name: 'Admin User',
    email: 'admin@foodexpress.com',
    phone: '555-789-0123',
    role: 'admin'
  }
];

export const deliveryPersonnel: DeliveryPerson[] = [
  {
    id: '1',
    name: 'Michael Johnson',
    phone: '555-456-7890',
    currentLocation: {
      lat: 37.7749,
      lng: -122.4194
    },
    isAvailable: true,
    rating: 4.7
  },
  {
    id: '2',
    name: 'Sarah Williams',
    phone: '555-987-6543',
    currentLocation: {
      lat: 37.7833,
      lng: -122.4167
    },
    isAvailable: false,
    rating: 4.9
  }
];

export const restaurantStats = {
  dailyOrders: 42,
  weeklyOrders: 285,
  monthlyOrders: 1247,
  dailyRevenue: 1256.78,
  weeklyRevenue: 8542.32,
  monthlyRevenue: 37651.93
};

export const adminStats = {
  totalUsers: 5742,
  totalRestaurants: 128,
  totalDeliveryPersonnel: 342,
  totalOrders: 28456,
  monthlyRevenue: 152478.93,
  activeOrders: 86
};