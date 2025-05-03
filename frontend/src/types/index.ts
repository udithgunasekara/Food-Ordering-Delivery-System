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

export interface Item {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  customerId: string;
  restaurantId: string;
  items: Item[];
  totalPrice: number;
  paymentStatus: 'PAID' | 'UNPAID';
  orderStatus: 'PLACED' | 'CONFIRMED' | 'PREPARING' | 'PACKED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  placeAt: string;
  updatedAt: string;
}

export interface Delivery {
  deliveryId: string;
  orderDetails: Order;
  deliveryPersonId: string;
  customerLongitude: string;
  customerLatitude: string;
  restaurantLongitude: string;
  restaurantLatitude: string;
  deliveryPersonLongitude: string;
  deliveryPersonLatitude: string;
  deliveryStatus: 'PENDING' | 'IN_PROGRESS' | 'DELIVERED' | 'CANCELLED';
}
export interface Category {
  id: string;
  name: string;
  icon: string;
}

// login page interfaces
export interface JwtPayload{
  sub: string;
  roles: string[];
  [key: string]: any;
}

export interface UserFromToken {
  email: string;
  role: string[];
  token: string;
}

export interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  role: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
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