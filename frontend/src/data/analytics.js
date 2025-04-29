// Mock data for admin dashboard analytics

// Daily sales data for the past 30 days
export const mockDailySales = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  
  return {
    date: date.toISOString().split('T')[0],
    sales: Math.floor(Math.random() * 5000) + 3000, // Random sales between $3,000 and $8,000
    orders: Math.floor(Math.random() * 100) + 50 // Random number of orders between 50 and 150
  };
});

// Hourly orders for today
export const mockHourlyOrders = Array.from({ length: 24 }, (_, i) => {
  return {
    hour: i,
    orders: i < 6 ? Math.floor(Math.random() * 5) : // Low orders overnight (12am-6am)
            i < 11 ? Math.floor(Math.random() * 15) + 5 : // Morning rush (6am-11am)
            i < 14 ? Math.floor(Math.random() * 25) + 15 : // Lunch (11am-2pm)
            i < 18 ? Math.floor(Math.random() * 15) + 5 : // Afternoon (2pm-6pm)
            i < 21 ? Math.floor(Math.random() * 25) + 15 : // Dinner (6pm-9pm)
            Math.floor(Math.random() * 10) + 5 // Evening (9pm-12am)
  };
});

// Restaurant performance for top 5 restaurants
export const mockRestaurantPerformance = [
  { id: 'rest-1', name: 'Burger Heaven', sales: 42680, orders: 845, rating: 4.8 },
  { id: 'rest-3', name: 'Sushi Sensation', sales: 38450, orders: 710, rating: 4.9 },
  { id: 'rest-2', name: 'Pizza Paradise', sales: 35790, orders: 680, rating: 4.6 },
  { id: 'rest-5', name: 'Thai Delight', sales: 28900, orders: 590, rating: 4.5 },
  { id: 'rest-6', name: 'Pasta Palace', sales: 25670, orders: 520, rating: 4.4 }
];

// Cuisine popularity
export const mockCuisinePopularity = [
  { cuisine: 'American', orders: 1245, percentage: 25 },
  { cuisine: 'Italian', orders: 980, percentage: 20 },
  { cuisine: 'Japanese', orders: 875, percentage: 18 },
  { cuisine: 'Mexican', orders: 680, percentage: 14 },
  { cuisine: 'Thai', orders: 590, percentage: 12 },
  { cuisine: 'Other', orders: 530, percentage: 11 }
];

// Platform metrics
export const mockPlatformMetrics = {
  totalUsers: 8750,
  activeUsers: 5320,
  totalRestaurants: 142,
  activeRestaurants: 128,
  totalOrders: 24680,
  averageOrderValue: 32.45,
  totalRevenue: 986750,
  platformFees: 147950
};

// User acquisition for the past 6 months
export const mockUserAcquisition = Array.from({ length: 6 }, (_, i) => {
  const date = new Date();
  date.setMonth(date.getMonth() - (5 - i));
  
  return {
    month: `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`,
    newUsers: Math.floor(Math.random() * 300) + 200, // Random new users between 200 and 500
    activeUsers: Math.floor(Math.random() * 500) + 2000 // Random active users between 2,000 and 2,500
  };
});

// Order status distribution
export const mockOrderStatusDistribution = [
  { status: 'Delivered', count: 22980, percentage: 93.1 },
  { status: 'Cancelled', count: 985, percentage: 4.0 },
  { status: 'In Progress', count: 715, percentage: 2.9 }
];