import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Check, AlertCircle, MapPin, Phone, Mail, FileText, User, Store, Upload, ChevronRight } from 'lucide-react';

const RegistrationPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    cuisine: '',
    description: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    phone: user?.phone || '',
    website: '',
    ownerName: user?.name || '',
    ownerEmail: user?.email || '',
    ownerPhone: user?.phone || '',
    businessLicense: false,
    foodSafetyPermit: false,
    identityProof: false
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleFileUpload = (name) => {
    // In a real app, this would handle file upload
    // For this demo, we'll just simulate a successful upload
    setFormData({
      ...formData,
      [name]: true
    });
  };
  
  const validateStep1 = () => {
    if (!formData.name.trim()) {
      setError('Restaurant name is required');
      return false;
    }
    
    if (!formData.cuisine.trim()) {
      setError('Cuisine type is required');
      return false;
    }
    
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    
    return true;
  };
  
  const validateStep2 = () => {
    if (!formData.address.street.trim()) {
      setError('Street address is required');
      return false;
    }
    
    if (!formData.address.city.trim()) {
      setError('City is required');
      return false;
    }
    
    if (!formData.address.state.trim()) {
      setError('State is required');
      return false;
    }
    
    if (!formData.address.zipCode.trim()) {
      setError('Zip code is required');
      return false;
    }
    
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    
    return true;
  };
  
  const validateStep3 = () => {
    if (!formData.ownerName.trim()) {
      setError('Owner name is required');
      return false;
    }
    
    if (!formData.ownerEmail.trim()) {
      setError('Owner email is required');
      return false;
    }
    
    if (!formData.ownerPhone.trim()) {
      setError('Owner phone is required');
      return false;
    }
    
    return true;
  };
  
  const validateStep4 = () => {
    if (!formData.businessLicense) {
      setError('Business license is required');
      return false;
    }
    
    if (!formData.foodSafetyPermit) {
      setError('Food safety permit is required');
      return false;
    }
    
    if (!formData.identityProof) {
      setError('Identity proof is required');
      return false;
    }
    
    return true;
  };
  
  const handleNextStep = () => {
    setError('');
    
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    } else if (step === 3 && validateStep3()) {
      setStep(4);
    }
  };
  
  const handlePrevStep = () => {
    setStep(step - 1);
    setError('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateStep4()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Add a small delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would submit to the server
      // For now, just move to success step
      setStep(5);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFinish = () => {
    if (isAuthenticated && user.role === 'ROLE_RESTAURANT_ADMIN') {
      navigate('/restaurant/dashboard');
    } else {
      navigate('/login');
    }
  };
  
  // Cuisine types
  const cuisineTypes = [
    'American', 'Italian', 'Mexican', 'Chinese', 'Japanese', 'Thai', 
    'Indian', 'French', 'Mediterranean', 'Middle Eastern', 'Korean', 
    'Vietnamese', 'Greek', 'Spanish', 'Caribbean', 'Vegetarian', 'Vegan'
  ];
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-custom py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-center">Restaurant Registration</h1>
          <p className="text-gray-600 text-center mb-8">Join our platform to expand your restaurant's reach</p>
          
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className={`text-sm font-medium ${step >= 1 ? 'text-primary' : 'text-gray-500'}`}>Restaurant Info</span>
              <span className={`text-sm font-medium ${step >= 2 ? 'text-primary' : 'text-gray-500'}`}>Location</span>
              <span className={`text-sm font-medium ${step >= 3 ? 'text-primary' : 'text-gray-500'}`}>Owner Details</span>
              <span className={`text-sm font-medium ${step >= 4 ? 'text-primary' : 'text-gray-500'}`}>Documents</span>
              <span className={`text-sm font-medium ${step >= 5 ? 'text-primary' : 'text-gray-500'}`}>Complete</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${(step / 5) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start">
              <AlertCircle size={20} className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-red-700">{error}</span>
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            {/* Step 1: Restaurant Info */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-bold mb-6">Restaurant Information</h2>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Restaurant Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Store size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input pl-10"
                        placeholder="e.g. Delicious Bites"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="cuisine" className="block text-gray-700 font-medium mb-2">Cuisine Type</label>
                    <select
                      id="cuisine"
                      name="cuisine"
                      value={formData.cuisine}
                      onChange={handleChange}
                      className="input"
                      required
                    >
                      <option value="" disabled>Select cuisine type</option>
                      {cuisineTypes.map(cuisine => (
                        <option key={cuisine} value={cuisine}>{cuisine}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Restaurant Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="input h-32 resize-none"
                      placeholder="Tell us about your restaurant, its concept, and what makes it special..."
                      required
                    ></textarea>
                  </div>
                </div>
                
                <div className="flex justify-end mt-8">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNextStep}
                  >
                    Next
                    <ChevronRight size={18} className="ml-1" />
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 2: Location */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-bold mb-6">Restaurant Location</h2>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="address.street" className="block text-gray-700 font-medium mb-2">Street Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="address.street"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleChange}
                        className="input pl-10"
                        placeholder="123 Main St"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="address.city" className="block text-gray-700 font-medium mb-2">City</label>
                      <input
                        type="text"
                        id="address.city"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleChange}
                        className="input"
                        placeholder="City"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="address.state" className="block text-gray-700 font-medium mb-2">State</label>
                      <input
                        type="text"
                        id="address.state"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleChange}
                        className="input"
                        placeholder="State"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="address.zipCode" className="block text-gray-700 font-medium mb-2">Zip Code</label>
                      <input
                        type="text"
                        id="address.zipCode"
                        name="address.zipCode"
                        value={formData.address.zipCode}
                        onChange={handleChange}
                        className="input"
                        placeholder="Zip Code"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Restaurant Phone</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input pl-10"
                        placeholder="(123) 456-7890"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="website" className="block text-gray-700 font-medium mb-2">Website (Optional)</label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="input"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
                
                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    className="btn bg-gray-200 hover:bg-gray-300 text-gray-800"
                    onClick={handlePrevStep}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNextStep}
                  >
                    Next
                    <ChevronRight size={18} className="ml-1" />
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 3: Owner Details */}
            {step === 3 && (
              <div>
                <h2 className="text-xl font-bold mb-6">Owner Information</h2>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="ownerName" className="block text-gray-700 font-medium mb-2">Owner Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="ownerName"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleChange}
                        className="input pl-10"
                        placeholder="Full Name"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="ownerEmail" className="block text-gray-700 font-medium mb-2">Owner Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="ownerEmail"
                        name="ownerEmail"
                        value={formData.ownerEmail}
                        onChange={handleChange}
                        className="input pl-10"
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="ownerPhone" className="block text-gray-700 font-medium mb-2">Owner Phone</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        id="ownerPhone"
                        name="ownerPhone"
                        value={formData.ownerPhone}
                        onChange={handleChange}
                        className="input pl-10"
                        placeholder="(123) 456-7890"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    className="btn bg-gray-200 hover:bg-gray-300 text-gray-800"
                    onClick={handlePrevStep}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNextStep}
                  >
                    Next
                    <ChevronRight size={18} className="ml-1" />
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 4: Documents */}
            {step === 4 && (
              <form onSubmit={handleSubmit}>
                <h2 className="text-xl font-bold mb-6">Required Documents</h2>
                
                <p className="mb-6 text-gray-600">
                  Please upload the following documents to verify your restaurant. 
                  All documents must be in PDF, JPG, or PNG format.
                </p>
                
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <FileText size={20} className="text-gray-500 mr-2" />
                        <span className="font-medium">Business License</span>
                      </div>
                      {formData.businessLicense ? (
                        <span className="text-green-600 flex items-center">
                          <Check size={16} className="mr-1" />
                          Uploaded
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="btn bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm py-1"
                          onClick={() => handleFileUpload('businessLicense')}
                        >
                          <Upload size={16} className="mr-1" />
                          Upload
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">Valid business license or permit issued by your local government</p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <FileText size={20} className="text-gray-500 mr-2" />
                        <span className="font-medium">Food Safety Permit</span>
                      </div>
                      {formData.foodSafetyPermit ? (
                        <span className="text-green-600 flex items-center">
                          <Check size={16} className="mr-1" />
                          Uploaded
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="btn bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm py-1"
                          onClick={() => handleFileUpload('foodSafetyPermit')}
                        >
                          <Upload size={16} className="mr-1" />
                          Upload
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">Health department food service permit or certificate</p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <FileText size={20} className="text-gray-500 mr-2" />
                        <span className="font-medium">Identity Proof</span>
                      </div>
                      {formData.identityProof ? (
                        <span className="text-green-600 flex items-center">
                          <Check size={16} className="mr-1" />
                          Uploaded
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="btn bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm py-1"
                          onClick={() => handleFileUpload('identityProof')}
                        >
                          <Upload size={16} className="mr-1" />
                          Upload
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">Government-issued ID of the restaurant owner</p>
                  </div>
                </div>
                
                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    className="btn bg-gray-200 hover:bg-gray-300 text-gray-800"
                    onClick={handlePrevStep}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className={`btn btn-primary ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            )}
            
            {/* Step 5: Success */}
            {step === 5 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Check size={32} className="text-green-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
                <p className="text-gray-600 mb-6">
                  Your restaurant registration application has been submitted successfully. 
                  Our team will review your information and documents, and we'll get back to you within 2-3 business days.
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleFinish}
                >
                  {isAuthenticated ? 'Go to Dashboard' : 'Return to Login'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;