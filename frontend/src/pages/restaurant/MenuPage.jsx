import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { mockRestaurants, mockMenuItems } from '../../data/restaurants';
import { Edit2, Trash2, Plus, X, Image, DollarSign, Tag, Info, ChevronDown, ChevronUp } from 'lucide-react';

const MenuPage = () => {
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  
  // For new/edit item form
  const [itemForm, setItemForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    popular: false,
    options: []
  });
  
  // Load restaurant data
  useEffect(() => {
    // Find restaurant owned by current user
    const foundRestaurant = mockRestaurants.find(r => r.ownerId === user.id);
    
    if (foundRestaurant) {
      setRestaurant(foundRestaurant);
      
      // Get menu items for this restaurant
      const items = mockMenuItems[foundRestaurant.id] || [];
      setMenuItems(items);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(items.map(item => item.category))];
      setCategories(uniqueCategories);
      
      if (uniqueCategories.length > 0) {
        setActiveCategory(uniqueCategories[0]);
      }
    }
  }, [user.id]);
  
  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };
  
  // Handle edit item
  const handleEditItem = (item) => {
    setSelectedItem(item);
    setItemForm({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      imageUrl: item.imageUrl || '',
      popular: item.popular || false,
      options: item.options || []
    });
    setIsAddingItem(true);
  };
  
  // Handle delete item
  const handleDeleteItem = (itemId) => {
    // In a real app, this would delete from the database
    // For now, we'll just filter it out of our state
    setMenuItems(menuItems.filter(item => item.id !== itemId));
  };
  
  // Handle adding new item
  const handleAddItem = () => {
    setSelectedItem(null);
    setItemForm({
      name: '',
      description: '',
      price: '',
      category: activeCategory || '',
      imageUrl: '',
      popular: false,
      options: []
    });
    setIsAddingItem(true);
  };
  
  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setItemForm({
      ...itemForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle adding a new option to the item
  const handleAddOption = () => {
    setItemForm({
      ...itemForm,
      options: [
        ...itemForm.options,
        {
          id: `option-${Date.now()}`,
          name: '',
          required: false,
          multiSelect: false,
          choices: [
            {
              id: `choice-${Date.now()}-1`,
              name: '',
              price: 0
            }
          ]
        }
      ]
    });
  };
  
  // Handle option input change
  const handleOptionChange = (index, field, value) => {
    const updatedOptions = [...itemForm.options];
    updatedOptions[index] = { ...updatedOptions[index], [field]: value };
    setItemForm({ ...itemForm, options: updatedOptions });
  };
  
  // Handle adding a new choice to an option
  const handleAddChoice = (optionIndex) => {
    const updatedOptions = [...itemForm.options];
    updatedOptions[optionIndex].choices.push({
      id: `choice-${Date.now()}-${updatedOptions[optionIndex].choices.length + 1}`,
      name: '',
      price: 0
    });
    setItemForm({ ...itemForm, options: updatedOptions });
  };
  
  // Handle choice input change
  const handleChoiceChange = (optionIndex, choiceIndex, field, value) => {
    const updatedOptions = [...itemForm.options];
    updatedOptions[optionIndex].choices[choiceIndex] = {
      ...updatedOptions[optionIndex].choices[choiceIndex],
      [field]: field === 'price' ? parseFloat(value) || 0 : value
    };
    setItemForm({ ...itemForm, options: updatedOptions });
  };
  
  // Handle removing an option
  const handleRemoveOption = (optionIndex) => {
    const updatedOptions = [...itemForm.options];
    updatedOptions.splice(optionIndex, 1);
    setItemForm({ ...itemForm, options: updatedOptions });
  };
  
  // Handle removing a choice
  const handleRemoveChoice = (optionIndex, choiceIndex) => {
    const updatedOptions = [...itemForm.options];
    updatedOptions[optionIndex].choices.splice(choiceIndex, 1);
    setItemForm({ ...itemForm, options: updatedOptions });
  };
  
  // Handle form submission
  const handleSubmitItem = (e) => {
    e.preventDefault();
    
    const newItem = {
      id: selectedItem ? selectedItem.id : `item-${Date.now()}`,
      name: itemForm.name,
      description: itemForm.description,
      price: parseFloat(itemForm.price),
      category: itemForm.category,
      imageUrl: itemForm.imageUrl,
      popular: itemForm.popular,
      options: itemForm.options
    };
    
    if (selectedItem) {
      // Update existing item
      setMenuItems(menuItems.map(item => 
        item.id === selectedItem.id ? newItem : item
      ));
    } else {
      // Add new item
      setMenuItems([...menuItems, newItem]);
      
      // Add new category if it doesn't exist
      if (!categories.includes(itemForm.category)) {
        setCategories([...categories, itemForm.category]);
      }
    }
    
    // Close the form
    setIsAddingItem(false);
    setSelectedItem(null);
  };
  
  // Handle adding new category
  const handleAddCategory = () => {
    setIsAddingCategory(true);
  };
  
  // Handle submitting new category
  const handleSubmitCategory = (e) => {
    e.preventDefault();
    
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setActiveCategory(newCategory);
      setNewCategory('');
    }
    
    setIsAddingCategory(false);
  };
  
  if (!restaurant) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">No Restaurant Found</h2>
        <p className="text-gray-600 mb-6">You don't have a restaurant associated with your account.</p>
        <a href="/restaurant/register" className="btn btn-primary">
          Register a Restaurant
        </a>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Menu Management</h1>
      <p className="text-gray-600 mb-8">Manage your restaurant's menu items</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Categories sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">Categories</h2>
              <button 
                className="text-primary hover:text-primary-dark"
                onClick={handleAddCategory}
              >
                <Plus size={20} />
              </button>
            </div>
            
            {isAddingCategory ? (
              <form onSubmit={handleSubmitCategory} className="mb-4">
                <div className="flex items-center mb-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Category name"
                    className="input flex-grow mr-2"
                    required
                  />
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setIsAddingCategory(false)}
                  >
                    <X size={20} />
                  </button>
                </div>
                <button type="submit" className="btn btn-primary w-full">Add</button>
              </form>
            ) : null}
            
            <div className="space-y-1">
              <button
                className={`w-full text-left px-3 py-2 rounded-md ${!activeCategory ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                onClick={() => handleCategoryChange(null)}
              >
                All Items
              </button>
              
              {categories.map(category => (
                <button
                  key={category}
                  className={`w-full text-left px-3 py-2 rounded-md ${activeCategory === category ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Menu items */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                {activeCategory ? `${activeCategory} Items` : 'All Menu Items'}
              </h2>
              <button 
                className="btn btn-primary"
                onClick={handleAddItem}
              >
                <Plus size={18} className="mr-1" />
                Add Item
              </button>
            </div>
            
            {/* Item list */}
            <div className="space-y-4">
              {menuItems
                .filter(item => !activeCategory || item.category === activeCategory)
                .map(item => (
                  <div key={item.id} className="border rounded-lg overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      {item.imageUrl && (
                        <div className="md:w-1/4 h-40 md:h-auto">
                          <img 
                            src={item.imageUrl} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className={`p-4 flex-grow ${item.imageUrl ? 'md:w-3/4' : 'w-full'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-lg">{item.name}</h3>
                            <p className="text-gray-600 mb-2">{item.description}</p>
                            <div className="flex items-center text-gray-800 font-medium">
                              ${item.price.toFixed(2)}
                              {item.popular && (
                                <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Popular</span>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              className="text-gray-500 hover:text-primary"
                              onClick={() => handleEditItem(item)}
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              className="text-gray-500 hover:text-red-500"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                        
                        {item.options && item.options.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-sm font-medium mb-1">Options:</p>
                            <div className="space-y-1 text-sm text-gray-600">
                              {item.options.map(option => (
                                <div key={option.id}>
                                  <span className="font-medium">{option.name}</span>
                                  {option.required && <span className="ml-1 text-xs text-red-600">(Required)</span>}
                                  <span className="ml-1 text-xs">
                                    ({option.multiSelect ? 'Multiple choice' : 'Single choice'})
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              
              {menuItems.filter(item => !activeCategory || item.category === activeCategory).length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Plus size={24} className="text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No menu items</h3>
                  <p className="text-gray-600 mb-4">
                    {activeCategory 
                      ? `You don't have any items in the ${activeCategory} category yet.` 
                      : "You don't have any menu items yet."}
                  </p>
                  <button className="btn btn-primary" onClick={handleAddItem}>
                    Add Item
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Add/Edit item modal */}
      {isAddingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {selectedItem ? 'Edit Menu Item' : 'Add Menu Item'}
                </h2>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setIsAddingItem(false)}
                >
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmitItem}>
                {/* Basic info section */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4">Basic Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Item Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={itemForm.name}
                        onChange={handleInputChange}
                        className="input"
                        placeholder="e.g. Classic Burger"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="price" className="block text-gray-700 font-medium mb-2">Price</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign size={18} className="text-gray-400" />
                        </div>
                        <input
                          type="number"
                          id="price"
                          name="price"
                          value={itemForm.price}
                          onChange={handleInputChange}
                          step="0.01"
                          min="0"
                          className="input pl-8"
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={itemForm.description}
                      onChange={handleInputChange}
                      className="input h-24 resize-none"
                      placeholder="Describe your item..."
                      required
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="category" className="block text-gray-700 font-medium mb-2">Category</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Tag size={18} className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="category"
                          name="category"
                          value={itemForm.category}
                          onChange={handleInputChange}
                          className="input pl-8"
                          placeholder="e.g. Burgers, Desserts"
                          list="categories"
                          required
                        />
                        <datalist id="categories">
                          {categories.map(category => (
                            <option key={category} value={category} />
                          ))}
                        </datalist>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Select existing or type new category</p>
                    </div>
                    
                    <div>
                      <label htmlFor="imageUrl" className="block text-gray-700 font-medium mb-2">Image URL</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Image size={18} className="text-gray-400" />
                        </div>
                        <input
                          type="url"
                          id="imageUrl"
                          name="imageUrl"
                          value={itemForm.imageUrl}
                          onChange={handleInputChange}
                          className="input pl-8"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="popular"
                      name="popular"
                      checked={itemForm.popular}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <label htmlFor="popular" className="ml-2 block text-gray-700">
                      Mark as popular item
                    </label>
                  </div>
                </div>
                
                {/* Options section */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Options & Add-ons</h3>
                    <button 
                      type="button"
                      className="text-primary hover:underline flex items-center"
                      onClick={handleAddOption}
                    >
                      <Plus size={16} className="mr-1" />
                      Add Option
                    </button>
                  </div>
                  
                  {itemForm.options.length === 0 ? (
                    <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                      <Info size={24} className="text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">No options added yet.</p>
                      <p className="text-sm text-gray-500 mt-1">Options like "Size", "Toppings", etc.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {itemForm.options.map((option, optionIndex) => (
                        <div key={option.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div className="w-full">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <label className="block text-gray-700 font-medium mb-2">Option Name</label>
                                  <input
                                    type="text"
                                    value={option.name}
                                    onChange={(e) => handleOptionChange(optionIndex, 'name', e.target.value)}
                                    className="input"
                                    placeholder="e.g. Size, Toppings"
                                    required
                                  />
                                </div>
                                
                                <div className="flex items-center space-x-4 h-full pt-8">
                                  <label className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={option.required}
                                      onChange={(e) => handleOptionChange(optionIndex, 'required', e.target.checked)}
                                      className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                                    />
                                    <span className="ml-2 text-gray-700">Required</span>
                                  </label>
                                  
                                  <label className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={option.multiSelect}
                                      onChange={(e) => handleOptionChange(optionIndex, 'multiSelect', e.target.checked)}
                                      className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                                    />
                                    <span className="ml-2 text-gray-700">Multi-select</span>
                                  </label>
                                </div>
                              </div>
                              
                              <div>
                                <div className="flex justify-between items-center mb-2">
                                  <h4 className="font-medium">Choices</h4>
                                  <button 
                                    type="button"
                                    className="text-primary hover:underline text-sm flex items-center"
                                    onClick={() => handleAddChoice(optionIndex)}
                                  >
                                    <Plus size={14} className="mr-1" />
                                    Add Choice
                                  </button>
                                </div>
                                
                                <div className="space-y-3">
                                  {option.choices.map((choice, choiceIndex) => (
                                    <div key={choice.id} className="flex items-center space-x-2">
                                      <input
                                        type="text"
                                        value={choice.name}
                                        onChange={(e) => handleChoiceChange(optionIndex, choiceIndex, 'name', e.target.value)}
                                        className="input flex-grow"
                                        placeholder="Choice name"
                                        required
                                      />
                                      
                                      <div className="relative w-32">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                          <DollarSign size={16} className="text-gray-400" />
                                        </div>
                                        <input
                                          type="number"
                                          value={choice.price}
                                          onChange={(e) => handleChoiceChange(optionIndex, choiceIndex, 'price', e.target.value)}
                                          step="0.01"
                                          min="0"
                                          className="input pl-7"
                                          placeholder="0.00"
                                        />
                                      </div>
                                      
                                      <button 
                                        type="button" 
                                        className="text-gray-500 hover:text-red-500"
                                        onClick={() => handleRemoveChoice(optionIndex, choiceIndex)}
                                        disabled={option.choices.length <= 1}
                                      >
                                        <Trash2 size={18} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            <button 
                              type="button" 
                              className="ml-4 text-gray-500 hover:text-red-500 flex-shrink-0"
                              onClick={() => handleRemoveOption(optionIndex)}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-4 border-t pt-4">
                  <button
                    type="button"
                    className="btn bg-gray-200 hover:bg-gray-300 text-gray-800"
                    onClick={() => setIsAddingItem(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    {selectedItem ? 'Save Changes' : 'Add Item'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;