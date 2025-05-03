import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import CategoryList from '../../components/customer/CategoryList';
import RestaurantCard from '../../components/customer/RestaurantCard';
import axios from 'axios';

interface Restaurant {
  id: string;
  name: string;
  imageUrl: string;
  cuisineType: string;
  rating: number;
  estimatedDeliveryTime: string;
  deliveryFee: string;
  isOpen: boolean;
}

const HomePage: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  //set jwttoken in to session storage
  const token = localStorage.setItem('jwt', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkaWxzaGFuQGV4YW1wbGUuY29tIiwicm9sZXMiOlsiUk9MRV9DVVNUT01FUiIsIlJPTEVfU1lTQURNSU4iXSwiaWF0IjoxNzQ2MjkzNDA2LCJleHAiOjE3NDYyOTcwMDZ9.y2YSFPRSI4PgpFiS-aZK5SIlbralS3EI8bcUxrfBhjw');

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    console.log
    axios.get('http://localhost:8080/api/admin/all', {
      headers: {
        'Authorization': `Bearer ${jwt}`
      }
    })
      .then(response => {
        const mapped = response.data.map((item: any): Restaurant => ({
          id: item.id,
          name: item.restaurantName,
          imageUrl: 'https://source.unsplash.com/random/400x300/?restaurant', // temp image
          cuisineType: 'Mixed Cuisine', // temp data
          rating: 4.5, // temp data
          estimatedDeliveryTime: '30-45 min', // temp data
          deliveryFee: '$2.99', // temp data
          isOpen: item.status === 'APPROVED', // or however your logic goes
        }));
        setRestaurants(mapped);
      })
      .catch(error => {
        console.error('Failed to fetch restaurants:', error);
      });
  }, []);

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.cuisineType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || restaurant.cuisineType === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4">
          <section className="relative rounded-xl overflow-hidden mb-8 h-64 md:h-80">
            <img 
              src="https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
              alt="Food Delivery"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 flex flex-col justify-center px-6 md:px-10">
              <h1 className="text-white text-2xl md:text-4xl font-bold mb-4">
                Food delivery from your <br className="hidden md:block" />
                favorite restaurants
              </h1>
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="Search for restaurant or cuisine..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-10 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </section>

          <CategoryList 
            onSelectCategory={handleCategorySelect}
            selectedCategory={selectedCategory}
          />

          <section>
            <h2 className="text-xl font-semibold mb-4">
              {selectedCategory ? selectedCategory : 'All Restaurants'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map(restaurant => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}

              {filteredRestaurants.length === 0 && (
                <div className="col-span-full text-center py-10 text-gray-500">
                  <p>No restaurants found matching your criteria.</p>
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

export default HomePage;
