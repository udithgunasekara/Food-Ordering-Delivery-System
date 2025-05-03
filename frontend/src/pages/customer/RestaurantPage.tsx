import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Clock, ChevronRight } from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import FoodItemCard from '../../components/customer/FoodItemCard';
import { restaurants, foodItems } from '../../data/mockData';
import { Restaurant, FoodItem } from '../../types';

const RestaurantPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menu, setMenu] = useState<FoodItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [isHeaderVisible, setIsHeaderVisible] = useState<boolean>(false);

  // Find restaurant and its menu items
  useEffect(() => {
    if (id) {
      const foundRestaurant = restaurants.find(r => r.id === id);
      if (foundRestaurant) {
        setRestaurant(foundRestaurant);
        
        // Find menu items for this restaurant
        const restaurantMenu = foodItems.filter(item => item.restaurantId === id);
        setMenu(restaurantMenu);
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(restaurantMenu.map(item => item.category)));
        setCategories(uniqueCategories);
        
        if (uniqueCategories.length > 0) {
          setActiveCategory(uniqueCategories[0]);
        }
      }
    }
  }, [id]);

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsHeaderVisible(scrollPosition > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter menu items by category
  const filteredItems = menu.filter(item => 
    activeCategory === 'All' || item.category === activeCategory
  );

  if (!restaurant) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20">
        {/* Restaurant Header */}
        <div className="relative h-64 md:h-80">
          <img 
            src={restaurant.coverImageUrl} 
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex items-end">
            <div className="container mx-auto px-4 pb-6">
              <div className="flex flex-col md:flex-row md:items-end">
                <div className="flex-shrink-0 h-24 w-24 bg-white rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src={restaurant.imageUrl} 
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-3 md:mt-0 md:ml-5 text-white">
                  <h1 className="text-2xl md:text-3xl font-bold">{restaurant.name}</h1>
                  <p className="text-white/80 text-sm md:text-base">{restaurant.cuisineType}</p>
                  
                  <div className="flex mt-2 space-x-4">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 mr-1" />
                      <span>{restaurant.rating}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-1" />
                      <span>{restaurant.estimatedDeliveryTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sticky Category Navigation */}
        <div className={`sticky top-16 z-10 bg-white shadow-md transition-all duration-300 ${
          isHeaderVisible ? 'translate-y-0' : 'translate-y-0'
        }`}>
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto py-4 space-x-6 scrollbar-hide">
              {categories.map(category => (
                <button 
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full transition-colors ${
                    activeCategory === category 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Menu Items */}
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-semibold mb-6">{activeCategory}</h2>
          
          <div className="space-y-6">
            {filteredItems.map(item => (
              <FoodItemCard key={item.id} item={item} />
            ))}
            
            {filteredItems.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                <p>No items found in this category.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RestaurantPage;