import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { Star, Clock, DollarSign, MapPin, Phone, Globe, X, ChevronRight, Minus, Plus, ShoppingBag } from 'lucide-react';
import { mockRestaurants, mockMenuItems } from '../data/restaurants';

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, addItem, replaceCart, restaurant: cartRestaurant } = useCart();
  
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemQuantity, setItemQuantity] = useState(1);
  const [itemOptions, setItemOptions] = useState({});
  const [showCartConfirmModal, setShowCartConfirmModal] = useState(false);
  
  // Fetch restaurant data
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const foundRestaurant = mockRestaurants.find(r => r.id === id);
      
      if (foundRestaurant) {
        setRestaurant(foundRestaurant);
        
        // Fetch menu items
        const items = mockMenuItems[id] || [];
        setMenuItems(items);
        
        // Get unique categories
        if (items.length > 0) {
          setActiveCategory(items[0].category);
        }
      }
      
      setLoading(false);
    }, 500);
  }, [id]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!restaurant) {
    return (
      <div className="container-custom py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Restaurant not found</h2>
        <p className="mb-6 text-gray-600">The restaurant you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => navigate('/restaurants')} className="btn btn-primary">
          Browse Restaurants
        </button>
      </div>
    );
  }
  
  // Get unique categories from menu items
  const categories = [...new Set(menuItems.map(item => item.category))];
  
  // Filter menu items by active category
  const filteredItems = activeCategory 
    ? menuItems.filter(item => item.category === activeCategory)
    : menuItems;
  
  // Get popular items
  const popularItems = menuItems.filter(item => item.popular);
  
  // Handle category click
  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    
    // Scroll to category section
    const element = document.getElementById(`category-${category.replace(/\s+/g, '-').toLowerCase()}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Handle item click
  const handleItemClick = (item) => {
    setSelectedItem(item);
    setItemQuantity(1);
    
    // Initialize options
    const initialOptions = {};
    if (item.options) {
      item.options.forEach(option => {
        if (option.required && !option.multiSelect) {
          initialOptions[option.id] = option.choices[0].id;
        } else {
          initialOptions[option.id] = option.multiSelect ? [] : null;
        }
      });
    }
    setItemOptions(initialOptions);
  };
  
  // Close item modal
  const closeItemModal = () => {
    setSelectedItem(null);
    setItemOptions({});
  };
  
  // Handle option change
  const handleOptionChange = (optionId, choiceId, isMultiSelect) => {
    if (isMultiSelect) {
      const currentChoices = itemOptions[optionId] || [];
      
      if (currentChoices.includes(choiceId)) {
        // Remove choice
        setItemOptions({
          ...itemOptions,
          [optionId]: currentChoices.filter(id => id !== choiceId)
        });
      } else {
        // Add choice
        setItemOptions({
          ...itemOptions,
          [optionId]: [...currentChoices, choiceId]
        });
      }
    } else {
      // Single select
      setItemOptions({
        ...itemOptions,
        [optionId]: choiceId
      });
    }
  };
  
  // Calculate item total price including options
  const calculateItemTotal = () => {
    if (!selectedItem) return 0;
    
    let total = selectedItem.price;
    
    // Add option prices
    if (selectedItem.options) {
      selectedItem.options.forEach(option => {
        if (option.multiSelect) {
          // Multi-select options
          const selectedChoices = itemOptions[option.id] || [];
          selectedChoices.forEach(choiceId => {
            const choice = option.choices.find(c => c.id === choiceId);
            if (choice) {
              total += choice.price;
            }
          });
        } else {
          // Single-select option
          const choiceId = itemOptions[option.id];
          if (choiceId) {
            const choice = option.choices.find(c => c.id === choiceId);
            if (choice) {
              total += choice.price;
            }
          }
        }
      });
    }
    
    return (total * itemQuantity).toFixed(2);
  };
  
  // Add item to cart
  const addToCart = () => {
    // Format selected options for cart
    const formattedOptions = [];
    
    if (selectedItem?.options) {
      selectedItem.options.forEach(option => {
        if (option.multiSelect) {
          // Multi-select options
          const selectedChoices = itemOptions[option.id] || [];
          selectedChoices.forEach(choiceId => {
            const choice = option.choices.find(c => c.id === choiceId);
            if (choice) {
              formattedOptions.push({
                name: option.name,
                choice: choice.name,
                price: choice.price
              });
            }
          });
        } else {
          // Single-select option
          const choiceId = itemOptions[option.id];
          if (choiceId) {
            const choice = option.choices.find(c => c.id === choiceId);
            if (choice) {
              formattedOptions.push({
                name: option.name,
                choice: choice.name,
                price: choice.price
              });
            }
          }
        }
      });
    }
    
    // Prepare item for cart
    const cartItem = {
      id: selectedItem.id,
      name: selectedItem.name,
      price: selectedItem.price,
      quantity: itemQuantity,
      options: formattedOptions
    };
    
    // Check if cart has items from a different restaurant
    if (cart.length > 0 && cartRestaurant && cartRestaurant.id !== restaurant.id) {
      setShowCartConfirmModal(true);
    } else {
      // Add to cart
      addItem(restaurant, cartItem);
      closeItemModal();
    }
  };
  
  // Handle clearing cart and adding new item
  const handleReplaceCart = () => {
    replaceCart(restaurant, {
      id: selectedItem.id,
      name: selectedItem.name,
      price: selectedItem.price,
      quantity: itemQuantity,
      options: [] // You would need to format options here
    });
    setShowCartConfirmModal(false);
    closeItemModal();
  };
  
  return (
    <div>
      {/* Restaurant header */}
      <div className="relative h-64 md:h-80 bg-gray-900">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: `url(${restaurant.imageUrl})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900"></div>
        
        <div className="container-custom relative h-full flex flex-col justify-end pb-6">
          <div className="text-white mb-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{restaurant.name}</h1>
            <p className="text-lg opacity-90 mb-4">{restaurant.description}</p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center">
                <Star className="text-yellow-400 mr-1" size={18} />
                <span>{restaurant.rating}</span>
                <span className="mx-1">•</span>
                <span>{restaurant.reviewCount} reviews</span>
              </div>
              
              <div className="flex items-center">
                <DollarSign className="mr-1" size={18} />
                <span>{restaurant.priceRange}</span>
              </div>
              
              <div className="flex items-center">
                <Clock className="mr-1" size={18} />
                <span>{restaurant.deliveryTime}</span>
              </div>
              
              <div>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${restaurant.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {restaurant.isOpen ? 'Open Now' : 'Closed'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Restaurant info and menu */}
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar with categories */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-lg shadow-md p-4">
              <h3 className="font-bold text-lg mb-4">Menu Categories</h3>
              
              <div className="space-y-2">
                <button
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${activeCategory === null ? 'bg-primary bg-opacity-10 text-primary' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveCategory(null)}
                >
                  All Items
                </button>
                
                {categories.map(category => (
                  <button
                    key={category}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${activeCategory === category ? 'bg-primary bg-opacity-10 text-primary' : 'hover:bg-gray-100'}`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
              
              <div className="mt-6 border-t pt-6">
                <h3 className="font-bold text-lg mb-4">Restaurant Info</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex">
                    <MapPin size={18} className="text-gray-500 mr-2 flex-shrink-0 mt-1" />
                    <address className="not-italic">
                      {restaurant.address.street}<br />
                      {restaurant.address.city}, {restaurant.address.state} {restaurant.address.zipCode}
                    </address>
                  </div>
                  
                  <div className="flex">
                    <Phone size={18} className="text-gray-500 mr-2 flex-shrink-0" />
                    <span>{restaurant.phone}</span>
                  </div>
                  
                  <div className="flex">
                    <Globe size={18} className="text-gray-500 mr-2 flex-shrink-0" />
                    <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="text-primary">
                      Visit Website
                    </a>
                  </div>
                  
                  <div className="border-t pt-3 mt-3">
                    <h4 className="font-medium mb-2">Hours</h4>
                    <ul className="space-y-1 text-sm">
                      {Object.entries(restaurant.hours).map(([day, hours]) => (
                        <li key={day} className="flex justify-between">
                          <span className="capitalize">{day}</span>
                          <span>{hours}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Menu content */}
          <div className="lg:col-span-3">
            {/* Popular items section */}
            {popularItems.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Most Popular</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {popularItems.map(item => (
                    <div 
                      key={item.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
                      onClick={() => handleItemClick(item)}
                    >
                      <div className="flex h-28">
                        <div className="flex-1 p-3">
                          <h3 className="font-bold mb-1">{item.name}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                          <p className="mt-1 font-medium">${item.price.toFixed(2)}</p>
                        </div>
                        {item.imageUrl && (
                          <div className="w-28 h-28">
                            <img 
                              src={item.imageUrl} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Menu categories */}
            {activeCategory === null ? (
              // Show all categories
              categories.map(category => (
                <div key={category} id={`category-${category.replace(/\s+/g, '-').toLowerCase()}`} className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">{category}</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {menuItems
                      .filter(item => item.category === category)
                      .map(item => (
                        <div 
                          key={item.id}
                          className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
                          onClick={() => handleItemClick(item)}
                        >
                          <div className="flex h-28">
                            <div className="flex-1 p-3">
                              <h3 className="font-bold mb-1">{item.name}</h3>
                              <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                              <p className="mt-1 font-medium">${item.price.toFixed(2)}</p>
                            </div>
                            {item.imageUrl && (
                              <div className="w-28 h-28">
                                <img 
                                  src={item.imageUrl} 
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              ))
            ) : (
              // Show only active category
              <div>
                <h2 className="text-2xl font-bold mb-4">{activeCategory}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredItems.map(item => (
                    <div 
                      key={item.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
                      onClick={() => handleItemClick(item)}
                    >
                      <div className="flex h-28">
                        <div className="flex-1 p-3">
                          <h3 className="font-bold mb-1">{item.name}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                          <p className="mt-1 font-medium">${item.price.toFixed(2)}</p>
                        </div>
                        {item.imageUrl && (
                          <div className="w-28 h-28">
                            <img 
                              src={item.imageUrl} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Item detail modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              {selectedItem.imageUrl && (
                <img 
                  src={selectedItem.imageUrl} 
                  alt={selectedItem.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <button 
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                onClick={closeItemModal}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{selectedItem.name}</h2>
              <p className="text-gray-700 mb-4">{selectedItem.description}</p>
              <p className="text-xl font-medium mb-4">${selectedItem.price.toFixed(2)}</p>
              
              {/* Options */}
              {selectedItem.options && selectedItem.options.length > 0 && (
                <div className="mb-6 space-y-6">
                  {selectedItem.options.map(option => (
                    <div key={option.id}>
                      <div className="flex justify-between mb-2">
                        <h3 className="font-bold">{option.name}</h3>
                        {option.required && (
                          <span className="text-sm text-red-600">Required</span>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        {option.choices.map(choice => (
                          <label key={choice.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                            <div className="flex items-center">
                              <input 
                                type={option.multiSelect ? "checkbox" : "radio"}
                                name={option.id}
                                checked={
                                  option.multiSelect 
                                    ? (itemOptions[option.id] || []).includes(choice.id)
                                    : itemOptions[option.id] === choice.id
                                }
                                onChange={() => handleOptionChange(option.id, choice.id, option.multiSelect)}
                                className={`${option.multiSelect ? 'rounded' : 'rounded-full'} text-primary focus:ring-primary`}
                              />
                              <span className="ml-2">{choice.name}</span>
                            </div>
                            {choice.price > 0 && (
                              <span>+${choice.price.toFixed(2)}</span>
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Quantity */}
              <div className="flex items-center justify-between mb-6">
                <span className="font-medium">Quantity</span>
                <div className="flex items-center">
                  <button 
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
                    onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="mx-3 min-w-[20px] text-center">{itemQuantity}</span>
                  <button 
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
                    onClick={() => setItemQuantity(itemQuantity + 1)}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              
              {/* Total and add to cart */}
              <div className="flex items-center justify-between border-t pt-4">
                <span className="font-bold text-lg">Total: ${calculateItemTotal()}</span>
                <button 
                  className="btn btn-primary"
                  onClick={addToCart}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Cart confirm modal */}
      {showCartConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Replace Cart Items?</h3>
            <p className="mb-6">
              Your cart contains items from {cartRestaurant.name}. Adding items from {restaurant.name} will replace your current cart.
            </p>
            <div className="flex justify-end space-x-4">
              <button 
                className="btn bg-gray-200 hover:bg-gray-300 text-gray-800"
                onClick={() => setShowCartConfirmModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleReplaceCart}
              >
                Replace Cart
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Floating cart button */}
      {cart.length > 0 && (
        <div className="fixed bottom-8 right-8">
          <button 
            className="btn btn-primary rounded-full p-4 shadow-lg hover:shadow-xl transition-shadow flex items-center"
            onClick={() => navigate('/order')}
          >
            <ShoppingBag size={20} className="mr-2" />
            View Cart ({cart.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetailPage;