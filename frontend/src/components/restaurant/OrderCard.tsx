// import React from 'react';
// import { Clock, ChevronRight } from 'lucide-react';
// import { Order } from '../../types';

// interface OrderCardProps {
//   order: Order;
//   onClick: (order: Order) => void;
// }

// const OrderCard: React.FC<OrderCardProps> = ({ order, onClick }) => {
//   // Calculate how long ago the order was placed
//   const getOrderTime = () => {
//     const orderDate = new Date(order.createdAt);
//     const now = new Date();
//     const diffMs = now.getTime() - orderDate.getTime();
//     const diffMins = Math.round(diffMs / 60000);
    
//     if (diffMins < 1) return 'Just now';
//     if (diffMins === 1) return '1 minute ago';
//     if (diffMins < 60) return `${diffMins} minutes ago`;
    
//     const diffHours = Math.floor(diffMins / 60);
//     if (diffHours === 1) return '1 hour ago';
//     if (diffHours < 24) return `${diffHours} hours ago`;
    
//     const diffDays = Math.floor(diffHours / 24);
//     if (diffDays === 1) return '1 day ago';
//     return `${diffDays} days ago`;
//   };

//   // Get status color
//   const getStatusColor = () => {
//     switch (order.status) {
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-800';
//       case 'confirmed':
//         return 'bg-blue-100 text-blue-800';
//       case 'preparing':
//         return 'bg-purple-100 text-purple-800';
//       case 'out-for-delivery':
//         return 'bg-orange-100 text-orange-800';
//       case 'delivered':
//         return 'bg-green-100 text-green-800';
//       case 'cancelled':
//         return 'bg-red-100 text-red-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   return (
//     <div 
//       className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
//       onClick={() => onClick(order)}
//     >
//       <div className="flex justify-between items-center mb-3">
//         <div className="flex items-center">
//           <span className="font-semibold text-gray-800">Order #{order.id}</span>
//           <span className={`ml-3 text-xs px-2 py-1 rounded-full ${getStatusColor()}`}>
//             {order.status.replace('-', ' ').toUpperCase()}
//           </span>
//         </div>
//         <div className="flex items-center text-gray-500 text-sm">
//           <Clock className="w-4 h-4 mr-1" />
//           {getOrderTime()}
//         </div>
//       </div>
      
//       <div className="border-t border-gray-100 pt-3">
//         <div className="mb-2">
//           <span className="text-sm text-gray-500">Items:</span>
//           <ul className="mt-1">
//             {order.items.map((item, index) => (
//               <li key={index} className="text-sm">
//                 {item.quantity}x {item.item.name}
//               </li>
//             ))}
//           </ul>
//         </div>
        
//         <div className="flex justify-between items-center mt-3">
//           <div className="font-semibold">${order.total.toFixed(2)}</div>
//           <ChevronRight className="w-5 h-5 text-gray-400" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderCard;

import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';

// Updated Order interface to match the new structure
interface OrderItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

interface Order {
  id: string;
  customerId: string;
  restaurantId: string;
  items: OrderItem[];
  totalPrice: number;
  paymentStatus: string;
  orderStatus: string;
  placeAt: string;
  updatedAt: string;
}

interface OrderCardProps {
  order: Order;
  onClick: (order: Order) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onClick }) => {
  // Calculate how long ago the order was placed
  const getOrderTime = () => {
    const orderDate = new Date(order.placeAt);
    const now = new Date();
    const diffMs = now.getTime() - orderDate.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 minute ago';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  // Get status color based on new orderStatus values
  const getStatusColor = () => {
    switch (order.orderStatus) {
      case 'PLACED':
        return 'bg-yellow-100 text-yellow-800';
      case 'PREPARING':
        return 'bg-blue-100 text-blue-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Truncate order ID for display
  const displayOrderId = order.id.substring(0, 8);

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onClick(order)}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <span className="font-semibold text-gray-800">Order #{displayOrderId}</span>
          <span className={`ml-3 text-xs px-2 py-1 rounded-full ${getStatusColor()}`}>
            {order.orderStatus}
          </span>
        </div>
        <div className="flex items-center text-gray-500 text-sm">
          <Clock className="w-4 h-4 mr-1" />
          {getOrderTime()}
        </div>
      </div>
      
      <div className="border-t border-gray-100 pt-3">
        <div className="mb-2">
          <span className="text-sm text-gray-500">Items:</span>
          <ul className="mt-1">
            {order.items.map((item, index) => (
              <li key={index} className="text-sm">
                {item.quantity}x {item.name}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex justify-between items-center mt-3">
          <div className="font-semibold">${order.totalPrice.toFixed(2)}</div>
          <div className="flex items-center">
            {order.paymentStatus === 'PAID' && (
              <span className="mr-2 text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">
                PAID
              </span>
            )}
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;