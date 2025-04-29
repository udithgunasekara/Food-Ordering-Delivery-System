import React, { useState, useEffect } from 'react';
import { mockUsers } from '../../data/users';
import { Search, Filter, ChevronDown, User, Mail, Phone, Edit, Trash2, Plus, Check, X, AlertCircle } from 'lucide-react';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // New user form data
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'ROLE_CUSTOMER'
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  
  // Load users
  useEffect(() => {
    // In a real app, this would be an API call
    setUsers(mockUsers);
  }, []);
  
  // Filter users based on search term and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone && user.phone.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = selectedRole ? user.role === selectedRole : true;
    
    return matchesSearch && matchesRole;
  });
  
  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };
  
  // Handle role filter change
  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setCurrentPage(1); // Reset to first page on new filter
  };
  
  // Toggle filter panel
  const toggleFilterPanel = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  };
  
  // Handle user form input change
  const handleUserFormChange = (e) => {
    const { name, value } = e.target;
    setUserForm({
      ...userForm,
      [name]: value
    });
  };
  
  // Handle adding new user
  const handleAddUser = () => {
    setIsAddingUser(true);
    setUserForm({
      name: '',
      email: '',
      phone: '',
      role: 'ROLE_CUSTOMER'
    });
  };
  
  // Handle editing user
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role
    });
    setIsEditingUser(true);
  };
  
  // Handle delete user click
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };
  
  // Handle confirming delete
  const handleConfirmDelete = () => {
    // In a real app, this would be an API call
    setUsers(users.filter(user => user.id !== selectedUser.id));
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
    
    // Show success message
    setSuccessMessage(`User ${selectedUser.name} has been deleted.`);
    // Clear message after 3 seconds
    setTimeout(() => setSuccessMessage(''), 3000);
  };
  
  // Handle submitting user form (add or edit)
  const handleSubmitUserForm = (e) => {
    e.preventDefault();
    
    if (isAddingUser) {
      // In a real app, this would be an API call to create a user
      const newUser = {
        id: `user-${Date.now()}`,
        ...userForm
      };
      
      setUsers([...users, newUser]);
      setIsAddingUser(false);
      
      // Show success message
      setSuccessMessage(`User ${newUser.name} has been added.`);
    } else if (isEditingUser) {
      // In a real app, this would be an API call to update a user
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id ? { ...user, ...userForm } : user
      );
      
      setUsers(updatedUsers);
      setIsEditingUser(false);
      setSelectedUser(null);
      
      // Show success message
      setSuccessMessage(`User ${userForm.name} has been updated.`);
    }
    
    // Clear message after 3 seconds
    setTimeout(() => setSuccessMessage(''), 3000);
  };
  
  // Close modals and forms
  const handleCloseForm = () => {
    setIsAddingUser(false);
    setIsEditingUser(false);
    setSelectedUser(null);
  };
  
  // Format user role for display
  const formatRole = (role) => {
    return role
      .replace('ROLE_', '')
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">User Management</h1>
      <p className="text-gray-600 mb-8">Manage users, roles, and permissions</p>
      
      {/* Success message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-start">
          <Check size={20} className="text-green-500 mr-3 mt-0.5 flex-shrink-0" />
          <span className="text-green-700">{successMessage}</span>
        </div>
      )}
      
      {/* Error message */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start">
          <AlertCircle size={20} className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
          <span className="text-red-700">{errorMessage}</span>
        </div>
      )}
      
      {/* Search and filter bar */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search users by name, email, or phone..."
              className="input pl-10"
            />
          </div>
          <button
            className={`flex items-center px-4 py-2 border rounded-md ${isFilterPanelOpen ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300'}`}
            onClick={toggleFilterPanel}
          >
            <Filter size={20} className="mr-2" />
            Filters
            <ChevronDown size={18} className={`ml-2 transition-transform ${isFilterPanelOpen ? 'rotate-180' : ''}`} />
          </button>
          <button
            className="btn btn-primary"
            onClick={handleAddUser}
          >
            <Plus size={18} className="mr-1" />
            Add User
          </button>
        </div>
        
        {/* Expanded filter panel */}
        {isFilterPanelOpen && (
          <div className="bg-white p-6 rounded-md shadow-md mb-6 animate-fade-in">
            <h3 className="font-medium mb-4">Filter by Role</h3>
            <div className="space-y-2">
              <button
                className={`w-full text-left px-3 py-2 rounded-md ${selectedRole === '' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                onClick={() => handleRoleChange('')}
              >
                All Roles
              </button>
              <button
                className={`w-full text-left px-3 py-2 rounded-md ${selectedRole === 'ROLE_CUSTOMER' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                onClick={() => handleRoleChange('ROLE_CUSTOMER')}
              >
                Customers
              </button>
              <button
                className={`w-full text-left px-3 py-2 rounded-md ${selectedRole === 'ROLE_RESTAURANT_ADMIN' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                onClick={() => handleRoleChange('ROLE_RESTAURANT_ADMIN')}
              >
                Restaurant Owners
              </button>
              <button
                className={`w-full text-left px-3 py-2 rounded-md ${selectedRole === 'ROLE_SYSADMIN' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                onClick={() => handleRoleChange('ROLE_SYSADMIN')}
              >
                System Admins
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Users table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User size={20} className="text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <Mail size={16} className="text-gray-400 mr-2" />
                      {user.email}
                    </div>
                    {user.phone && (
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Phone size={16} className="text-gray-400 mr-2" />
                        {user.phone}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'ROLE_SYSADMIN' 
                        ? 'bg-red-100 text-red-800' 
                        : user.role === 'ROLE_RESTAURANT_ADMIN'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {formatRole(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button 
                        className="text-gray-500 hover:text-primary"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        className="text-gray-500 hover:text-red-500"
                        onClick={() => handleDeleteClick(user)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {currentUsers.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    No users found with the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredUsers.length > usersPerPage && (
          <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
            </div>
            <div className="flex space-x-2">
              <button
                className="px-3 py-1 border rounded-md bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }).map((_, i) => (
                <button
                  key={i}
                  className={`px-3 py-1 border rounded-md ${currentPage === i + 1 ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
                  onClick={() => paginate(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="px-3 py-1 border rounded-md bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Add/Edit user modal */}
      {(isAddingUser || isEditingUser) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {isAddingUser ? 'Add New User' : 'Edit User'}
                </h2>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={handleCloseForm}
                >
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmitUserForm}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={userForm.name}
                        onChange={handleUserFormChange}
                        className="input pl-10"
                        placeholder="Full Name"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={userForm.email}
                        onChange={handleUserFormChange}
                        className="input pl-10"
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={userForm.phone}
                        onChange={handleUserFormChange}
                        className="input pl-10"
                        placeholder="(123) 456-7890"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="role" className="block text-gray-700 font-medium mb-2">Role</label>
                    <select
                      id="role"
                      name="role"
                      value={userForm.role}
                      onChange={handleUserFormChange}
                      className="input"
                      required
                    >
                      <option value="ROLE_CUSTOMER">Customer</option>
                      <option value="ROLE_RESTAURANT_ADMIN">Restaurant Owner</option>
                      <option value="ROLE_SYSADMIN">System Admin</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    className="btn bg-gray-200 hover:bg-gray-300 text-gray-800"
                    onClick={handleCloseForm}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    {isAddingUser ? 'Add User' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete confirmation modal */}
      {isDeleteModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete the user <span className="font-semibold">{selectedUser.name}</span>? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                className="btn bg-gray-200 hover:bg-gray-300 text-gray-800"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="btn bg-red-600 hover:bg-red-700 text-white"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;