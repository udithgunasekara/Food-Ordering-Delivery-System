import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';// Update with correct import path

interface Restaurant {
  id: string;
  restaurantName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  ownerEmail: string;
  ownerFullName: string;
  ownerContact: string;
  latitude: string;
  longitude: string;
  status: string;
  requestedAt: string;
  modifiedAt: string | null;
}

const RestaurantRequests: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const { currentUser } = useAuth();

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/admin/all', {
        headers: {
          'Authorization': `Bearer ${currentUser?.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch restaurant requests');
      }

      const data = await response.json();
      setRestaurants(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      setError('Failed to load restaurant requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.token) {
      fetchRestaurants();
    }
  }, [currentUser]);

  const filteredRestaurants = restaurants.filter(restaurant => {
    if (activeTab === 'ALL') return true;
    return restaurant.status === activeTab;
  });

  const handleStatusChange = async (restaurantId: string, newStatus: string) => {
    try {
      // Skip API call if the status hasn't changed
      const currentRestaurant = restaurants.find(r => r.id === restaurantId);
      if (currentRestaurant?.status === newStatus) {
        return;
      }
      
      // Determine the API endpoint based on the selected action
      const endpoint = newStatus === 'APPROVED' 
        ? `http://localhost:8082/api/admin/approve/${restaurantId}`
        : `http://localhost:8082/api/admin/reject/${restaurantId}`;

      const response = await fetch(endpoint, {
        method: 'PUT', // Assuming PUT method for status update
        headers: {
          'Authorization': `Bearer ${currentUser?.token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to ${newStatus.toLowerCase()} restaurant`);
      }

      // Update the restaurant status locally for real-time UI update
      setRestaurants(prevRestaurants => 
        prevRestaurants.map(restaurant => 
          restaurant.id === restaurantId 
            ? { ...restaurant, status: newStatus, modifiedAt: new Date().toISOString() } 
            : restaurant
        )
      );
      
      // Show success message (optional)
      const action = newStatus === 'APPROVED' ? 'approved' : 'rejected';
      console.log(`Restaurant successfully ${action}`);
      
    } catch (error) {
      console.error(`Error updating restaurant status:`, error);
      setError(`Failed to update restaurant status. Please try again.`);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading restaurant requests...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">{error}</p>
        <button 
          onClick={fetchRestaurants}
          className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Restaurant Requests</h1>

        <div className="mt-4">
          <nav className="flex space-x-4" aria-label="Tabs">
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`
                  px-3 py-2 font-medium text-sm rounded-md
                  ${activeTab === tab
                    ? 'bg-orange-100 text-orange-700'
                    : 'text-gray-500 hover:text-gray-700'}
                `}
              >
                {tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                {filteredRestaurants.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                          Restaurant
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Contact
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Owner
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Status
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Request Date
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredRestaurants.map((restaurant) => (
                        <tr key={restaurant.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                            <div className="font-medium text-gray-900">{restaurant.restaurantName}</div>
                            <div className="text-gray-500">{restaurant.address}</div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div>{restaurant.contactEmail}</div>
                            <div>{restaurant.contactPhone}</div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div>{restaurant.ownerFullName}</div>
                            <div>{restaurant.ownerEmail}</div>
                            <div>{restaurant.ownerContact}</div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              restaurant.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                              restaurant.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {restaurant.status.charAt(0) + restaurant.status.slice(1).toLowerCase()}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {formatDate(restaurant.requestedAt)}
                            {restaurant.modifiedAt && (
                              <div className="text-xs text-gray-400">
                                Modified: {formatDate(restaurant.modifiedAt)}
                              </div>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            {restaurant.status === 'PENDING' && (
                              <select
                                onChange={(e) => handleStatusChange(restaurant.id, e.target.value)}
                                className="rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                defaultValue=""
                              >
                                <option value="" disabled>Select action</option>
                                <option value="APPROVED">Approve</option>
                                <option value="REJECTED">Reject</option>
                              </select>
                            )}
                            {restaurant.status === 'REJECTED' && (
                              <select
                                onChange={(e) => handleStatusChange(restaurant.id, e.target.value)}
                                className="rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                defaultValue="REJECTED"
                              >
                                <option value="REJECTED">Rejected</option>
                                <option value="APPROVED">Approve</option>
                              </select>
                            )}
                            {restaurant.status === 'APPROVED' && (
                              <span className="text-gray-500 italic">
                                Approved
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    No restaurant requests found for the selected status.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantRequests;