import React, { useState } from 'react';

interface Restaurant {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  ownerName: string;
  ownerContact: string;
  status: 'pending' | 'accepted' | 'cancelled';
}

const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Pizza Palace',
    email: 'info@pizzapalace.com',
    phone: '123-456-7890',
    address: '123 Pizza St, NY',
    ownerName: 'John Doe',
    ownerContact: 'john@pizzapalace.com',
    status: 'pending'
  },
  {
    id: '2',
    name: 'Burger House',
    email: 'info@burgerhouse.com',
    phone: '123-456-7891',
    address: '456 Burger Ave, LA',
    ownerName: 'Jane Smith',
    ownerContact: 'jane@burgerhouse.com',
    status: 'accepted'
  }
];

const RestaurantRequests: React.FC = () => {
  const [restaurants] = useState<Restaurant[]>(mockRestaurants);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'accepted' | 'cancelled'>('all');

  const filteredRestaurants = restaurants.filter(restaurant => {
    if (activeTab === 'all') return true;
    return restaurant.status === activeTab;
  });

  const handleStatusChange = (restaurantId: string, newStatus: Restaurant['status']) => {
    // In a real app, this would make an API call to update the status
    console.log(`Updating status for restaurant ${restaurantId} to ${newStatus}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Restaurant Requests</h1>

        <div className="mt-4">
          <nav className="flex space-x-4" aria-label="Tabs">
            {['all', 'pending', 'accepted', 'cancelled'].map((tab) => (
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
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
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
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredRestaurants.map((restaurant) => (
                      <tr key={restaurant.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                          <div className="font-medium text-gray-900">{restaurant.name}</div>
                          <div className="text-gray-500">{restaurant.address}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div>{restaurant.email}</div>
                          <div>{restaurant.phone}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div>{restaurant.ownerName}</div>
                          <div>{restaurant.ownerContact}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            restaurant.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            restaurant.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {restaurant.status.charAt(0).toUpperCase() + restaurant.status.slice(1)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <select
                            value={restaurant.status}
                            onChange={(e) => handleStatusChange(restaurant.id, e.target.value as Restaurant['status'])}
                            className="rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="accepted">Accept</option>
                            <option value="cancelled">Cancel</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantRequests;