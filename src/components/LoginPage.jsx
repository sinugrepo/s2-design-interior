import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  LockClosedIcon,
  UserIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated()) {
    return <Navigate to="/admin" replace />;
  }

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-beige-50 to-brand-brown-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-brown-600"></div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await login(formData.username, formData.password);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setIsSubmitting(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-beige-50 to-brand-brown-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="mx-auto h-16 w-16 bg-brand-brown-600 rounded-full flex items-center justify-center">
            <LockClosedIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access the admin panel
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-brown-500 focus:border-transparent transition-colors"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-brown-500 focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-brown-600 hover:bg-brand-brown-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-brown-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Back to Site Link */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-brand-brown-600 hover:text-brand-brown-700 transition-colors"
            >
              <HomeIcon className="h-4 w-4 mr-2" />
              Back to Website
            </Link>
          </div>
        </motion.div>

        {/* Demo Credentials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center"
        >
          <p className="text-sm text-blue-800 font-medium mb-2">Demo Credentials:</p>
          <p className="text-xs text-blue-600">
            Username: <span className="font-mono bg-blue-100 px-2 py-1 rounded">admin</span>
          </p>
          <p className="text-xs text-blue-600">
            Password: <span className="font-mono bg-blue-100 px-2 py-1 rounded">admin123</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
} 