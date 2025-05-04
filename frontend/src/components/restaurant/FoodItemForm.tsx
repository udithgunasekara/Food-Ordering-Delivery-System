import React, { useEffect, useState } from 'react';
import { FoodItem } from '../../types';

interface FoodItemFormProps {
  onCancel: () => void;
}

interface SimplifiedItem {
  name: string;
  price: number;
  description: string | null;
  url: string | null;
}

interface MenuData {
  restaurantName: string;
  restId: string;
  items: SimplifiedItem[];
  itemCount: number;
}

const FoodItemForm: React.FC<FoodItemFormProps> = ({ onCancel }) => {
  // State for restaurant information
  const [restaurantInfo, setRestaurantInfo] = useState({
    restaurantName: '',
    restId: ''
  });

  // State for the current item being added
  const [currentItem, setCurrentItem] = useState<Partial<FoodItem>>({
    name: '',
    description: '',
    price: 0,
    category: '',
    isAvailable: true,
    imageUrl: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  });

  // State for the list of items added
  const [menuItems, setMenuItems] = useState<FoodItem[]>([]);
  
  // Status message for form submission
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load restaurant info from session storage
  useEffect(() => {
    const restaurantName = sessionStorage.getItem('restaurantName') || '';
    const restId = sessionStorage.getItem('restID') || '';
    
    setRestaurantInfo({
      restaurantName,
      restId
    });
    
    console.log('Restaurant Session Data:', {
      restaurantName,
      restId
    });
  }, []);

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setCurrentItem({
      ...currentItem,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : type === 'number' 
          ? parseFloat(value) 
          : value
    });
  };

  // Add the current item to the menu list
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate the item
    if (!currentItem.name || !currentItem.price) {
      setStatusMessage('Name and price are required');
      return;
    }
    
    // Add the current item to the menu items list
    setMenuItems([...menuItems, currentItem as FoodItem]);
    
    // Reset the form for the next item
    setCurrentItem({
      name: '',
      description: '',
      price: 0,
      category: '',
      isAvailable: true,
      imageUrl: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    });
    
    setStatusMessage('Item added successfully');
    
    // Clear status message after 3 seconds
    setTimeout(() => {
      setStatusMessage('');
    }, 3000);
  };

  // Remove an item from the menu items list
  const handleRemoveItem = (index: number) => {
    const updatedMenuItems = [...menuItems];
    updatedMenuItems.splice(index, 1);
    setMenuItems(updatedMenuItems);
  };

  // Submit the complete menu to the API
  const handleSubmitMenu = async () => {
    if (menuItems.length === 0) {
      setStatusMessage('Please add at least one item to the menu');
      return;
    }
    
    // Updated mapping to include description and url
    const simplifiedItems = menuItems.map(item => ({
      name: item.name,
      price: item.price,
      description: item.description || null,
      url: item.imageUrl || null
    }));
    
    // Create the menu data in the required format
    const menuData: MenuData = {
      restaurantName: restaurantInfo.restaurantName,
      restId: restaurantInfo.restId,
      items: simplifiedItems,
      itemCount: menuItems.length
    };
    
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:8080/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(menuData)
      });
      
      if (response.ok) {
        setStatusMessage('Menu submitted successfully');
        setMenuItems([]);
      } else {
        setStatusMessage('Failed to submit menu. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting menu:', error);
      setStatusMessage('Error submitting menu. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Add Menu Items</h2>
      
      {/* Restaurant Info */}
      <div className="mb-6 bg-gray-50 p-4 rounded-md">
        <h3 className="text-lg font-medium mb-2">Restaurant Information</h3>
        <p className="text-sm text-gray-700">Restaurant Name: <span className="font-medium">{restaurantInfo.restaurantName}</span></p>
        <p className="text-sm text-gray-700">Restaurant ID: <span className="font-medium">{restaurantInfo.restId}</span></p>
      </div>
      
      {/* Status message */}
      {statusMessage && (
        <div className={`mb-4 p-3 rounded-md ${statusMessage.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {statusMessage}
        </div>
      )}
      
      {/* Item Form */}
      <form onSubmit={handleAddItem} className="mb-8 border-b pb-6">
        <h3 className="text-lg font-medium mb-4">Add New Food Item</h3>
        
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={currentItem.name}
            onChange={handleItemChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={currentItem.description}
            onChange={handleItemChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={currentItem.price}
              onChange={handleItemChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={currentItem.category}
              onChange={handleItemChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="" disabled>Select Category</option>
              <option value="Appetizers">Appetizers</option>
              <option value="Main Course">Main Course</option>
              <option value="Desserts">Desserts</option>
              <option value="Drinks">Drinks</option>
              <option value="Sides">Sides</option>
              <option value="Specials">Specials</option>
            </select>
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={currentItem.imageUrl}
            onChange={handleItemChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isAvailable"
              checked={currentItem.isAvailable}
              onChange={handleItemChange}
              className="rounded text-orange-500 focus:ring-orange-500"
            />
            <span className="ml-2 text-sm text-gray-700">Available</span>
          </label>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            Add to Menu
          </button>
        </div>
      </form>
      
      {/* Menu Items List */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Menu Items ({menuItems.length})</h3>
        
        {menuItems.length === 0 ? (
          <p className="text-gray-500 italic">No items added yet. Use the form above to add items.</p>
        ) : (
          <div className="space-y-4">
            {menuItems.map((item, index) => (
              <div key={index} className="border rounded-md p-4 bg-gray-50 flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-gray-700">Price: ${item.price.toFixed(2)}</p>
                  {item.category && <p className="text-xs text-gray-500">Category: {item.category}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmitMenu}
          disabled={menuItems.length === 0 || isLoading}
          className={`px-4 py-2 ${menuItems.length === 0 ? 'bg-gray-400' : 'bg-orange-500 hover:bg-orange-600'} text-white rounded-md transition-colors`}
        >
          {isLoading ? 'Submitting...' : 'Submit Menu'}
        </button>
      </div>
    </div>
  );
};

export default FoodItemForm;