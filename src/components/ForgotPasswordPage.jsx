import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  EnvelopeIcon,
  KeyIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

export default function ForgotPasswordPage() {
  const { forgotPassword, resetPassword, isAuthenticated } = useAuth();
  const [step, setStep] = useState('email'); // 'email', 'otp', 'success'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // Redirect if already authenticated
  if (isAuthenticated()) {
    return <Navigate to="/admin" replace />;
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await forgotPassword(email);
    
    if (result.success) {
      setMessage(result.message);
      setStep('otp');
    } else {
      setError(result.error);
    }
    
    setIsSubmitting(false);
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);

    const result = await resetPassword(email, otp, newPassword);
    
    if (result.success) {
      setMessage(result.message);
      setStep('success');
    } else {
      setError(result.error);
    }
    
    setIsSubmitting(false);
  };

  const handleOTPChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-gray-100 to-brand-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="mx-auto h-16 w-16 bg-brand-gray-600 rounded-full flex items-center justify-center">
            {step === 'email' && <EnvelopeIcon className="h-8 w-8 text-white" />}
            {step === 'otp' && <KeyIcon className="h-8 w-8 text-white" />}
            {step === 'success' && <CheckCircleIcon className="h-8 w-8 text-white" />}
          </div>
          <h2 className="mt-6 text-3xl font-bold text-brand-gray-900">
            {step === 'email' && 'Forgot Password'}
            {step === 'otp' && 'Verify OTP'}
            {step === 'success' && 'Password Reset'}
          </h2>
          <p className="mt-2 text-sm text-brand-gray-700">
            {step === 'email' && 'Enter your email to receive an OTP'}
            {step === 'otp' && 'Enter the OTP sent to your email and your new password'}
            {step === 'success' && 'Your password has been successfully reset'}
          </p>
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          {message && step !== 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm"
            >
              {message}
            </motion.div>
          )}

          {/* Email Step */}
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-brown-500 focus:border-transparent transition-colors"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-gray-600 hover:bg-brand-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending OTP...
                  </div>
                ) : (
                  'Send OTP'
                )}
              </button>
            </form>
          )}

          {/* OTP Step */}
          {step === 'otp' && (
            <form onSubmit={handleOTPSubmit} className="space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  OTP Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    value={otp}
                    onChange={handleOTPChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-brown-500 focus:border-transparent transition-colors text-center text-lg font-mono tracking-widest"
                    placeholder="000000"
                    maxLength="6"
                  />
                </div>
                <div className="mt-2 flex items-center text-xs text-gray-500">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  OTP expires in 10 minutes
                </div>
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-brown-500 focus:border-transparent transition-colors"
                    placeholder="Enter new password"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-brown-500 focus:border-transparent transition-colors"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="showPassword"
                  name="showPassword"
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="h-4 w-4 text-brand-brown-600 focus:ring-brand-brown-500 border-gray-300 rounded"
                />
                <label htmlFor="showPassword" className="ml-2 text-sm text-gray-700">
                  Show passwords
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-gray-600 hover:bg-brand-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Resetting Password...
                  </div>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          )}

          {/* Success Step */}
          {step === 'success' && (
            <div className="text-center space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-green-800 font-medium">Password Reset Successful!</p>
                <p className="text-green-600 text-sm mt-2">{message}</p>
              </div>

              <Link
                to="/admin/login"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-gray-600 hover:bg-brand-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gray-500 transition-colors"
              >
                Go to Login
              </Link>
            </div>
          )}

          {/* Back to Login Link */}
          {step !== 'success' && (
            <div className="mt-6 text-center">
              <Link
                to="/admin/login"
                className="inline-flex items-center text-sm text-brand-gray-600 hover:text-brand-gray-700 transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to Login
              </Link>
            </div>
          )}
        </motion.div>

        {/* Helper Text */}
        {step === 'email' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center"
          >
            <p className="text-sm text-blue-800 font-medium mb-2">Need Help?</p>
            <p className="text-xs text-blue-600">
              Enter the email address associated with your admin account. 
              You'll receive a 6-digit OTP code to reset your password.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
