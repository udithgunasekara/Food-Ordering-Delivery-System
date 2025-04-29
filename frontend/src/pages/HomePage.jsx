import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, Star, Clock, DollarSign, Truck, UtensilsCrossed, TrendingUp } from 'lucide-react';
import { mockRestaurants } from '../data/restaurants';

const HomePage = () => {
  // Get top-rated restaurants (limit to 3)
  const topRatedRestaurants = [...mockRestaurants]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  return (
    <div>
      {/* Hero section */}
      <section 
        className="relative bg-cover bg-center h-[80vh] flex items-center" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)' 
        }}
      >
        <div className="container-custom text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Delicious Food Delivered to Your Door</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Order from the best local restaurants with easy, on-demand delivery.
          </p>
          
          {/* Search bar */}
          <div className="bg-white rounded-full overflow-hidden max-w-2xl mx-auto flex items-center p-2">
            <Search size={24} className="text-gray-400 ml-3" />
            <input 
              type="text" 
              placeholder="Search for food, cuisines, restaurants..." 
              className="w-full px-4 py-2 focus:outline-none text-gray-800" 
            />
            <Link to="/restaurants" className="btn btn-primary rounded-full whitespace-nowrap">
              Find Food
            </Link>
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Search</h3>
              <p className="text-gray-600">Find your favorite restaurants or discover new ones nearby.</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <UtensilsCrossed size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Choose</h3>
              <p className="text-gray-600">Browse menus and select your favorite dishes.</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Delivery</h3>
              <p className="text-gray-600">Get your food delivered to your doorstep fast and fresh.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Top restaurants section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Top Rated Restaurants</h2>
            <Link to="/restaurants" className="flex items-center text-primary hover:underline font-medium">
              View all <ChevronRight size={20} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topRatedRestaurants.map(restaurant => (
              <Link to={`/restaurants/${restaurant.id}`} key={restaurant.id} className="card group">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={restaurant.imageUrl} 
                    alt={restaurant.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 bg-white rounded-full px-2 py-1 flex items-center text-sm font-medium">
                    <Star size={16} className="text-yellow-400 mr-1" />
                    {restaurant.rating}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{restaurant.name}</h3>
                  <p className="text-gray-600 mb-3 line-clamp-2">{restaurant.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">{restaurant.cuisine}</span>
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded flex items-center">
                      <DollarSign size={14} className="mr-1" />
                      {restaurant.priceRange}
                    </span>
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded flex items-center">
                      <Clock size={14} className="mr-1" />
                      {restaurant.deliveryTime}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <TrendingUp size={14} className="mr-1 text-primary" />
                    {restaurant.reviewCount} reviews
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* App promo section */}
      <section className="py-16 bg-primary text-white">
        <div className="container-custom grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Download the TastyEats App</h2>
            <p className="text-xl mb-6">Get exclusive deals and faster ordering with our mobile app.</p>
            <div className="flex flex-wrap gap-4">
              <a href="#" className="bg-black rounded-lg px-6 py-3 flex items-center hover:bg-gray-900 transition-colors">
                <svg className="w-8 h-8 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.5,2h-11C5.1,2,4,3.1,4,4.5v15C4,20.9,5.1,22,6.5,22h11c1.4,0,2.5-1.1,2.5-2.5v-15C20,3.1,18.9,2,17.5,2z M12,19c-0.8,0-1.5-0.7-1.5-1.5S11.2,16,12,16s1.5,0.7,1.5,1.5S12.8,19,12,19z M17,15.5H7v-11h10V15.5z"/>
                </svg>
                <div>
                  <div className="text-xs">Download on the</div>
                  <div className="text-lg font-semibold">App Store</div>
                </div>
              </a>
              <a href="#" className="bg-black rounded-lg px-6 py-3 flex items-center hover:bg-gray-900 transition-colors">
                <svg className="w-8 h-8 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.5,20.5l8-8l-8-8V20.5z M12,12l8.5-8.5H7.5L12,12z M12,12l8.5,8.5v-17L12,12z M12,12l-4.5,8.5h13L12,12z"/>
                </svg>
                <div>
                  <div className="text-xs">GET IT ON</div>
                  <div className="text-lg font-semibold">Google Play</div>
                </div>
              </a>
            </div>
          </div>
          <div className="hidden md:block relative">
            <div className="w-[280px] h-[500px] mx-auto bg-black rounded-[36px] p-3 relative shadow-xl">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-5 bg-black rounded-b-lg"></div>
              <div className="w-full h-full bg-white rounded-[32px] overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="TastyEats Mobile App" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Become a partner section */}
      <section className="py-16">
        <div className="container-custom grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <img 
              src="https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
              alt="Restaurant Partner" 
              className="rounded-lg shadow-lg"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4">Become a Restaurant Partner</h2>
            <p className="text-gray-600 text-lg mb-6">
              Join our platform to reach more customers and grow your business. 
              We handle the delivery so you can focus on making delicious food.
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <div className="bg-primary bg-opacity-10 p-1 rounded-full mr-3 mt-1">
                  <ChevronRight size={16} className="text-primary" />
                </div>
                <span>Increase your sales and reach</span>
              </li>
              <li className="flex items-start">
                <div className="bg-primary bg-opacity-10 p-1 rounded-full mr-3 mt-1">
                  <ChevronRight size={16} className="text-primary" />
                </div>
                <span>Manage your menu and availability online</span>
              </li>
              <li className="flex items-start">
                <div className="bg-primary bg-opacity-10 p-1 rounded-full mr-3 mt-1">
                  <ChevronRight size={16} className="text-primary" />
                </div>
                <span>Access detailed business analytics</span>
              </li>
            </ul>
            <Link to="/restaurant/register" className="btn btn-primary">
              Register Your Restaurant
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;