import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [multipleRoles, setMultipleRoles] = useState<string[]>([]);
  const { login, setCurrentRole } = useAuth();
  const navigate = useNavigate();

  const redirectToDashboard = (role: string) => {


    console.log("Received role:", role, "and redirecting to page:", role);
    setCurrentRole(role); // Set the current role in context


    setTimeout(() => {
      if (role === 'ROLE_SYSADMIN') {
        console.log("Redirecting to admin dashboard");
        navigate('/admin/dashboard');
      } else if (role === 'ROLE_RESTAURANT_ADMIN') {
        console.log("redirecting to restaurant admin dashboard");
        navigate('/restaurant/dashboard');
      } else if (role === 'ROLE_DELIVERY_AGENT') {
        console.log("redirecting to delivery agent dashboard");
        navigate('/delivery/dashboard');
      } else {
        console.log("redirecting to home page");
        navigate('/');
      }
    }, 100);


  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      // For demo purposes, use specific emails to log in as different user types
      if (!email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }
      
      // Simulate API call
      const success = await login(email, password);
      
      if (!success) {
        throw new Error('Invalid login credentials');
      }

      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const roles:string[] = user.role || [];
      console.log("User roles:", roles);
      

      if(roles.length ===1 ){
        redirectToDashboard(roles[0]);
      }else{
        setMultipleRoles(roles);
      }
      
      // // Redirect based on user role
      // if (email.includes('admin')) {
      //   navigate('/admin/dashboard');
      // } else if (email.includes('restaurant')) {
      //   navigate('/restaurant/dashboard');
      // } else if (email.includes('driver')) {
      //   navigate('/delivery/dashboard');
      // } else {
      //   navigate('/');
      // }

      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };


  const handleRoleSelection = (selected: string) => {
    console.log(selected + " selected");
    redirectToDashboard(selected); 
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center">
          <ShoppingBag className="h-12 w-12 text-orange-500" />
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/register" className="font-medium text-orange-500 hover:text-orange-400">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                {/* <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  placeholder="you@example.com"
                  required
                /> */}
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                {/* <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  placeholder="••••••••"
                  required
                /> */}
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-300 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
            {multipleRoles.length > 1 && (
              <div className="mt-6 space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-300">Select your role:</p>
                {multipleRoles.map((role) => (
                  <button
                    key={role}
                    onClick={() => handleRoleSelection(role)}
                    className="w-full border py-2 px-4 rounded bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    Continue as {role.replace('ROLE_', '').replace('_', ' ').toLowerCase()}
                  </button>
                ))}
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;