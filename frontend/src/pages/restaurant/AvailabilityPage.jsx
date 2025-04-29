import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { mockRestaurants } from '../../data/restaurants';
import { Clock, Check, X, AlarmClock, Edit2, Save } from 'lucide-react';

const AvailabilityPage = () => {
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState({});
  const [editingDay, setEditingDay] = useState(null);
  const [temporaryHours, setTemporaryHours] = useState({ open: '', close: '' });
  
  // Load restaurant data
  useEffect(() => {
    // Find restaurant owned by current user
    const foundRestaurant = mockRestaurants.find(r => r.ownerId === user.id);
    
    if (foundRestaurant) {
      setRestaurant(foundRestaurant);
      setIsOpen(foundRestaurant.isOpen);
      setHours(foundRestaurant.hours);
    }
  }, [user.id]);
  
  // Toggle restaurant open/closed status
  const toggleOpenStatus = () => {
    setIsOpen(!isOpen);
    
    // In a real app, this would update the database
    // setRestaurant({ ...restaurant, isOpen: !isOpen });
  };
  
  // Handle editing hours for a specific day
  const handleEditDay = (day) => {
    const currentHours = hours[day];
    if (currentHours) {
      // Parse current hours
      const [openTime, closeTime] = currentHours.split(' - ');
      setTemporaryHours({
        open: convertTo24Hour(openTime),
        close: convertTo24Hour(closeTime)
      });
    } else {
      setTemporaryHours({ open: '09:00', close: '17:00' });
    }
    setEditingDay(day);
  };
  
  // Convert 12-hour format to 24-hour format
  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (hours === '12') {
      hours = '00';
    }
    
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    
    return `${hours.padStart(2, '0')}:${minutes}`;
  };
  
  // Convert 24-hour format to 12-hour format
  const convertTo12Hour = (time24h) => {
    const [hours, minutes] = time24h.split(':');
    const hour = parseInt(hours, 10);
    
    return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
  };
  
  // Handle temporary hours change
  const handleHoursChange = (field, value) => {
    setTemporaryHours({
      ...temporaryHours,
      [field]: value
    });
  };
  
  // Save updated hours
  const saveHours = () => {
    const formattedOpen = convertTo12Hour(temporaryHours.open);
    const formattedClose = convertTo12Hour(temporaryHours.close);
    
    setHours({
      ...hours,
      [editingDay]: `${formattedOpen} - ${formattedClose}`
    });
    
    setEditingDay(null);
  };
  
  // Cancel editing
  const cancelEdit = () => {
    setEditingDay(null);
  };
  
  // Format day for display
  const formatDay = (day) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
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
      <h1 className="text-3xl font-bold mb-2">Availability Management</h1>
      <p className="text-gray-600 mb-8">Control your restaurant's operating hours and availability</p>
      
      {/* Open/Closed toggle */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold mb-2">Restaurant Status</h2>
            <p className="text-gray-600">Toggle your restaurant's availability to customers</p>
          </div>
          
          <div className="flex items-center">
            <span className={`mr-3 font-medium ${isOpen ? 'text-green-600' : 'text-red-600'}`}>
              {isOpen ? 'Open' : 'Closed'}
            </span>
            <label className="inline-flex items-center cursor-pointer">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={isOpen}
                  onChange={toggleOpenStatus}
                />
                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary peer-focus:ring-opacity-20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
              </div>
            </label>
          </div>
        </div>
      </div>
      
      {/* Business hours */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">Business Hours</h2>
        
        <div className="space-y-4">
          {Object.keys(hours).map(day => (
            <div 
              key={day} 
              className={`p-4 border rounded-lg flex justify-between items-center ${editingDay === day ? 'border-primary bg-primary bg-opacity-5' : ''}`}
            >
              {editingDay !== day ? (
                <>
                  <div className="flex items-center">
                    <Clock size={20} className="text-gray-500 mr-3" />
                    <div>
                      <p className="font-medium">{formatDay(day)}</p>
                      <p className="text-gray-600">{hours[day]}</p>
                    </div>
                  </div>
                  
                  <button 
                    className="text-primary hover:text-primary-dark"
                    onClick={() => handleEditDay(day)}
                  >
                    <Edit2 size={18} />
                  </button>
                </>
              ) : (
                <div className="w-full">
                  <div className="flex justify-between items-center mb-4">
                    <p className="font-medium">{formatDay(day)}</p>
                    <div className="flex space-x-2">
                      <button 
                        className="text-green-600 hover:text-green-700"
                        onClick={saveHours}
                      >
                        <Save size={18} />
                      </button>
                      <button 
                        className="text-gray-500 hover:text-gray-700"
                        onClick={cancelEdit}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Opening Time</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <AlarmClock size={16} className="text-gray-400" />
                        </div>
                        <input
                          type="time"
                          value={temporaryHours.open}
                          onChange={(e) => handleHoursChange('open', e.target.value)}
                          className="input pl-9"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Closing Time</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <AlarmClock size={16} className="text-gray-400" />
                        </div>
                        <input
                          type="time"
                          value={temporaryHours.close}
                          onChange={(e) => handleHoursChange('close', e.target.value)}
                          className="input pl-9"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Special hours & closures */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Special Closures</h2>
          <button className="btn btn-primary">
            Add Special Closure
          </button>
        </div>
        
        <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <AlarmClock size={24} className="text-gray-500" />
          </div>
          <h3 className="text-lg font-medium mb-1">No special closures</h3>
          <p className="text-gray-600 mb-4">
            Add special closures for holidays or other events
          </p>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityPage;