import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { mockOrders } from '../data/orders';
import { User, Mail, Phone, MapPin, CreditCard, ShoppingBag, Edit, Trash2, Plus, Check, X } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  
  // Get orders for the current user
  const userOrders = mockOrders.filter(order => order.userId === user.id);
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsEditing(false);
  };
  
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setEditedUser(user);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSaveProfile = () => {
    // In a real app, this would update the user's profile in the database
    // For now, we'll just toggle the editing state
    setIsEditing(false);
  };
  
  // Render the profile tab
  const renderProfileTab = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Personal Information</h2>
        {!isEditing ? (
          <button 
            className="flex items-center text-primary hover:underline"
            onClick={handleEditToggle}
          >
            <Edit size={18} className="mr-1" />
            Edit
          </button>
        ) : (
          <div className="flex space-x-2">
            <button 
              className="flex items-center text-green-600 hover:underline"
              onClick={handleSaveProfile}
            >
              <Check size={18} className="mr-1" />
              Save
            </button>
            <button 
              className="flex items-center text-gray-600 hover:underline"
              onClick={handleEditToggle}
            >
              <X size={18} className="mr-1" />
              Cancel
            </button>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        {!isEditing ? (
          <div className="space-y-4">
            <div className="flex items-start">
              <User size={20} className="text-gray-500 mr-3 mt-1" />
              <div>
                <div className="font-medium">Name</div>
                <div className="text-gray-600">{user.name}</div>
              </div>
            </div>
            
            <div className="flex items-start">
              <Mail size={20} className="text-gray-500 mr-3 mt-1" />
              <div>
                <div className="font-medium">Email</div>
                <div className="text-gray-600">{user.email}</div>
              </div>
            </div>
            
            <div className="flex items-start">
              <Phone size={20} className="text-gray-500 mr-3 mt-1" />
              <div>
                <div className="font-medium">Phone</div>
                <div className="text-gray-600">{user.phone}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={editedUser.name}
                onChange={handleInputChange}
                className="input"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={editedUser.email}
                onChange={handleInputChange}
                className="input"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={editedUser.phone}
                onChange={handleInputChange}
                className="input"
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Addresses section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Saved Addresses</h2>
          <button className="flex items-center text-primary hover:underline">
            <Plus size={18} className="mr-1" />
            Add Address
          </button>
        </div>
        
        {user.addresses && user.addresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.addresses.map(address => (
              <div key={address.id} className="bg-white rounded-lg shadow-md p-6 relative">
                <div className="absolute top-3 right-3 flex space-x-1">
                  <button className="text-gray-500 hover:text-gray-700">
                    <Edit size={16} />
                  </button>
                  <button className="text-gray-500 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="flex items-start mb-4">
                  <MapPin size={20} className="text-gray-500 mr-3 mt-1" />
                  <div>
                    <div className="font-medium flex items-center">
                      {address.name}
                      {address.isDefault && (
                        <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full">Default</span>
                      )}
                    </div>
                    <div className="text-gray-600 mt-1">
                      <div>{address.street}</div>
                      <div>{address.city}, {address.state} {address.zipCode}</div>
                    </div>
                  </div>
                </div>
                
                {!address.isDefault && (
                  <button className="text-primary text-sm hover:underline">
                    Set as default
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MapPin size={24} className="text-gray-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">No addresses saved yet</h3>
            <p className="text-gray-600 mb-4">Add an address to make ordering faster</p>
            <button className="btn btn-primary">
              Add Address
            </button>
          </div>
        )}
      </div>
      
      {/* Payment methods section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Payment Methods</h2>
          <button className="flex items-center text-primary hover:underline">
            <Plus size={18} className="mr-1" />
            Add Payment Method
          </button>
        </div>
        
        {user.paymentMethods && user.paymentMethods.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.paymentMethods.map(payment => (
              <div key={payment.id} className="bg-white rounded-lg shadow-md p-6 relative">
                <div className="absolute top-3 right-3 flex space-x-1">
                  <button className="text-gray-500 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="flex items-start">
                  <CreditCard size={20} className="text-gray-500 mr-3 mt-1" />
                  <div>
                    <div className="font-medium flex items-center">
                      Card ending in {payment.lastFour}
                      {payment.isDefault && (
                        <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full">Default</span>
                      )}
                    </div>
                    <div className="text-gray-600 mt-1">
                      Expires {payment.expiryMonth}/{payment.expiryYear}
                    </div>
                  </div>
                </div>
                
                {!payment.isDefault && (
                  <button className="text-primary text-sm hover:underline mt-4">
                    Set as default
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <CreditCard size={24} className="text-gray-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">No payment methods saved yet</h3>
            <p className="text-gray-600 mb-4">Add a payment method to make checkout faster</p>
            <button className="btn btn-primary">
              Add Payment Method
            </button>
          </div>
        )}
      </div>
    </div>
  );
  
  // Render the orders tab
  const renderOrdersTab = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">Order History</h2>
      
      {userOrders.length > 0 ? (
        <div className="space-y-6">
          {userOrders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="border-b p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="font-bold">Order #{order.id}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(order.placedAt).toLocaleDateString()} at {new Date(order.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'delivered' 
                      ? 'bg-green-100 text-green-800' 
                      : order.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status.replace('_', ' ').charAt(0).toUpperCase() + order.status.replace('_', ' ').slice(1)}
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <ShoppingBag size={16} className="mr-2" />
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)} items from {order.restaurantId}
                </div>
                
                <div className="text-sm">
                  <span className="font-medium">Total:</span> ${order.total.toFixed(2)}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 flex justify-between items-center">
                <button className="text-primary hover:underline">
                  View Details
                </button>
                
                {order.status === 'in_progress' && (
                  <button className="btn btn-primary text-sm py-1">
                    Track Order
                  </button>
                )}
                
                {order.status === 'delivered' && !order.rating && (
                  <button className="btn bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm py-1">
                    Leave Review
                  </button>
                )}
                
                {order.status === 'delivered' && order.rating && (
                  <div className="flex items-center">
                    <div className="mr-2 text-sm">Your rating:</div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          className={i < order.rating ? 'text-yellow-400' : 'text-gray-300'} 
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <ShoppingBag size={24} className="text-gray-500" />
          </div>
          <h3 className="text-lg font-medium mb-2">No orders yet</h3>
          <p className="text-gray-600 mb-4">When you place an order, it will appear here</p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.href = '/restaurants'}
          >
            Browse Restaurants
          </button>
        </div>
      )}
    </div>
  );
  
  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 bg-primary bg-opacity-10 rounded-full flex items-center justify-center text-primary text-xl font-bold mb-3">
                {user.name.charAt(0)}
              </div>
              <h2 className="font-bold text-lg">{user.name}</h2>
              <div className="text-sm text-gray-600">{user.email}</div>
            </div>
            
            <nav>
              <button
                className={`w-full text-left py-2 px-3 rounded-md transition-colors mb-1 ${activeTab === 'profile' ? 'bg-primary bg-opacity-10 text-primary font-medium' : 'hover:bg-gray-100'}`}
                onClick={() => handleTabChange('profile')}
              >
                Profile
              </button>
              <button
                className={`w-full text-left py-2 px-3 rounded-md transition-colors ${activeTab === 'orders' ? 'bg-primary bg-opacity-10 text-primary font-medium' : 'hover:bg-gray-100'}`}
                onClick={() => handleTabChange('orders')}
              >
                Order History
              </button>
            </nav>
          </div>
        </div>
        
        {/* Main content */}
        <div className="md:col-span-3">
          {activeTab === 'profile' ? renderProfileTab() : renderOrdersTab()}
        </div>
      </div>
    </div>
  );
};

const Star = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default ProfilePage;