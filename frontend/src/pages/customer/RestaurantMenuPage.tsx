// import React, { useEffect, useState } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { ChevronLeft, Star, Clock, DollarSign } from 'lucide-react';
// import axios from 'axios';
// import Header from '../../components/common/Header';
// import Footer from '../../components/common/Footer';

// interface MenuItem {
//   name: string;
//   price: number;
//   description: string;
//   url: string;
// }

// interface RestaurantMenu {
//   id: string;
//   restaurantName: string;
//   restId: string;
//   items: MenuItem[];
//   itemCount: number;
// }

// const RestaurantMenuPage: React.FC = () => {
//  const { id } = useParams<{ id: string }>();
//   const [restaurant, setRestaurant] = useState<RestaurantMenu | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   //const id = '6814ecaf4025e84bc778108c'; // Hardcoded for testing, replace with useParams() in production

//   useEffect(() => {
//     setLoading(true);
    
//     // Configure axios to follow redirects
//     const axiosConfig = {
//       maxRedirects: 5, // Allow up to 5 redirects
//       validateStatus: (status) => status < 500, // Accept all status codes less than 500
//       withCredentials: true // Include cookies if needed for authentication
//     };
    
//     axios.get(`http://localhost:8080/menu/${id}`, axiosConfig)
//       .then(response => {
//         console.log('API Response:', response.data);
//         // The response contains an array, so we need to take the first item
//         if (Array.isArray(response.data) && response.data.length > 0) {
//           setRestaurant(response.data[0]);
//         } else {
//           setRestaurant(response.data);
//         }
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error('Error fetching restaurant menu:', err);
        
//         // For debugging - log more details about the error
//         if (err.response) {
//           console.log('Error response data:', err.response.data);
//           console.log('Error response status:', err.response.status);
//           console.log('Error response headers:', err.response.headers);
          
//           // If we have a redirect location, try that URL directly
//           if (err.response.headers.location) {
//             console.log('Redirect location:', err.response.headers.location);
//           }
//         }
        
//         setError(`Failed to load restaurant menu: ${err.message}`);
//         setLoading(false);
//       });
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col">
//         <Header />
//         <main className="flex-grow pt-24 pb-12 flex items-center justify-center">
//           <div className="animate-pulse text-xl">Loading menu...</div>
//         </main>
//         <Footer />
//       </div>
//     );
//   }

//   if (error || !restaurant) {
//     return (
//       <div className="min-h-screen flex flex-col">
//         <Header />
//         <main className="flex-grow pt-24 pb-12 flex items-center justify-center">
//           <div className="text-red-500">{error || 'Restaurant not found'}</div>
//           <Link to="/" className="mt-4 text-blue-500 hover:underline flex items-center">
//             <ChevronLeft className="w-4 h-4 mr-1" />
//             Back to Restaurants
//           </Link>
//         </main>
//         <Footer />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Header />

//       <main className="flex-grow pt-24 pb-12">
//         <div className="container mx-auto px-4">
//           <div className="mb-6">
//             <Link to="/" className="text-gray-600 hover:text-gray-900 flex items-center">
//               <ChevronLeft className="w-5 h-5 mr-1" />
//               Back to Restaurants
//             </Link>
//           </div>

//           {/* Restaurant Header */}
//           <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
//             <div className="relative h-64">
//               <img 
//                 src="https://source.unsplash.com/random/1200x400/?restaurant,food" 
//                 alt={restaurant.restaurantName}
//                 className="w-full h-full object-cover"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
//                 <h1 className="text-white text-3xl font-bold">{restaurant.restaurantName}</h1>
//                 <div className="flex items-center mt-2 text-white">
//                   <div className="flex items-center mr-4">
//                     <Star className="w-5 h-5 text-yellow-400 mr-1" />
//                     <span>4.5</span>
//                   </div>
//                   <div className="flex items-center mr-4">
//                     <Clock className="w-4 h-4 mr-1" />
//                     <span>30-45 min</span>
//                   </div>
//                   <div className="flex items-center">
//                     <DollarSign className="w-4 h-4 mr-1" />
//                     <span>$2.99 Delivery</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Menu Section */}
//           <section>
//             <h2 className="text-2xl font-semibold mb-6">Menu Items ({restaurant.itemCount})</h2>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {restaurant.items && restaurant.items.length > 0 ? (
//                 restaurant.items.map((item, index) => (
//                   <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
//                     <div className="h-48 relative">
//                       <img 
//                         src={item.url && item.url !== "qweqwe" ? item.url : "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"} 
//                         alt={item.name}
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                     <div className="p-4">
//                       <div className="flex justify-between items-start">
//                         <h3 className="text-lg font-semibold">{item.name}</h3>
//                         <span className="font-bold text-orange-600">${item.price.toFixed(2)}</span>
//                       </div>
//                       <p className="text-gray-600 mt-2 text-sm">{item.description}</p>
//                       <button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full px-4 py-2 text-sm font-medium w-full transition-colors">
//                         Add to Cart
//                       </button>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="col-span-full text-center py-10 text-gray-500">
//                   <p>No menu items available for this restaurant.</p>
//                 </div>
//               )}
//             </div>
//           </section>
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// };

// export default RestaurantMenuPage;

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Star, Clock, DollarSign, ShoppingCart } from 'lucide-react';
import axios from 'axios';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { useCart } from '../../context/CartContext';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  url: string;
}

interface RestaurantMenu {
  id: string;
  restaurantName: string;
  restId: string;
  items: MenuItem[];
  itemCount: number;
}

const RestaurantMenuPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<RestaurantMenu | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [addedToCartMessage, setAddedToCartMessage] = useState<string | null>(null);
  
  // Get cart context
  const { addToCart, cartItems } = useCart();

  useEffect(() => {
    setLoading(true);
    
    // Configure axios to follow redirects
    const axiosConfig = {
      maxRedirects: 5, // Allow up to 5 redirects
      validateStatus: (status) => status < 500, // Accept all status codes less than 500
      withCredentials: true // Include cookies if needed for authentication
    };
    
    axios.get(`http://localhost:8080/menu/${id}`, axiosConfig)
      .then(response => {
        console.log('API Response:', response.data);
        localStorage.setItem('restID', id);
        // The response contains an array, so we need to take the first item
        if (Array.isArray(response.data) && response.data.length > 0) {
          setRestaurant(response.data[0]);
        } else {
          setRestaurant(response.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching restaurant menu:', err);
        
        // For debugging - log more details about the error
        if (err.response) {
          console.log('Error response data:', err.response.data);
          console.log('Error response status:', err.response.status);
          console.log('Error response headers:', err.response.headers);
          
          // If we have a redirect location, try that URL directly
          if (err.response.headers.location) {
            console.log('Redirect location:', err.response.headers.location);
          }
        }
        
        setError(`Failed to load restaurant menu: ${err.message}`);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = (item: MenuItem) => {
    // Prepare the cart item
    const cartItem = {
      id: item.id || `item-${Date.now()}`, // Use item ID or generate one if not available
      name: item.name,
      price: item.price,
      imageUrl: item.url && item.url !== "qweqwe" 
        ? item.url 
        : "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      restaurantId: id,
      restaurantName: restaurant?.restaurantName || 'Unknown Restaurant'
    };
    
    // Add to cart
    addToCart(cartItem, 1);
    
    // Show success message
    setAddedToCartMessage(`${item.name} added to cart!`);
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setAddedToCartMessage(null);
    }, 3000);
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-24 pb-12 flex items-center justify-center">
          <div className="animate-pulse text-xl">Loading menu...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-24 pb-12 flex items-center justify-center">
          <div className="text-red-500">{error || 'Restaurant not found'}</div>
          <Link to="/" className="mt-4 text-blue-500 hover:underline flex items-center">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Restaurants
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <Link to="/" className="text-gray-600 hover:text-gray-900 flex items-center">
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to Restaurants
            </Link>
            
            <Link to="/cart" className="relative flex items-center text-orange-500 hover:text-orange-600">
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Success message */}
          {addedToCartMessage && (
            <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-fade-in-out">
              {addedToCartMessage}
            </div>
          )}

          {/* Restaurant Header */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="relative h-64">
              <img 
                src="https://source.unsplash.com/random/1200x400/?restaurant,food" 
                alt={restaurant.restaurantName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <h1 className="text-white text-3xl font-bold">{restaurant.restaurantName}</h1>
                <div className="flex items-center mt-2 text-white">
                  <div className="flex items-center mr-4">
                    <Star className="w-5 h-5 text-yellow-400 mr-1" />
                    <span>4.5</span>
                  </div>
                  <div className="flex items-center mr-4">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>30-45 min</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    <span>$2.99 Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Menu Items ({restaurant.itemCount})</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurant.items && restaurant.items.length > 0 ? (
                restaurant.items.map((item, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 relative">
                      <img 
                        src={item.url && item.url !== "qweqwe" ? item.url : "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <span className="font-bold text-orange-600">${item.price.toFixed(2)}</span>
                      </div>
                      <p className="text-gray-600 mt-2 text-sm">{item.description}</p>
                      <button 
                        onClick={() => handleAddToCart(item)}
                        className="mt-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full px-4 py-2 text-sm font-medium w-full transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-gray-500">
                  <p>No menu items available for this restaurant.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RestaurantMenuPage;