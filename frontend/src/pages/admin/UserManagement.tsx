import React, { useState,useEffect } from 'react';
import { Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  latitude: string | null;
  longitude: string | null;
  roles: string[];
}


const availableRoles = [
  'ROLE_SYSADMIN',
  'ROLE_CUSTOMER',
  'ROLE_RESTAURANT_ADMIN',
  'ROLE_DELIVERY_AGENT'
];

const UserManagement: React.FC = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modifiedUsers, setModifiedUsers] = useState<Record<string, string[]>>({});


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = currentUser?.token;
        
        if (!token) {
          setError('Authentication token not found');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:8080/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Error fetching users: ${response.status}`);
        }

        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.firstName + ' ' + user.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.roles.includes(roleFilter);
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = (userId: string, role: string, checked: boolean) => {
    setModifiedUsers(prev => {
      const currentRoles = prev[userId] || [...users.find(u => u.id === userId)?.roles || []];
      let updatedRoles;
      
      if (checked && !currentRoles.includes(role)) {
        updatedRoles = [...currentRoles, role];
      } else if (!checked && currentRoles.includes(role)) {
        updatedRoles = currentRoles.filter(r => r !== role);
      } else {
        updatedRoles = currentRoles;
      }
      
      return {
        ...prev,
        [userId]: updatedRoles
      };
    });
  };

  const hasRoleChanged = (userId: string) => {
    if (!modifiedUsers[userId]) return false;

    const originalUser = users.find(u => u.id === userId);
    if (!originalUser) return false;

    const originalRoles = originalUser.roles;
    const modifiedRoles = modifiedUsers[userId];

    if (originalRoles.length !== modifiedRoles.length) return true;
    
    return !originalRoles.every(role => modifiedRoles.includes(role)) || 
           !modifiedRoles.every(role => originalRoles.includes(role));
  };

  const saveUserRoles = async (userId: string) => {
    if (!modifiedUsers[userId]) return;

    try {
      const token = currentUser?.token;
      
      if (!token) {
        setError('Authentication token not found');
        return;
      }

      const response = await fetch(`http://localhost:8080/api/users/${userId}/roles`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(modifiedUsers[userId])
      });

      if (!response.ok) {
        throw new Error(`Error updating roles: ${response.status}`);
      }

      // Update the local users state to reflect the changes
      setUsers(prev => prev.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            roles: modifiedUsers[userId]
          };
        }
        return user;
      }));

      // Clear the modified state for this user
      setModifiedUsers(prev => {
        const newState = { ...prev };
        delete newState[userId];
        return newState;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user roles');
    }
  };

  const isRoleChecked = (userId: string, role: string) => {
    if (modifiedUsers[userId]) {
      return modifiedUsers[userId].includes(role);
    }
    return users.find(u => u.id === userId)?.roles.includes(role) || false;
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading users...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>

        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2"
          >
            <option value="all">All Roles</option>
            {availableRoles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                        User ID
                      </th>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                        Name
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Contact
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Address
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Roles
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500">
                          {user.id}
                        </td>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                          <div className="font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                          <div className="text-gray-500">{user.username}</div>
                          <div className="text-gray-500">{user.email}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div>{user.phone}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div>{user.address}</div>
                          <div>{`${user.city}, ${user.state} ${user.zip}`}</div>
                          <div>{user.country}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="space-y-1">
                            {availableRoles.map(role => (
                              <label key={role} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={isRoleChecked(user.id, role)}
                                  onChange={(e) => handleRoleChange(user.id, role, e.target.checked)}
                                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                />
                                <span className="ml-2 text-sm text-gray-600">{role}</span>
                              </label>
                            ))}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          {hasRoleChanged(user.id) && (
                            <button
                              onClick={() => saveUserRoles(user.id)}
                              className="bg-orange-500 hover:bg-orange-600 text-white py-1 px-3 rounded-md text-sm"
                            >
                              Save Roles
                            </button>
                          )}
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

export default UserManagement;