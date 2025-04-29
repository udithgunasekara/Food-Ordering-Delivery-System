import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Clock, DollarSign, Filter, ChevronDown, X, TrendingUp } from 'lucide-react';
import { mockRestaurants } from '../data/restaurants';

const RestaurantsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    cuisine: [],
    priceRange: [],
    isOpen: false,
    sortBy: 'recommended' // 'recommended', 'rating', 'deliveryTime', 'priceAsc', 'priceDesc'
  });
  
  // Get unique cuisines for filter
  const allCuisines = [...new Set(mockRestaurants.map(r => r.cuisine))];
  const allPriceRanges = [...new Set(mockRestaurants.map(r => r.priceRange))];
  
  // Apply filters and search
  useEffect(() => {
    let results = [...mockRestaurants];
    
    // Apply search term
    if (searchTerm) {
      results = results.filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply cuisine filter
    if (filters.cuisine.length > 0) {
      results = results.filter(restaurant => 
        filters.cuisine.includes(restaurant.cuisine)
      );
    }
    
    // Apply price range filter
    if (filters.priceRange.length > 0) {
      results = results.filter(restaurant => 
        filters.priceRange.includes(restaurant.priceRange)
      );
    }
    
    // Apply open/closed filter
    if (filters.isOpen) {
      results = results.filter(restaurant => restaurant.isOpen);
    }
    
    // Apply sorting
    switch (filters.sortBy) {
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'deliveryTime':
        results.sort((a, b) => {
          const aTime = parseInt(a.deliveryTime.split('-')[0]);
          const bTime = parseInt(b.deliveryTime.split('-')[0]);
          return aTime - bTime;
        });
        break;
      case 'priceAsc':
        results.sort((a, b) => {
          const aPrice = a.priceRange.length;
          const bPrice = b.priceRange.length;
          return aPrice - bPrice;
        });
        break;
      case 'priceDesc':
        results.sort((a, b) => {
          const aPrice = a.priceRange.length;
          const bPrice = b.priceRange.length;
          return bPrice - aPrice;
        });
        break;
      case 'recommended':
      default:
        // Sort by a combination of rating and number of reviews
        results.sort((a, b) => (b.rating * Math.log(b.reviewCount)) - (a.rating * Math.log(a.reviewCount)));
        break;
    }
    
    setFilteredRestaurants(results);
  }, [searchTerm, filters]);
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  
  const toggleCuisineFilter = (cuisine) => {
    if (filters.cuisine.includes(cuisine)) {
      setFilters({
        ...filters,
        cuisine: filters.cuisine.filter(c => c !== cuisine)
      });
    } else {
      setFilters({
        ...filters,
        cuisine: [...filters.cuisine, cuisine]
      });
    }
  };
  
  const togglePriceRangeFilter = (priceRange) => {
    if (filters.priceRange.includes(priceRange)) {
      setFilters({
        ...filters,
        priceRange: filters.priceRange.filter(p => p !== priceRange)
      });
    } else {
      setFilters({
        ...filters,
        priceRange: [...filters.priceRange, priceRange]
      });
    }
  };
  
  const toggleOpenFilter = () => {
    setFilters({
      ...filters,
      isOpen: !filters.isOpen
    });
  };
  
  const handleSortChange = (e) => {
    setFilters({
      ...filters,
      sortBy: e.target.value
    });
  };
  
  const clearFilters = () => {
    setFilters({
      cuisine: [],
      priceRange: [],
      isOpen: false,
      sortBy: 'recommended'
    });
    setSearchTerm('');
  };
  
  const hasActiveFilters = filters.cuisine.length > 0 || filters.priceRange.length > 0 || filters.isOpen || filters.sortBy !== 'recommended' || searchTerm;
  
  return (
    <div className="py-8">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8">Restaurants</h1>
        
        {/* Search and filter bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search for restaurants or cuisines..."
                className="input pl-10"
              />
            </div>
            <button
              className={`flex items-center px-4 py-2 border rounded-md ${isFilterOpen ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300'}`}
              onClick={toggleFilter}
            >
              <Filter size={20} className="mr-2" />
              Filters
              <ChevronDown size={18} className={`ml-2 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          {/* Expanded filter panel */}
          {isFilterOpen && (
            <div className="bg-white p-6 rounded-md shadow-md mb-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Cuisine</h3>
                  <div className="space-y-2">
                    {allCuisines.map(cuisine => (
                      <label key={cuisine} className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={filters.cuisine.includes(cuisine)} 
                          onChange={() => toggleCuisineFilter(cuisine)}
                          className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <span className="ml-2">{cuisine}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Price Range</h3>
                  <div className="space-y-2">
                    {allPriceRanges.map(price => (
                      <label key={price} className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={filters.priceRange.includes(price)} 
                          onChange={() => togglePriceRangeFilter(price)}
                          className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <span className="ml-2">{price}</span>
                      </label>
                    ))}
                  </div>
                  
                  <h3 className="font-medium mb-3 mt-6">Availability</h3>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={filters.isOpen} 
                      onChange={toggleOpenFilter}
                      className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="ml-2">Open Now</span>
                  </label>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Sort By</h3>
                  <select 
                    value={filters.sortBy} 
                    onChange={handleSortChange}
                    className="input"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="rating">Rating (High to Low)</option>
                    <option value="deliveryTime">Delivery Time (Fast to Slow)</option>
                    <option value="priceAsc">Price (Low to High)</option>
                    <option value="priceDesc">Price (High to Low)</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <button 
                  className="text-gray-600 hover:text-gray-900 mr-4"
                  onClick={clearFilters}
                >
                  Clear All
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={toggleFilter}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
          
          {/* Active filters display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600">Active Filters:</span>
              
              {searchTerm && (
                <span className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full flex items-center">
                  Search: {searchTerm}
                  <button 
                    className="ml-2 text-gray-600 hover:text-gray-900"
                    onClick={() => setSearchTerm('')}
                  >
                    <X size={14} />
                  </button>
                </span>
              )}
              
              {filters.cuisine.map(cuisine => (
                <span key={cuisine} className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full flex items-center">
                  {cuisine}
                  <button 
                    className="ml-2 text-gray-600 hover:text-gray-900"
                    onClick={() => toggleCuisineFilter(cuisine)}
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
              
              {filters.priceRange.map(price => (
                <span key={price} className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full flex items-center">
                  {price}
                  <button 
                    className="ml-2 text-gray-600 hover:text-gray-900"
                    onClick={() => togglePriceRangeFilter(price)}
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
              
              {filters.isOpen && (
                <span className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full flex items-center">
                  Open Now
                  <button 
                    className="ml-2 text-gray-600 hover:text-gray-900"
                    onClick={toggleOpenFilter}
                  >
                    <X size={14} />
                  </button>
                </span>
              )}
              
              {filters.sortBy !== 'recommended' && (
                <span className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full flex items-center">
                  Sort: {filters.sortBy.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  <button 
                    className="ml-2 text-gray-600 hover:text-gray-900"
                    onClick={() => setFilters({...filters, sortBy: 'recommended'})}
                  >
                    <X size={14} />
                  </button>
                </span>
              )}
              
              <button 
                className="text-primary text-sm hover:underline"
                onClick={clearFilters}
              >
                Clear All
              </button>
            </div>
          )}
        </div>
        
        {/* Restaurant grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRestaurants.length > 0 ? (
            filteredRestaurants.map(restaurant => (
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
                  {!restaurant.isOpen && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-75 text-white text-center py-2">
                      Closed
                    </div>
                  )}
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
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-medium mb-2">No restaurants found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
              <button 
                className="btn btn-primary"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantsPage;