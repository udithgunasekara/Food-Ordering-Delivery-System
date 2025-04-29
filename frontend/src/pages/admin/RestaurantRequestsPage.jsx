import React, { useState, useEffect } from 'react';
import { mockRestaurantRequests } from '../../data/restaurants';
import { Search, Filter, ChevronDown, Check, X, AlertCircle, FileText, Eye, ArrowUp, ArrowDown } from 'lucide-react';

const RestaurantRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isRequestDetailsOpen, setIsRequestDetailsOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Load requests
  useEffect(() => {
    // In a real app, this would be an API call
    setRequests(mockRestaurantRequests);
  }, []);
  
  // Filter requests based on search term and status
  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.ownerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus ? request.status === selectedStatus : true;
    
    return matchesSearch && matchesStatus;
  });
  
  // Sort requests
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.submissionDate);
      const dateB = new Date(b.submissionDate);
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortBy === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    } else if (sortBy === 'owner') {
      return sortDirection === 'asc' 
        ? a.ownerName.localeCompare(b.ownerName) 
        : b.ownerName.localeCompare(a.ownerName);
    }
    return 0;
  });
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle status filter change
  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };
  
  // Toggle filter panel
  const toggleFilterPanel = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  };
  
  // Handle sort change
  const handleSortChange = (field) => {
    if (sortBy === field) {
      // Toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };
  
  // View request details
  const viewRequestDetails = (request) => {
    setSelectedRequest(request);
    setIsRequestDetailsOpen(true);
  };
  
  // Open review modal for approval/rejection
  const openReviewModal = (request) => {
    setSelectedRequest(request);
    setRejectionReason('');
    setIsReviewModalOpen(true);
  };
  
  // Handle approving a request
  const handleApproveRequest = () => {
    // In a real app, this would be an API call
    const updatedRequests = requests.map(req => 
      req.id === selectedRequest.id 
        ? { 
            ...req, 
            status: 'approved',
            approvalDate: new Date().toISOString()
          } 
        : req
    );
    
    setRequests(updatedRequests);
    setIsReviewModalOpen(false);
    
    // Show success message
    setSuccessMessage(`Restaurant application for ${selectedRequest.name} has been approved.`);
    // Clear message after 3 seconds
    setTimeout(() => setSuccessMessage(''), 3000);
  };
  
  // Handle rejecting a request
  const handleRejectRequest = () => {
    if (!rejectionReason.trim()) {
      setErrorMessage('Please provide a reason for rejection.');
      return;
    }
    
    // In a real app, this would be an API call
    const updatedRequests = requests.map(req => 
      req.id === selectedRequest.id 
        ? { 
            ...req, 
            status: 'rejected',
            rejectionDate: new Date().toISOString(),
            rejectionReason
          } 
        : req
    );
    
    setRequests(updatedRequests);
    setIsReviewModalOpen(false);
    setErrorMessage('');
    
    // Show success message
    setSuccessMessage(`Restaurant application for ${selectedRequest.name} has been rejected.`);
    // Clear message after 3 seconds
    setTimeout(() => setSuccessMessage(''), 3000);
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Restaurant Applications</h1>
      <p className="text-gray-600 mb-8">Review and manage restaurant registration requests</p>
      
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
              placeholder="Search restaurant name or owner..."
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
        </div>
        
        {/* Expanded filter panel */}
        {isFilterPanelOpen && (
          <div className="bg-white p-6 rounded-md shadow-md mb-6 animate-fade-in">
            <h3 className="font-medium mb-4">Filter by Status</h3>
            <div className="space-y-2">
              <button
                className={`w-full text-left px-3 py-2 rounded-md ${selectedStatus === '' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                onClick={() => handleStatusChange('')}
              >
                All Requests
              </button>
              <button
                className={`w-full text-left px-3 py-2 rounded-md ${selectedStatus === 'pending' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                onClick={() => handleStatusChange('pending')}
              >
                Pending
              </button>
              <button
                className={`w-full text-left px-3 py-2 rounded-md ${selectedStatus === 'approved' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                onClick={() => handleStatusChange('approved')}
              >
                Approved
              </button>
              <button
                className={`w-full text-left px-3 py-2 rounded-md ${selectedStatus === 'rejected' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                onClick={() => handleStatusChange('rejected')}
              >
                Rejected
              </button>
            </div>
            
            <h3 className="font-medium mb-4 mt-6">Sort By</h3>
            <div className="space-y-2">
              <button
                className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between ${sortBy === 'date' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                onClick={() => handleSortChange('date')}
              >
                <span>Submission Date</span>
                {sortBy === 'date' && (
                  sortDirection === 'asc' ? (
                    <ArrowUp size={16} />
                  ) : (
                    <ArrowDown size={16} />
                  )
                )}
              </button>
              <button
                className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between ${sortBy === 'name' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                onClick={() => handleSortChange('name')}
              >
                <span>Restaurant Name</span>
                {sortBy === 'name' && (
                  sortDirection === 'asc' ? (
                    <ArrowUp size={16} />
                  ) : (
                    <ArrowDown size={16} />
                  )
                )}
              </button>
              <button
                className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between ${sortBy === 'owner' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                onClick={() => handleSortChange('owner')}
              >
                <span>Owner Name</span>
                {sortBy === 'owner' && (
                  sortDirection === 'asc' ? (
                    <ArrowUp size={16} />
                  ) : (
                    <ArrowDown size={16} />
                  )
                )}
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Requests table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Restaurant
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submission Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedRequests.map(request => (
                <tr key={request.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{request.name}</div>
                    <div className="text-xs text-gray-500">{request.cuisine}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{request.ownerName}</div>
                    <div className="text-xs text-gray-500">{request.ownerEmail}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(request.submissionDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(request.status)}`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-3">
                      <button 
                        className="text-primary hover:text-primary-dark"
                        onClick={() => viewRequestDetails(request)}
                      >
                        <Eye size={18} />
                      </button>
                      
                      {request.status === 'pending' && (
                        <button 
                          className="text-primary hover:text-primary-dark"
                          onClick={() => openReviewModal(request)}
                        >
                          Review
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              
              {sortedRequests.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No restaurant requests found with the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Request details modal */}
      {isRequestDetailsOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  Restaurant Application Details
                </h2>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setIsRequestDetailsOpen(false)}
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">{selectedRequest.name}</h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(selectedRequest.status)}`}>
                    {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm uppercase text-gray-500 font-medium mb-2">Restaurant Information</h4>
                    <div className="mb-4">
                      <p className="text-gray-600 text-sm">Cuisine Type:</p>
                      <p className="font-medium">{selectedRequest.cuisine}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Address:</p>
                      <address className="not-italic">
                        {selectedRequest.address.street}<br />
                        {selectedRequest.address.city}, {selectedRequest.address.state} {selectedRequest.address.zipCode}
                      </address>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm uppercase text-gray-500 font-medium mb-2">Owner Information</h4>
                    <div className="mb-2">
                      <p className="text-gray-600 text-sm">Name:</p>
                      <p className="font-medium">{selectedRequest.ownerName}</p>
                    </div>
                    <div className="mb-2">
                      <p className="text-gray-600 text-sm">Email:</p>
                      <p className="font-medium">{selectedRequest.ownerEmail}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Phone:</p>
                      <p className="font-medium">{selectedRequest.ownerPhone}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h4 className="text-sm uppercase text-gray-500 font-medium mb-3">Submitted Documents</h4>
                <div className="space-y-3">
                  <div className="border border-gray-200 rounded-lg p-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <FileText size={20} className="text-gray-500 mr-2" />
                      <span>Business License</span>
                    </div>
                    <span className={`text-sm ${selectedRequest.documents.businessLicense === 'approved' ? 'text-green-600' : 'text-gray-600'}`}>
                      {selectedRequest.documents.businessLicense === 'approved' ? 'Approved' : 'Uploaded'}
                    </span>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <FileText size={20} className="text-gray-500 mr-2" />
                      <span>Food Permit</span>
                    </div>
                    <span className={`text-sm ${selectedRequest.documents.foodPermit === 'approved' ? 'text-green-600' : selectedRequest.documents.foodPermit === 'missing' ? 'text-red-600' : 'text-gray-600'}`}>
                      {selectedRequest.documents.foodPermit === 'approved' ? 'Approved' : selectedRequest.documents.foodPermit === 'missing' ? 'Missing' : 'Uploaded'}
                    </span>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <FileText size={20} className="text-gray-500 mr-2" />
                      <span>Identity Proof</span>
                    </div>
                    <span className={`text-sm ${selectedRequest.documents.identityProof === 'approved' ? 'text-green-600' : 'text-gray-600'}`}>
                      {selectedRequest.documents.identityProof === 'approved' ? 'Approved' : 'Uploaded'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm uppercase text-gray-500 font-medium mb-3">Application Timeline</h4>
                <div className="border-l-2 border-gray-200 pl-4 ml-3 space-y-6">
                  <div className="relative">
                    <div className="absolute -left-[21px] bg-green-500 rounded-full w-4 h-4"></div>
                    <div>
                      <div className="text-sm text-gray-600">{formatDate(selectedRequest.submissionDate)}</div>
                      <p className="font-medium">Application Submitted</p>
                    </div>
                  </div>
                  
                  {selectedRequest.status === 'approved' && selectedRequest.approvalDate && (
                    <div className="relative">
                      <div className="absolute -left-[21px] bg-green-500 rounded-full w-4 h-4"></div>
                      <div>
                        <div className="text-sm text-gray-600">{formatDate(selectedRequest.approvalDate)}</div>
                        <p className="font-medium">Application Approved</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedRequest.status === 'rejected' && selectedRequest.rejectionDate && (
                    <div className="relative">
                      <div className="absolute -left-[21px] bg-red-500 rounded-full w-4 h-4"></div>
                      <div>
                        <div className="text-sm text-gray-600">{formatDate(selectedRequest.rejectionDate)}</div>
                        <p className="font-medium">Application Rejected</p>
                        <p className="text-sm text-gray-600 mt-1">Reason: {selectedRequest.rejectionReason}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end mt-8">
                <button
                  className="btn bg-gray-200 hover:bg-gray-300 text-gray-800"
                  onClick={() => setIsRequestDetailsOpen(false)}
                >
                  Close
                </button>
                
                {selectedRequest.status === 'pending' && (
                  <button
                    className="btn btn-primary ml-3"
                    onClick={() => {
                      setIsRequestDetailsOpen(false);
                      openReviewModal(selectedRequest);
                    }}
                  >
                    Review Application
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Review modal */}
      {isReviewModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  Review Application
                </h2>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setIsReviewModalOpen(false)}
                >
                  <X size={24} />
                </button>
              </div>
              
              <p className="mb-6">
                Review the application for <span className="font-semibold">{selectedRequest.name}</span>. Choose to approve or reject the restaurant application.
              </p>
              
              {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start">
                  <AlertCircle size={20} className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-red-700">{errorMessage}</span>
                </div>
              )}
              
              <div className="mb-6">
                <label htmlFor="rejectionReason" className="block text-gray-700 font-medium mb-2">Rejection Reason (required if rejecting)</label>
                <textarea
                  id="rejectionReason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="input h-32 resize-none"
                  placeholder="Provide a detailed reason for rejection..."
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  className="btn bg-gray-200 hover:bg-gray-300 text-gray-800"
                  onClick={() => setIsReviewModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleRejectRequest}
                >
                  Reject
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleApproveRequest}
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantRequestsPage;