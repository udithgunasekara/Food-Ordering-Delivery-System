import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, User, Mail, MapPin, Phone } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const RestaurantRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    restaurantName: '',
    ownerFullName: '',
    ownerEmail: '',
    ownerContact: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    latitude: '',
    longitude: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    // Get geolocation when component mounts
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          });
          setLoadingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Failed to get your location. Please try again.");
          setLoadingLocation(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setLoadingLocation(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const restaurantData = {
        restaurantName: formData.restaurantName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        address: formData.address,
        ownerEmail: formData.ownerEmail,
        ownerFullName: formData.ownerFullName,
        ownerContact: formData.ownerContact,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude)
      };

      const response = await axios.post(
        'http://localhost:8080/api/admin/register', 
        restaurantData
      );

      if (response.data && response.data.id) {
        setSuccess(`Restaurant registration successful! Your restaurant ID is ${response.data.id}`);
        
        toast.success(`Your restaurant registration is done under ID ${response.data.id}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register restaurant');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
            <Building2 className="h-6 w-6 text-orange-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Register Your Restaurant
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join FoodExpress and start serving customers today
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-green-100 text-green-700 rounded-md">
            {success}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="restaurantName" className="sr-only">
                Restaurant Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="restaurantName"
                  name="restaurantName"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                  placeholder="Restaurant Name"
                  value={formData.restaurantName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="ownerFullName" className="sr-only">
                Owner Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="ownerFullName"
                  name="ownerFullName"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                  placeholder="Owner Full Name"
                  value={formData.ownerFullName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="ownerEmail" className="sr-only">
                Owner Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="ownerEmail"
                  name="ownerEmail"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                  placeholder="Owner Email"
                  value={formData.ownerEmail}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="ownerContact" className="sr-only">
                Owner Contact
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="ownerContact"
                  name="ownerContact"
                  type="tel"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                  placeholder="Owner Contact Phone"
                  value={formData.ownerContact}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="contactEmail" className="sr-only">
                Restaurant Contact Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                  placeholder="Restaurant Contact Email"
                  value={formData.contactEmail}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="contactPhone" className="sr-only">
                Restaurant Contact Phone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="contactPhone"
                  name="contactPhone"
                  type="tel"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                  placeholder="Restaurant Contact Phone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="address" className="sr-only">
                Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                  placeholder="Restaurant Address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="latitude" className="sr-only">
                  Latitude
                </label>
                <input
                  id="latitude"
                  name="latitude"
                  type="text"
                  readOnly
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                  placeholder="Latitude"
                  value={loadingLocation ? "Loading..." : formData.latitude}
                />
              </div>
              <div>
                <label htmlFor="longitude" className="sr-only">
                  Longitude
                </label>
                <input
                  id="longitude"
                  name="longitude"
                  type="text"
                  readOnly
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                  placeholder="Longitude"
                  value={loadingLocation ? "Loading..." : formData.longitude}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={getCurrentLocation}
              className="group relative w-1/3 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              disabled={loadingLocation}
            >
              {loadingLocation ? "Getting Location..." : "Get Location"}
            </button>
            <button
              type="submit"
              className="group relative w-2/3 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              disabled={loadingLocation || !formData.latitude || !formData.longitude}
            >
              Register Restaurant
            </button>
          </div>
        </form>

        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-orange-500 hover:text-orange-600">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RestaurantRegisterPage;