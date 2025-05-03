export interface Restaurant {
  id: string;
  name: string;
  cuisineType: string;
  rating: number;
  estimatedDeliveryTime: string;
  deliveryFee: string;
  imageUrl: string;
  coverImageUrl: string;
  isOpen: boolean;
  operatingHours: string;
}

export interface FoodItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  isAvailable: boolean;
  customizationOptions?: CustomizationOption[];
}

export interface CustomizationOption {
  id: string;
  name: string;
  options: {
    id: string;
    name: string;
    price: number;
  }[];
  required: boolean;
}

export interface CartItem {
  item: FoodItem;
  quantity: number;
  customizations?: {
    optionId: string;
    choiceId: string;
    choiceName: string;
    price: number;
  }[];
}

export interface Order {
  id: string;
  customerId: string;
  restaurantId: string;
  items: CartItem[];
  status: 'pending' | 'confirmed' | 'preparing' | 'out-for-delivery' | 'delivered' | 'cancelled';
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  deliveryAddress: string;
  createdAt: string;
  estimatedDeliveryTime?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'restaurant' | 'delivery' | 'admin';
  addresses?: string[];
}

export interface DeliveryPerson {
  id: string;
  name: string;
  phone: string;
  currentLocation?: {
    lat: number;
    lng: number;
  };
  isAvailable: boolean;
  rating: number;
}